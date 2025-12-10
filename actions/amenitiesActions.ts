"use server";

import { auth } from "@/auth";
import { Iamenities, IamenitiesRegister } from "@/types";

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
