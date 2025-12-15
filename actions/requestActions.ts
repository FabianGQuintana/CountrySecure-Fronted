import { auth } from "@/auth";
//baja logica
export async function altaBaja(id: string) {
  const session = await auth();
  try {
    const response = await fetch(
      `${process.env.API_HOST}/api/request/${id}/Softdelete`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    if (!response.ok) {
      console.error("Status:", response.status);
      console.error("StatusText:", response.statusText);

      throw new Error(
        `Error al crear dar de alta o baja ${response.status}: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
