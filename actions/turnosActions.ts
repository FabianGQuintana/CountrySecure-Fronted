"use server"

import { auth } from "@/auth"

export async function createTurn(payload: {
    amenityId: string
    startTime: string
    endTime: string
}) {
    const session = await auth()

    if (!session?.accessToken) {
        throw new Error("No autenticado")
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/Turn`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        }
    )

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Error al crear turno")
    }

    return res.json()
}
