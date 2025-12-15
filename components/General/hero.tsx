import { MapPin, ArrowBigDown } from "lucide-react";
const Hero = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 "
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/countryHero.png)",
        }}
      >
        {/* Overlay para aclarar la imagen */}
        <div className="absolute inset-0 bg-emerald-800/50 mix-blend-lighten" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-fade-in bg-white/40 p-8 rounded-lg inline-block color-black ">
          <div className="inline-flex items-center space-x-2  backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-lg">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              Tu hogar soñado te espera
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight">
            Vive la Experiencia del Barrio Ideal
            <br />
            <span className="bg-linear-to-r from-white to-accent bg-clip-text text-transparent">
              {/* del Barrio Ideal */}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-black mb-8 max-w-3xl mx-auto">
            Descubre un estilo de vida único en un barrio privado diseñado para
            tu bienestar. Amenidades exclusivas, seguridad 24/7 y una comunidad
            excepcional.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="
                    flex flex-row items-center gap-1 px-6 py-3 rounded-lg
                    text-primary bg-card hover:bg-card/90 shadow-lg text-lg font-medium
                    transition group
                    animate-pulse-scale cursor-pointer border-black border-2"
            >
              <p>
                Ver Mas
              </p>
              {/* <span>Explorar</span> */}
              <ArrowBigDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" /> 
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear@-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
