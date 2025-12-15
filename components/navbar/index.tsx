"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { MenuIcon, X, HomeIcon } from "lucide-react"

export default function Menu() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const barraMenu = [
    { nombre: "", ruta: "/" },
    { nombre: "Seguridad", ruta: "/#seguridad" },
    { nombre: "Amenities", ruta: "/#amenities" },
    { nombre: "Comunidad", ruta: "/#comunidad" },
  ]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }

    function handleResize() {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("resize", handleResize)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <nav className="w-full sticky top-0 z-50 bg-sky-50/95 backdrop-blur-md border-b border-sky-100/50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-fuchsia-400 to-fuchsia-500 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
            <HomeIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 bg-clip-text text-transparent group-hover:from-fuchsia-600 group-hover:to-fuchsia-700 transition-all duration-300">
            CountryClub
          </span>
        </Link>

        {/* Menú Desktop */}
        <ul className="hidden md:flex items-center gap-8 text-sm absolute left-1/2 transform -translate-x-1/2">
          {barraMenu.map(({ nombre, ruta }) => (
            <li key={nombre}>
              <Link
                href={ruta}
                className="relative text-slate-700 font-medium hover:text-fuchsia-600 transition-colors duration-300 group"
              >
                {nombre}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Botón Ingresar (Desktop) */}
        <Link
          href="/login"
          className="hidden md:flex items-center gap-2 text-slate-700 font-medium px-5 py-2.5 rounded-lg border border-slate-200 hover:border-fuchsia-300 hover:bg-fuchsia-50 hover:text-fuchsia-700 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          Ingresar
        </Link>


        {/* Botón hamburguesa */}
        <button
          className="md:hidden text-slate-700 hover:text-fuchsia-600 z-50 p-2 rounded-lg hover:bg-sky-100 transition-all duration-300"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Menú Mobile tipo Drawer */}
      <div
        ref={menuRef}
        className={`
          fixed inset-y-0 left-0 z-40 w-72 h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:hidden
        `}
      >
        <div className="flex flex-col h-full">
          {/* Mobile menu header */}
          <div className="mb-8 pb-6 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-fuchsia-400 to-fuchsia-500 shadow-sm">
                <HomeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">CountryClub</span>
            </div>
          </div>

          {/* Menu items */}
          <ul className="flex flex-col gap-2 text-sm flex-1">
            {barraMenu.map(({ nombre, ruta }) => (
              <li key={nombre}>
                <Link
                  href={ruta}
                  className="block text-slate-200 hover:text-white font-medium px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all duration-300 border border-transparent hover:border-slate-600/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {nombre}
                </Link>
              </li>
            ))}
          </ul>

          {/* Botón Ingresar (Mobile) */}
          <div className="pt-6 border-t border-slate-700/50">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-white font-medium bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 py-3 rounded-lg hover:from-fuchsia-600 hover:to-fuchsia-700 transition-all duration-300 shadow-lg hover:shadow-fuchsia-500/25"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ingresar
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </nav>
  )
}
