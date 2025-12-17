"use server";

import { auth } from "@/auth";
import { Iamenities, IamenitiesRegister } from "@/types";

export type AmenityReferenceDto = {
  id: string
  amenityName: string
}

export type AmenityResponseDto = {
  id: string
  amenityName: string
  description: string
  schedules: string
  capacity: number
  status: string
  createdAt: string
  lastModifiedAt?: string | null
}

export async function newAmenities(data: Iamenities) {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.API_HOST}/api/Amenity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    throw new Error();
  }
}

export async function updateAmenities(
  data: Partial<IamenitiesRegister>,
  id: string
) {
  const session = await auth();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/Amenity/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        cache: "no-store",
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) throw new Error("error actualizar Amenities");
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function AltaBaja(id: string) {
  const session = await auth();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/Amenity/${id}/SoftDelete`,
      {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    if (!response.ok) throw new Error("error alta o baja de amenities");

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getAmenities(): Promise<AmenityReferenceDto[]> {
  const session = await auth()

  if (!session?.accessToken) {
    throw new Error("No autenticado")
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/Amenity`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    }
  )

  if (!res.ok) {
    const error = await res.json().catch(() => null)
    throw new Error(error?.message || "Error al obtener los amenities")
  }

  const data: AmenityResponseDto[] = await res.json()

  // 👉 Solo activos y mapeo liviano para UI
  return data
    .filter((a) => a.status === "Active")
    .map((a) => ({
      id: a.id,
      amenityName: a.amenityName,
    }))
}