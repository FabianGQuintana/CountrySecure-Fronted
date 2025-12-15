import { auth } from "@/auth"

export type CreateTurnDto = {
    amenityId: string
    startTime: string
    endTime: string
}

export async function createTurn(data: CreateTurnDto) {
    const session = await auth()

    if (!session?.accessToken) {
        throw new Error("No autenticado")
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/turns`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(data),
            cache: "no-store",
        }
    )

    if (!res.ok) {
        const error = await res.json()

        throw new Error(
            error?.message ||
            error?.detail ||
            "Error al reservar el amenity"
        )
    }

    return await res.json()
}
