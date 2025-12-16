import { MapPin, ArrowDown } from "lucide-react"

const Hero = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/countryHero.png)",
        }}
      />

      {/* Overlay glass + blur */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/30" />

      {/* Decorativos suaves */}
      <div className="absolute top-32 left-20 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div
        className="absolute bottom-32 right-20 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Contenido */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-fade-in bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 md:p-12 shadow-2xl max-w-4xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-gradient-to-br from-purple-100 to-orange-100 border border-purple-200">
            <MapPin className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">
              Tu hogar soñado te espera
            </span>
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500 bg-clip-text text-transparent">
            Viví la experiencia
            <br />
            del barrio ideal
          </h1>

          {/* Descripción */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Descubrí un estilo de vida único en un barrio privado diseñado para
            tu bienestar. Amenities exclusivas, seguridad 24/7 y una comunidad
            excepcional.
          </p>

          {/* CTA */}
          <div className="flex justify-center">
            <button
              className="
                flex items-center gap-2 px-8 py-4 rounded-xl
                bg-gradient-to-r from-purple-500 to-orange-500
                text-white font-semibold text-lg
                shadow-lg shadow-purple-500/30
                hover:shadow-purple-500/50
                hover:scale-105
                transition-all duration-300
                group
              "
            >
              Ver más
              <ArrowDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Fade inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}

export default Hero
