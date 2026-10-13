"use server";

import { auth } from "@/auth";
import { IloteRegister, IPropiedadRegister, IPropiedadResidente } from "@/types";

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

export async function newPropiedad(data: IPropiedadRegister) {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.API_HOST}/api/property`, {
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
    console.error("Error en newPropiedad:", error);
    throw error;
  }
}

// Propiedades del residente autenticado (GET /api/property/me)
export async function getMyProperties(): Promise<IPropiedadResidente[]> {
  const session = await auth();

  const response = await fetch(`${process.env.API_HOST}/api/property/me`, {
    headers: { Authorization: `Bearer ${session?.accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Error al obtener propiedades (${response.status})`);
  return response.json();
}
