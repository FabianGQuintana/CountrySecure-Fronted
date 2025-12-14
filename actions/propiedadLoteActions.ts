import { auth } from "@/auth";
import { IloteRegister } from "@/types";

export async function newLote(data: IloteRegister) {
  const session = await auth();

  try {
    const response = await fetch(`${process.env.API_HOST}/api/lot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Error backend:", response.status, errorBody);
      throw new Error(`Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en newLote:", error);
    throw error;
  }
}
