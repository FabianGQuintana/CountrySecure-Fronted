import { auth } from "@/auth"
import ModalVisitDetails from "@/components/Security/ModalVisitDetails"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function VisitDetailPage({ params }: PageProps) {
  const session = await auth()
  
  // Await params en Next.js 15+
  const { id } = await params

  // // Obtener el guardId del usuario en sesión
  const guardId = session?.id

  // console.log("=== DEBUG VISIT DETAIL ===")
  // console.log("Permission ID:", id)
  // console.log("Guard ID:", guardId)
  // console.log("API Host:", process.env.API_HOST)
  console.log("Access Token:", session?.accessToken ? "Presente" : "Ausente")

  let permission: any = null

  try {
    const url = `${process.env.API_HOST}/api/entrypermissions/${id}`
    console.log("Fetching URL:", url)

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
    })

    console.log("Response status:", response.status)
    console.log("Response ok:", response.ok)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      console.error("Error al obtener el permiso - Status:", response.status)
      return notFound()
    }

    permission = await response.json()
    console.log("Permission obtenido:", JSON.stringify(permission, null, 2))
  } catch (error) {
    console.error("=== ERROR EN FETCH ===")
    console.error(error)
    return notFound()
  }

  if (!permission) {
    console.error("Permission es null después del fetch")
    return notFound()
  }

  return (
    <ModalVisitDetails 
      permission={permission} 
      guardId={guardId}
    />
  )
}