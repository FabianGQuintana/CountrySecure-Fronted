"use server";

import { auth } from "@/auth";

// Contrato de RequestResponseDto (los enums llegan como texto)
export type RequestResponse = {
  id: string;
  details: string;
  location: string;
  status: "Pending" | "Completed" | "Cancelled" | string;
  baseEntityStatus: string;
  createdAt: string;
  order: { id: string; supplierName: string; description: string; orderType: number | string };
};

async function authHeaders() {
  const session = await auth();
  if (!session?.accessToken) throw new Error("No autenticado");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.accessToken}`,
  };
}

async function readError(response: Response, fallback: string) {
  const body = await response.json().catch(() => null);
  return new Error(body?.message || `${fallback} (${response.status})`);
}

// Solicitudes del residente autenticado
export async function getMyRequests(): Promise<RequestResponse[]> {
  const response = await fetch(`${process.env.API_HOST}/api/Requests/me`, {
    headers: await authHeaders(),
    cache: "no-store",
  });
  if (!response.ok) throw await readError(response, "Error al obtener las solicitudes");
  return response.json();
}

// Nueva solicitud de servicio (el backend toma el usuario del token)
export async function createRequest(data: { orderId: string; details: string; location: string }): Promise<RequestResponse> {
  const response = await fetch(`${process.env.API_HOST}/api/Requests`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(data),
    cache: "no-store",
  });
  if (!response.ok) throw await readError(response, "Error al crear la solicitud");
  return response.json();
}

// Baja lógica (alta/baja) de una solicitud
export async function altaBaja(id: string) {
  const response = await fetch(`${process.env.API_HOST}/api/Requests/${id}/SoftDelete`, {
    method: "PATCH",
    headers: await authHeaders(),
    cache: "no-store",
  });
  if (!response.ok) throw await readError(response, "Error al dar de alta o baja la solicitud");
  return response.json();
}
