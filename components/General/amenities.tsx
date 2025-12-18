import { Card, CardContent } from "@/components/ui/card";
import { Waves, Dumbbell, Trees, Baby, Sparkles } from "lucide-react";
import poolImage from "@/public/images/pool.png";
import gymImage from "@/public/images/gym.png";
import parkImage from "@/public/images/park.png";
import playgroundImage from "@/public/images/playground.png";

const amenities = [
  {
    title: "Piscina de Lujo",
    description: "Piscina climatizada con áreas de descanso y zona infantil",
    icon: Waves,
    image: poolImage,
  },
  {
    title: "Gimnasio Equipado",
    description: "Gimnasio moderno con equipamiento de última generación",
    icon: Dumbbell,
    image: gymImage,
  },
  {
    title: "Áreas Verdes",
    description: "Parques y senderos para disfrutar de la naturaleza",
    icon: Trees,
    image: parkImage,
  },
  {
    title: "Zona de Juegos",
    description: "Playground seguro y divertido para los más pequeños",
    icon: Baby,
    image: playgroundImage,
  },
];

const Amenities = () => {
  return (
    <section
      id="amenities"
      className="py-24 bg-linear-to-br from-sky-50 via-white to-purple-50 relative overflow-hidden"
    >
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div
        className="absolute bottom-20 left-10 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-purple-500 to-orange-500 rounded-full mb-6 shadow-lg shadow-purple-500/30 hover:scale-110 transition-all">
            <Sparkles className="h-9 w-9 text-white" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-purple-600 via-purple-500 to-orange-500 bg-clip-text text-transparent">
            Amenities Premium
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Espacios diseñados para el bienestar, el entretenimiento y la
            calidad de vida de tu familia
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => (
            <Card
              key={index}
              className="group overflow-hidden border border-gray-200 bg-white/80 backdrop-blur-sm hover:border-purple-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={amenity.image.src || "/placeholder.svg"}
                  alt={amenity.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />

                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="p-3 bg-linear-to-br from-purple-500 to-orange-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <amenity.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {amenity.title}
                  </h3>
                </div>
              </div>

              <CardContent className="p-6">
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {amenity.description}
                </p>

                <div className="flex items-center gap-2 text-sm font-medium text-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span>Explorar</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
