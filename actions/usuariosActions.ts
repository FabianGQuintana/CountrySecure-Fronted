import { IusuarioRegister } from "@/types";

export async function newUsers(data: IusuarioRegister) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/Users/`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || " error al registrar usuario");
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
