import { Card, CardContent } from "@/components/UI/card";
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
      className="mt-20 bg-linear-to-br from-background via-muted/20 to-background bg-[#DFC5F9] mx-2 rounded-lg py-20"
    >
      <div className="container mx-auto px-4 ">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-primary to-accent bg-clip-text text-black">
            Una Comunidad Excepcional
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Más que un lugar para vivir, es un estilo de vida compartido
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-primary to-accent rounded-full mb-4">
                  <benefit.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto bg-linear-to-r from-primary to-accent p-1 rounded-2xl shadow-xl animate-scale-in">
          <div className="bg-card rounded-xl p-8 md:p-12 border-2 border-black">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">
                ¿Listo para ser parte de nuestra comunidad?
              </h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Descubre por qué más de 500 familias han elegido vivir aquí
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* <button className="px-8 py-3 bg-linear-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Solicitar Información
                </button>
                <button className="px-8 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-colors">
                  Ver Planos
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
