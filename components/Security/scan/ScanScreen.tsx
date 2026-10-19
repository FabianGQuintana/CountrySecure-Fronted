"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, CameraOff, CloudOff, LogIn, LogOut, RefreshCw, ScanLine, Wifi } from "lucide-react";
import { scanPass, syncPasses } from "@/features/entry-permissions/actions";
import type { ScanAction } from "@/types/api";
import { ScanResultOverlay, type OverlayState } from "./ScanResultOverlay";
import { createFeedbackPlayer, resultTitle } from "./scanFeedback";
import {
  applyToCache,
  loadCache,
  loadQueue,
  saveCache,
  saveQueue,
  validateOffline,
  type PassCache,
  type QueuedScan,
} from "./offlineStore";

const READER_ID = "qr-reader";
// Tras cerrar un resultado se ignora el mismo QR un rato: el visitante todavía lo está mostrando
const SAME_QR_COOLDOWN_MS = 3000;
const HISTORY_SIZE = 8;
// La lista de pases del día se renueva cada 5 minutos
const SYNC_INTERVAL_MS = 5 * 60 * 1000;

interface HistoryEntry {
  id: number;
  at: Date;
  title: string;
  name: string;
  success: boolean;
}

/**
 * Pantalla de la guardia: lee el QR del pase (cámara, lector USB o a mano), lo valida contra el backend
 * y muestra el resultado a pantalla completa (verde = aprobado, rojo = rechazado) con sonido.
 */
export default function ScanScreen() {
  const [action, setAction] = useState<ScanAction>("CheckIn");
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manual, setManual] = useState("");
  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Respaldo sin conexión
  const [offline, setOffline] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const cacheRef = useRef<PassCache | null>(null);
  const flushingRef = useRef(false);

  // Las lecturas de la cámara llegan fuera del ciclo de render: se usan refs para ver siempre el valor actual
  const busyRef = useRef(false);
  const lastRef = useRef<{ token: string; at: number } | null>(null);
  const actionRef = useRef<ScanAction>(action);
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const feedbackRef = useRef<ReturnType<typeof createFeedbackPlayer> | null>(null);
  const historyId = useRef(0);

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  const player = () => (feedbackRef.current ??= createFeedbackPlayer());

  const showOverlay = useCallback((state: OverlayState, token: string, name: string) => {
    const success = state.kind === "result" && state.success;
    if (success) player().success();
    else player().error();

    const title = state.kind === "result" ? resultTitle(state) : "NO SE PUDO VALIDAR";
    setHistory((prev) =>
      [{ id: ++historyId.current, at: new Date(), title, name, success }, ...prev].slice(0, HISTORY_SIZE)
    );
    lastRef.current = { token, at: Date.now() };
    setOverlay(state);
  }, []);

  // Un fallo de red (sin internet o API caída) activa el modo sin conexión; un rechazo del servidor NO.
  const isNetworkFailure = (result: Awaited<ReturnType<typeof scanPass>>) => !result.ok && result.status === 503;

  const scanOffline = useCallback(
    (token: string): { state: OverlayState; name: string } => {
      const cache = cacheRef.current;
      if (!cache) {
        return {
          state: { kind: "error", message: "Sin conexión y sin lista de pases descargada. Conectate una vez para poder validar sin red." },
          name: "—",
        };
      }
      const now = new Date();
      const { result, updated } = validateOffline(cache, token, actionRef.current, now);

      if (updated) {
        cacheRef.current = applyToCache(cache, updated);
        const queue: QueuedScan[] = [...loadQueue(), { token, action: actionRef.current, scannedAt: now.toISOString() }];
        saveQueue(queue);
        setPending(queue.length);
      }

      return {
        state: { kind: "result", success: result.success, outcome: result.outcome, reason: result.reason, message: result.message, pass: result.pass, offline: true },
        name: result.pass?.visitorName ?? "Pase desconocido",
      };
    },
    []
  );

  const handleToken = useCallback(
    async (raw: string) => {
      const token = raw.trim();
      if (!token || busyRef.current) return;
      const last = lastRef.current;
      if (last && last.token === token && Date.now() - last.at < SAME_QR_COOLDOWN_MS) return;

      busyRef.current = true; // sigue ocupado hasta que el guardia cierre el resultado

      let result: Awaited<ReturnType<typeof scanPass>> | null = null;
      if (!navigator.onLine) {
        setOffline(true);
      } else {
        try {
          result = await scanPass({ token, action: actionRef.current });
        } catch {
          result = null; // sin red: la Server Action ni siquiera llegó al servidor
        }
      }

      if (!result || isNetworkFailure(result)) {
        setOffline(true);
        const fallback = scanOffline(token);
        showOverlay(fallback.state, token, fallback.name);
        return;
      }

      setOffline(false);
      if (!result.ok) {
        showOverlay({ kind: "error", message: result.error }, token, "—");
        return;
      }

      const { success, outcome, reason, message, pass } = result.data;
      showOverlay({ kind: "result", success, outcome, reason, message, pass }, token, pass?.visitorName ?? "Pase desconocido");
    },
    [showOverlay, scanOffline]
  );

  // ---- Sincronización ----
  /** Envía al servidor los escaneos hechos sin conexión, en orden. Se detiene si vuelve a caerse la red. */
  const flushQueue = useCallback(async () => {
    if (flushingRef.current) return;
    flushingRef.current = true;
    try {
      let queue = loadQueue();
      while (queue.length > 0) {
        const item = queue[0];
        let result: Awaited<ReturnType<typeof scanPass>>;
        try {
          result = await scanPass({ token: item.token, action: item.action, offline: true, scannedAt: item.scannedAt });
        } catch {
          return; // sin red: se reintenta en la próxima sincronización
        }
        if (isNetworkFailure(result)) return;

        queue = queue.slice(1);
        saveQueue(queue);
        setPending(queue.length);

        if (!result.ok) toast.error(`No se pudo sincronizar un ingreso: ${result.error}`);
        else if (!result.data.success) {
          toast.warning(`Un escaneo sin conexión fue rechazado al sincronizar (${result.data.pass?.visitorName ?? "pase"}): ${result.data.message}`, { duration: 15000 });
        }
      }
    } finally {
      flushingRef.current = false;
    }
  }, []);

  /** Envía lo pendiente y descarga la lista actualizada de pases del día. */
  const syncNow = useCallback(async () => {
    setSyncing(true);
    try {
      await flushQueue();
      if (loadQueue().length > 0) {
        setOffline(true);
        return;
      }
      let result: Awaited<ReturnType<typeof syncPasses>>;
      try {
        result = await syncPasses();
      } catch {
        setOffline(true);
        return;
      }
      if (!result.ok) {
        if (result.status === 503) setOffline(true);
        return;
      }
      const cache: PassCache = { generatedAt: result.data.generatedAt, items: result.data.items };
      cacheRef.current = cache;
      saveCache(cache);
      setLastSync(cache.generatedAt);
      setOffline(false);
    } finally {
      setSyncing(false);
    }
  }, [flushQueue]);

  useEffect(() => {
    const cached = loadCache();
    cacheRef.current = cached;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restaura el respaldo guardado en este dispositivo
    setLastSync(cached?.generatedAt ?? null);
    setPending(loadQueue().length);
    setOffline(!navigator.onLine);

    void syncNow();
    const timer = setInterval(() => void syncNow(), SYNC_INTERVAL_MS);
    const onOnline = () => void syncNow();
    const onOffline = () => setOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      clearInterval(timer);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [syncNow]);

  const closeOverlay = useCallback(() => {
    setOverlay(null);
    if (lastRef.current) lastRef.current.at = Date.now();
    busyRef.current = false;
  }, []);

  // ---- Cámara ----
  const stopCamera = useCallback(async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    if (!scanner) return;
    try {
      if (scanner.isScanning) await scanner.stop();
      scanner.clear();
    } catch {
      /* ya estaba detenida */
    }
  }, []);

  const startCamera = async () => {
    player().unlock(); // el audio solo se habilita después de un gesto del usuario
    setCameraError(null);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode(READER_ID, { verbose: false });
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: (width, height) => {
            const side = Math.floor(Math.min(width, height) * 0.7);
            return { width: side, height: side };
          },
        },
        (decoded) => void handleToken(decoded),
        () => undefined // errores de lectura cuadro a cuadro: normales mientras no hay QR enfrente
      );
      setCameraOn(true);
    } catch (error) {
      scannerRef.current = null;
      setCameraOn(false);
      setCameraError(
        error instanceof Error && /permission|denied|notallowed/i.test(error.message)
          ? "Permiso de cámara denegado. Habilitalo en el navegador o ingresá el código a mano."
          : "No se pudo iniciar la cámara. Ingresá el código a mano o usá un lector USB."
      );
    }
  };

  const toggleCamera = async () => {
    if (cameraOn) {
      await stopCamera();
      setCameraOn(false);
    } else {
      await startCamera();
    }
  };

  useEffect(() => () => void stopCamera(), [stopCamera]);

  const submitManual = (event: React.FormEvent) => {
    event.preventDefault();
    player().unlock();
    const value = manual;
    setManual("");
    if (!value.trim()) {
      toast.error("Ingresá el código del pase.");
      return;
    }
    void handleToken(value);
  };

  const modeButton = (value: ScanAction, label: string, Icon: typeof LogIn) => (
    <button
      type="button"
      onClick={() => setAction(value)}
      aria-pressed={action === value}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-semibold transition ${
        action === value ? "bg-purple-600 text-white shadow-lg" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
      }`}
    >
      <Icon size={20} aria-hidden /> {label}
    </button>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 pt-20 sm:p-8 lg:pt-8">
      <header>
        <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
          <ScanLine className="text-purple-400" aria-hidden /> Escanear pase
        </h1>
        <p className="mt-1 text-slate-400">
          Apuntá la cámara al QR del visitante. El ingreso se registra automáticamente si el pase es válido.
        </p>
      </header>

      <div
        role="status"
        className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border px-4 py-3 text-sm ${
          offline ? "border-amber-500/40 bg-amber-500/10 text-amber-200" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
        }`}
      >
        {offline ? <CloudOff size={18} aria-hidden /> : <Wifi size={18} aria-hidden />}
        <span className="font-semibold">{offline ? "Sin conexión: validando con la lista guardada" : "Conectado"}</span>
        <span className="opacity-80">
          {lastSync
            ? `Lista de pases: ${new Date(lastSync).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}`
            : "Lista de pases sin descargar"}
        </span>
        {pending > 0 && <span className="rounded-full bg-amber-500/30 px-2.5 py-0.5 font-semibold">{pending} pendiente{pending === 1 ? "" : "s"} de enviar</span>}
        <button
          type="button"
          onClick={() => void syncNow()}
          disabled={syncing}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 font-medium hover:bg-white/20 disabled:opacity-50"
        >
          <RefreshCw size={14} className={syncing ? "animate-spin" : ""} aria-hidden /> Sincronizar
        </button>
      </div>

      <div role="group" aria-label="Acción a registrar" className="flex gap-3">
        {modeButton("CheckIn", "Registrar ingreso", LogIn)}
        {modeButton("CheckOut", "Registrar salida", LogOut)}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
        <div id={READER_ID} className={cameraOn ? "w-full" : "hidden"} />
        {!cameraOn && (
          <div className="flex flex-col items-center gap-4 px-6 py-14 text-center text-slate-400">
            <CameraOff size={56} aria-hidden />
            <p>{cameraError ?? "La cámara está apagada."}</p>
          </div>
        )}
        <div className="border-t border-slate-700 p-4">
          <button
            type="button"
            onClick={toggleCamera}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700"
          >
            <Camera size={20} aria-hidden /> {cameraOn ? "Apagar cámara" : "Activar cámara"}
          </button>
        </div>
      </section>

      <form onSubmit={submitManual} className="space-y-2 rounded-2xl border border-slate-700 bg-slate-900 p-4">
        <label htmlFor="manual-token" className="text-sm font-medium text-slate-300">
          Ingresar código a mano (o con lector USB)
        </label>
        <div className="flex gap-2">
          <input
            id="manual-token"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="Pegá o escaneá el código del pase"
            className="min-w-0 flex-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          />
          <button type="submit" className="rounded-xl bg-slate-700 px-5 py-3 font-semibold text-white hover:bg-slate-600">
            Validar
          </button>
        </div>
      </form>

      {history.length > 0 && (
        <section aria-label="Últimos escaneos" className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Últimos escaneos</h2>
          <ul className="divide-y divide-slate-800 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
            {history.map((entry) => (
              <li key={entry.id} className="flex items-center gap-3 px-4 py-3">
                <span className={`h-3 w-3 shrink-0 rounded-full ${entry.success ? "bg-emerald-500" : "bg-red-500"}`} aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{entry.name}</p>
                  <p className="text-xs text-slate-400">{entry.title}</p>
                </div>
                <time className="text-xs text-slate-500" dateTime={entry.at.toISOString()}>
                  {entry.at.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </time>
              </li>
            ))}
          </ul>
        </section>
      )}

      {overlay && <ScanResultOverlay state={overlay} onClose={closeOverlay} />}
    </div>
  );
}
