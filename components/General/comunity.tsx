import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Calendar, MessageCircle } from "lucide-react";

const benefits = [
  {
    icon: Heart,
    title: "Calidad de Vida",
    description: "Un entorno diseñado para tu bienestar y el de tu familia",
  },
  {
    icon: Users,
    title: "Comunidad Activa",
    description: "Eventos sociales y actividades para conocer a tus vecinos",
  },
  {
    icon: Calendar,
    title: "Eventos Exclusivos",
    description: "Celebraciones y actividades organizadas durante todo el año",
  },
  {
    icon: MessageCircle,
    title: "Comunicación Directa",
    description: "App móvil para estar siempre conectado con tu comunidad",
  },
];

const Community = () => {
  return (
    <section
      id="comunidad"
      className="py-24 bg-linear-to-br from-sky-50 via-white to-purple-50 relative overflow-hidden"
    >
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div
        className="absolute bottom-20 right-10 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-purple-500 to-orange-500 rounded-full mb-6 shadow-lg shadow-purple-500/30 hover:scale-110 transition-all duration-300">
            <Users className="h-9 w-9 text-white" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-purple-600 via-purple-500 to-orange-500 bg-clip-text text-transparent">
            Una Comunidad Excepcional
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Más que un lugar para vivir, es un estilo de vida compartido
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="text-center bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-purple-100 to-orange-100 rounded-xl mb-4 border border-purple-200 group-hover:scale-110 transition-transform">
                  <benefit.icon className="h-7 w-7 text-purple-600" />
                </div>

                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA final */}
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden shadow-2xl animate-scale-in border-0 bg-linear-to-br from-purple-500 via-purple-600 to-orange-500 p-[2px]">
            <div className="bg-white/95 backdrop-blur-xl rounded-lg p-8 md:p-12 text-center">
              <h3 className="text-3xl font-bold mb-4 bg-linear-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                ¿Listo para ser parte de nuestra comunidad?
              </h3>

              <p className="text-gray-600 mb-6 text-lg max-w-2xl mx-auto">
                Descubrí por qué cientos de familias eligen vivir en un entorno
                seguro, conectado y lleno de experiencias compartidas.
              </p>

              {/* Botones opcionales */}
              {/* 
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-linear-to-r from-purple-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/40 transition-all">
                  Solicitar Información
                </button>
                <button className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-semibold hover:border-purple-300 transition-colors">
                  Ver Planos
                </button>
              </div> 
              */}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Community;
