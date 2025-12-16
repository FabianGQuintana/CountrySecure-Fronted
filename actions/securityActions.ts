 "use server";

import { auth } from "@/auth";

export async function checkout(id: string) {
  const session = await auth();

  try {
    const response = await fetch(
      `${process.env.API_HOST}/api/entrypermissions/${id}`,
      {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    if (!response.ok) throw new Error("error al hacer el checkout");

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Registrar entrada (check-in)
export async function registerEntry({ 
  permissionId
}: { 
  permissionId: string; 

}) {
  const session = await auth();
  const guardId = session?.id;
    
    if (!guardId) {
        throw new Error("El guardia no está autenticado o su ID es desconocido.");
    }
  try {
    const response = await fetch(
      `${process.env.API_HOST}/api/entrypermissions/${permissionId}/checkin`,
      {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          guardId: guardId,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al registrar la entrada");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en registerEntry:", error);
    throw error;
  }
}

// Registrar salida (check-out)
export async function registerDeparture({ 
  permissionId
}: { 
  permissionId: string; 
}) {
  const session = await auth();
  const guardId = session?.id;
    
    if (!guardId) {
        throw new Error("El guardia no está autenticado o su ID es desconocido.");
    }
  try {
    const response = await fetch(
      `${process.env.API_HOST}/api/entrypermissions/${permissionId}/checkout`,
      {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          guardId: guardId,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al registrar la salida");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en registerDeparture:", error);
    throw error;
  }
}