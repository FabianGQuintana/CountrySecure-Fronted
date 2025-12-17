"use server";

import { auth } from "@/auth";
import { PermissionType } from "@/types";

type CreateEntryPermissionPayload = {
    permissionType: PermissionType
    description?: string | null
    validFrom: string
    validTo: string
    visitId: string
    userId: string
    orderId?: string | null
}

export async function createEntryPermission(
    data: CreateEntryPermissionPayload
) {
    const session = await auth()

    if (!session?.accessToken) {
        throw new Error("No autorizado")
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/entrypermissions`,
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

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Error al crear el permiso de entrada")
    }

    return response.json()
}