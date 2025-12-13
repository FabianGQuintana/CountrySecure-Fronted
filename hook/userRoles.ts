"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Iusuario } from "@/types";

export function useUsers(role: string, initialData: Iusuario[] = []) {
  const { data: session } = useSession();
  const [usuarios, setUsuarios] = useState<Iusuario[]>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshUsers = useCallback(async () => {
    if (!session?.user?.accessToken) return;

    setIsRefreshing(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/users?role=${role}`,
        {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al refrescar usuarios");

      const data = await response.json();
      setUsuarios(data);
      return data;
    } catch (error) {
      console.error("Error en refreshUsers:", error);
      return [];
    } finally {
      setIsRefreshing(false);
    }
  }, [role, session?.user?.accessToken]);

  // Cargar usuarios al montar
  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  return {
    usuarios,
    setUsuarios,
    refreshUsers,
    isRefreshing,
  };
}
