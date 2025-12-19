"use server";

import { IusuarioRegister } from "@/types";
import { auth } from "@/auth";
import { ChangePasswordDto } from "@/types/user/changePasswordDto";

export async function newUsers(data: IusuarioRegister) {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.API_HOST}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function AltaBaja(id: string) {
  const session = await auth();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/users/${id}/toggle-active`,
      {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
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
  const session = await auth();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/users/${id}`,
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
    if (!response.ok) throw new Error("error actualizar usuario");
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function changePassword(data: ChangePasswordDto) {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("No autenticado");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/auth/change-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message || "Error al cambiar la contraseña");
  }

  return await res.json();
}

export async function getCurrentUser() {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("No authenticated session");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/users/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching current user");
  }

  return await response.json();
}

export async function updateCurrentUser(data: {
  name: string;
  lastname: string;
  email: string;
  phone: string;
}) {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("No authenticated session");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/users/me`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error updating profile");
  }

  return await response.json();
}
