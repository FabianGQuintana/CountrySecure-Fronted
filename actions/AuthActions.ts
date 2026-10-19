// Llamada al backend usada solo por el provider de credenciales de NextAuth (lib/authOptions.ts).
export async function login(credentials: { email: string; password: string }) {
  const response = await fetch(`${process.env.API_HOST}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });

  // El backend responde 401 con { message } ante credenciales inválidas
  return response.json();
}
