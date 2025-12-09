import { signIn } from "@/auth";

export async function login(credentials: { email: string; password: string }) {
  try {
    const response = await fetch(`${process.env.API_HOST}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function loginFormulario(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const result = await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }
    return { success: true };
  } catch (error) {
    throw error;
  }
}
