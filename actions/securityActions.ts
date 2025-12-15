import { auth } from "@/auth";

export async function checkout(id: string) {
  const session = await auth();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/entrypermissions/${id}`,
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
  permissionId, 
  guardId 
}: { 
  permissionId: string; 
  guardId: string 
}) {
  const session = await auth();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/entrypermissions/${permissionId}/checkin`,
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
  permissionId, 
  guardId 
}: { 
  permissionId: string; 
  guardId: string 
}) {
  const session = await auth();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/entrypermissions/${permissionId}/checkout`,
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