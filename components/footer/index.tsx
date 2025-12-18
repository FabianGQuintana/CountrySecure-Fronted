"use client";

import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-linear-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-fuchsia-500/50 to-transparent" />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-fuchsia-500 to-orange-500 shadow-lg shadow-fuchsia-500/20">
                <span className="text-lg font-bold text-white">CC</span>
              </div>
              <h3 className="text-xl font-bold">CountryClub</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Experiencia exclusiva en amenities y servicios de primera clase.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2">
              {["Seguridad", "Amenities", "Comunidad", "Contacto"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-sm text-gray-400 transition-colors hover:text-fuchsia-400"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-400" />
                <span>9 de Julio 1449, Corrientes Capital</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4 shrink-0 text-fuchsia-400" />
                <span>+54 03794891449</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4 shrink-0 text-fuchsia-400" />
                <span>info@countrySecure.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Seguinos
            </h4>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="group flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800/50 backdrop-blur-sm transition-all hover:bg-linear-to-br hover:from-fuchsia-500 hover:to-orange-500 hover:shadow-lg hover:shadow-fuchsia-500/20"
                >
                  <Icon className="h-4 w-4 text-gray-400 transition-colors group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 text-center md:flex-row md:text-left">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} CountryClub. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-sm text-gray-400 transition-colors hover:text-fuchsia-400"
            >
              Privacidad
            </a>
            <a
              href="#"
              className="text-sm text-gray-400 transition-colors hover:text-fuchsia-400"
            >
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
