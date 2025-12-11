import { auth } from "@/auth";
import { IOrderRegister } from "@/types";

export async function newOrder(data: IOrderRegister) {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.API_HOST}/api/orders`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer${session?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
  } catch (error) {}
}
