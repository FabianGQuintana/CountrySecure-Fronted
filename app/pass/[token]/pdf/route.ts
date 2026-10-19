// PDF del pase para la visita. El token firmado del enlace es la única credencial: no requiere sesión.
// El navegador nunca habla con la API .NET: este handler hace de intermediario.
const API_URL = (process.env.API_HOST ?? "").replace(/\/$/, "");

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  let upstream: Response;
  try {
    upstream = await fetch(`${API_URL}/api/passes/${encodeURIComponent(token)}/pdf`, {
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    return new Response("El servicio no está disponible. Intentá de nuevo en unos instantes.", { status: 503 });
  }

  if (upstream.status === 404) return new Response("El pase no existe o fue cancelado.", { status: 404 });
  if (!upstream.ok) return new Response("No se pudo generar el pase.", { status: 502 });

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": upstream.headers.get("content-disposition") ?? 'attachment; filename="pase-de-ingreso.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
