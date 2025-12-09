"use server";

import { IusuarioRegister } from "@/types";
import { getCurrentUser } from "@/auth";

export async function newUsers(data: IusuarioRegister) {
  const session = await getCurrentUser();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || " error al registrar usuario");
    }
    if (response.status === 401) {
      throw new Error("No estás autenticado. Volvé a iniciar sesión.");
    }

    // 403 → no autorizado (sin permiso)
    if (response.status === 403) {
      throw new Error("No tenés permisos para realizar esta acción.");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function AltaBaja(id: string) {
  // const session = await auth () cuando tenga el logn lo activo
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/users/${id}/toggle-active`,
      {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${session?.user.token}`,
        },
      }
    );
    if (!response.ok) throw new Error("error alta o baja de usuario");
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function updateUser(data: Partial<IusuarioRegister>, id: string) {
  // const session = await auth () cuando tenga el logn lo activo
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/users/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          // Authorization: `Bearer ${session?.user.token}`,
        },
        cache: "no-store",
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) throw new Error("error actualizar usuario");
    return await response.json();
  } catch (error) {
    throw error;
  }
}
