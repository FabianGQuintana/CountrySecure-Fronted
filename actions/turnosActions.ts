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

// Respuesta de la API de turnos (TurnResponseDto)
export type TurnResponse = {
    id: string
    startTime: string
    endTime: string
    status: string // auditoría: Active / Inactive
    turnStatus: "Pending" | "Completed" | "Cancelled"
    amenityId: string
    amenity?: { id: string; name: string } | null
}

// "Mis reservas": turnos del residente autenticado (GET /api/turn/me)
export async function getMyTurns(): Promise<TurnResponse[]> {
    const session = await auth()
    if (!session?.accessToken) throw new Error("No autenticado")

    const res = await fetch(`${process.env.API_HOST}/api/turn/me`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
        cache: "no-store",
    })

    if (!res.ok) throw new Error(`Error al obtener reservas (${res.status})`)
    return res.json()
}

// Cancela una reserva propia (el backend marca el turno como Cancelled)
export async function cancelTurn(id: string) {
    const session = await auth()
    if (!session?.accessToken) throw new Error("No autenticado")

    const res = await fetch(`${process.env.API_HOST}/api/turn/${id}/SoftDelete`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${session.accessToken}` },
        cache: "no-store",
    })

    if (!res.ok) {
        const error = await res.json().catch(() => null)
        throw new Error(error?.message || "No se pudo cancelar la reserva")
    }

    return res.json()
}
