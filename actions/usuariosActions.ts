import { IusuarioRegister } from "@/types";

export async function newUsers(data: IusuarioRegister) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/Users`,
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
//

// export async function newUsers(data: IusuarioRegister) {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_HOST}/api/users`,
//       {
//         method: "POST",
//         headers: {
//           "Content-type": "application/json",
//         },
//         body: JSON.stringify(data),
//       }
//     );

//     if (!response.ok) {
//       let errorMessage = "Error al registrar usuario";

//       try {
//         const json = await response.json();
//         if (json?.message) errorMessage = json.message;
//       } catch {}

//       throw new Error(errorMessage);
//     }

//     // Intentar parsear JSON solo si existe body
//     try {
//       return await response.json();
//     } catch {
//       return null; // en caso de que solo devuelva 201 sin body
//     }
//   } catch (error) {
//     throw error;
//   }
// }
