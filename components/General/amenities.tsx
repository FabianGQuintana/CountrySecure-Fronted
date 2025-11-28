import { Card, CardContent } from "@/components/UI/card";
import { Waves, Dumbbell, Trees, Baby, Shield, Car } from "lucide-react";
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
    <section id="amenities" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-primary to-accent bg-clip-text">
            AMENITIES
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Disfruta de instalaciones de primer nivel diseñadas para tu
            comodidad y entretenimiento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {amenities.map((amenity, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-2 hover:border-primary/50 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {amenity.image ? (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={amenity.image.src}
                    alt={amenity.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-card/90 to-transparent" />
                  <div className="absolute bottom-4 left-4 p-3 bg-primary rounded-full">
                    <amenity.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              ) : (
                <div className="relative h-48 bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <amenity.icon className="h-16 w-16 text-primary" />
                </div>
              )}
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {amenity.title}
                </h3>
                <p className="text-muted-foreground">{amenity.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
