"use client";

import { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Calendar, Car, Copy, Download, Mail, MapPin, MessageCircle, Share2, User, Users } from "lucide-react";
import { PASS_TYPE_LABELS, VEHICLE_TYPE_LABELS, VehicleType } from "@/types/api";
import type { PassDto } from "@/types/models";

const dateFormat = new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" });
const formatDate = (iso: string) => dateFormat.format(new Date(iso));

/** Estado visible del pase para quien lo recibe. */
function passState(pass: PassDto, now: number): { label: string; className: string } {
  if (pass.status === "Cancelled") return { label: "Cancelado", className: "bg-red-100 text-red-700" };
  if (pass.status === "Completed" && pass.passType === "SingleEntry")
    return { label: "Utilizado", className: "bg-gray-100 text-gray-700" };
  if (pass.validTo && now > new Date(pass.validTo).getTime()) return { label: "Vencido", className: "bg-gray-100 text-gray-700" };
  if (now < new Date(pass.validFrom).getTime()) return { label: "Todavía no vigente", className: "bg-amber-100 text-amber-800" };
  return { label: "Vigente", className: "bg-emerald-100 text-emerald-700" };
}

/** Enlace público del pase: lo puede abrir la visita sin iniciar sesión. */
const publicUrl = (token: string) => `${window.location.origin}/pass/${encodeURIComponent(token)}`;
const pdfUrl = (token: string) => `/pass/${encodeURIComponent(token)}/pdf`;

function shareText(pass: PassDto, url: string) {
  const until = pass.validTo ? ` hasta ${formatDate(pass.validTo)}` : "";
  return `Hola ${pass.visitorName}, este es tu pase de ingreso a Country Secure (desde ${formatDate(pass.validFrom)}${until}). Presentá el código QR en la guardia: ${url}`;
}

function Row({ icon: Icon, label, children }: { icon: typeof User; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={18} className="mt-0.5 shrink-0 text-purple-600" aria-hidden />
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
        <p className="font-medium text-gray-900 break-words">{children}</p>
      </div>
    </div>
  );
}

/**
 * Pase digital: el QR (token firmado) va en la esquina superior izquierda, seguido de los datos del residente,
 * del visitante, del vehículo y de la ventana horaria. Permite descargar el PDF y compartirlo con la visita.
 */
export function PassCard({ pass, showActions = true }: { pass: PassDto; showActions?: boolean }) {
  // eslint-disable-next-line react-hooks/purity -- el estado se calcula con la hora actual al renderizar
  const state = useMemo(() => passState(pass, Date.now()), [pass]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl(pass.token));
      toast.success("Enlace copiado.");
    } catch {
      toast.error("No se pudo copiar el enlace.");
    }
  };

  // Menú nativo de compartir (celulares): intenta adjuntar el PDF y, si no se puede, comparte el enlace
  const nativeShare = async () => {
    const url = publicUrl(pass.token);
    try {
      const response = await fetch(pdfUrl(pass.token));
      if (response.ok) {
        const file = new File([await response.blob()], "pase-de-ingreso.pdf", { type: "application/pdf" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: "Pase de ingreso", text: shareText(pass, url) });
          return;
        }
      }
      await navigator.share({ title: "Pase de ingreso", text: shareText(pass, url), url });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return; // el usuario cerró el menú
      toast.error("No se pudo compartir el pase.");
    }
  };

  const openWhatsApp = () =>
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText(pass, publicUrl(pass.token)))}`, "_blank", "noopener");

  const openEmail = () => {
    const subject = encodeURIComponent("Tu pase de ingreso a Country Secure");
    const body = encodeURIComponent(shareText(pass, publicUrl(pass.token)));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const onFoot = pass.vehicleType === VehicleType.OnFoot;
  const canShareNatively = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const baseAction = "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition";
  const actionClass = `${baseAction} border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50`;
  const primaryClass = `${baseAction} sm:col-span-2 border-purple-600 bg-purple-600 text-white hover:bg-purple-700`;

  return (
    <article className="w-full max-w-2xl rounded-3xl border border-violet-100 bg-white p-6 shadow-xl sm:p-8">
      {/* Encabezado: QR arriba a la izquierda */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="shrink-0 self-center rounded-2xl border border-gray-200 bg-white p-3 sm:self-start">
          <QRCodeSVG value={pass.token} size={168} level="Q" marginSize={0} aria-label="Código QR del pase" role="img" />
        </div>

        <div className="min-w-0 flex-1 space-y-2 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">Pase de ingreso</p>
          <h2 className="text-2xl font-bold text-gray-900 break-words">{pass.visitorName}</h2>
          <p className="text-sm text-gray-500">{PASS_TYPE_LABELS[pass.passType]}</p>
          <span
            suppressHydrationWarning
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${state.className}`}
          >
            {state.label}
          </span>
        </div>
      </header>

      <hr className="my-6 border-gray-100" />

      <div className="grid gap-5 sm:grid-cols-2">
        <Row icon={User} label="Residente anfitrión">
          {pass.residentName}
        </Row>
        <Row icon={MapPin} label="Lote / casa">
          {pass.destination}
        </Row>
        <Row icon={Users} label="Visitante">
          DNI {pass.visitorDni} · {pass.companionsCount === 0 ? "sin acompañantes" : `${pass.companionsCount} acompañante${pass.companionsCount === 1 ? "" : "s"}`}
        </Row>
        <Row icon={Car} label="Vehículo">
          {onFoot
            ? VEHICLE_TYPE_LABELS.OnFoot
            : `${VEHICLE_TYPE_LABELS[pass.vehicleType]} · ${pass.vehiclePlate ?? "sin patente"}${pass.vehicleModel ? ` · ${pass.vehicleModel}` : ""}`}
        </Row>
        <div className="sm:col-span-2">
          <Row icon={Calendar} label="Horario autorizado">
            {formatDate(pass.validFrom)} {pass.validTo ? `a ${formatDate(pass.validTo)}` : "(sin vencimiento)"}
          </Row>
        </div>
      </div>

      <p className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
        Presentá este código QR en la guardia, desde el celular o impreso, junto con tu documento. Solo es válido dentro del
        horario autorizado.
      </p>

      {showActions && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a href={pdfUrl(pass.token)} download className={primaryClass}>
            <Download size={18} aria-hidden /> Descargar PDF
          </a>
          <button type="button" onClick={openWhatsApp} className={actionClass}>
            <MessageCircle size={18} aria-hidden /> WhatsApp
          </button>
          <button type="button" onClick={openEmail} className={actionClass}>
            <Mail size={18} aria-hidden /> Email
          </button>
          <button type="button" onClick={copyLink} className={actionClass}>
            <Copy size={18} aria-hidden /> Copiar enlace
          </button>
          {canShareNatively && (
            <button type="button" onClick={nativeShare} className={actionClass}>
              <Share2 size={18} aria-hidden /> Compartir…
            </button>
          )}
        </div>
      )}
    </article>
  );
}
