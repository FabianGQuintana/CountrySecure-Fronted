
import { auth } from "@/auth"
import LogView from "@/components/Security/LogView"

export default async function LogsPage() {
  const session = await auth()

  return <LogView session={session} />
}