"use server";

import { auth } from "@/auth";
import { IOrderRegister } from "@/types";

export async function newOrder(data: IOrderRegister) {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.API_HOST}/api/order`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("error al crear nueva order");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function AltaBaja(id: string) {
  const session = await auth();
  try {
    const response = await fetch(
      `${process.env.API_HOST}/api/order/${id}/Softdelete`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    if (!response.ok) throw new Error("error alta o baja de order");
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function updateOrder(id: string, data: Partial<IOrderRegister>) {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.API_HOST}/api/order/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Error al actualizar la orden: ${errText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
