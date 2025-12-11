"use client"

import { FiLogOut } from "react-icons/fi"
import { signOut } from "next-auth/react"
import { motion } from "framer-motion"
import { useState } from "react"

export default function LogoutButton() {
    const [isLoading, setIsLoading] = useState(false)

    const handleLogout = async () => {
        setIsLoading(true)
        await signOut({ callbackUrl: "/" })
    }

    return (
        <motion.button
            onClick={handleLogout}
            disabled={isLoading}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-400/30 hover:border-purple-400/60 text-purple-300 hover:text-purple-200 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
            <FiLogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            <span>{isLoading ? "Cerrando sesión..." : "Cerrar sesión"}</span>
        </motion.button>
    )
}