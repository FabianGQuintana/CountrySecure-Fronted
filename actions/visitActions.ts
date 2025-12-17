"use server"

import { auth } from "@/auth"
import type { CreateVisitDto, VisitResponseDto } from "@/types/visits"

export async function createVisit(
    data: CreateVisitDto
): Promise<VisitResponseDto> {
    const session = await auth()

    if (!session?.accessToken) {
        throw new Error("No autenticado")
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/visit`,
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
        let message = "Error al crear la visita"

        try {
            const error = await res.json()
            message = error?.message ?? message
        } catch { }

        throw new Error(message)
    }

    return (await res.json()) as VisitResponseDto
}


export async function getVisitsByDni(
    dniVisit: number
): Promise<VisitResponseDto[]> {
    const session = await auth()

    if (!session?.accessToken) {
        throw new Error("No autenticado")
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/visit/dni/${dniVisit}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: "no-store",
        }
    )

    if (!res.ok) {
        let message = "Error al buscar visitas por DNI"

        try {
            const error = await res.json()
            message = error?.message ?? message
        } catch { }

        throw new Error(message)
    }

    return (await res.json()) as VisitResponseDto[]
}