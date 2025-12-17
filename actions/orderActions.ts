"use server";

import { auth } from "@/auth";
import { IOrderRegister } from "@/types";
import { OrderResponseDto } from "@/types/order";

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
      `${process.env.API_HOST}/api/order/${id}/softdelete`,
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

export async function getOrders(): Promise<OrderResponseDto[]> {
  const session = await auth()

  if (!session?.accessToken) {
    throw new Error("No autenticado")
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/order`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    }
  )

  if (!res.ok) {
    let message = "Error al obtener las órdenes"

    try {
      const error = await res.json()
      message = error?.message ?? message
    } catch { }

    throw new Error(message)
  }

  return (await res.json()) as OrderResponseDto[]
}
