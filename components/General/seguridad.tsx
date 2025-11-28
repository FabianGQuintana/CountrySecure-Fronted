import { Card, CardContent } from "@/components/UI/card";
import { Shield, Camera, Lock, Eye, Clock, UserCheck } from "lucide-react";
import camerasImage from "@/public/images/camera.png";
import gateImage from "@/public/images/gate.png";

import guardImage from "@/public/images/guard.png";

const securityFeatures = [
  {
    icon: Shield,
    title: "Vigilancia 24/7",
    description:
      "Personal de seguridad capacitado las 24 horas del día, los 365 días del año",
  },
  {
    icon: Camera,
    title: "Cámaras de Seguridad",
    description:
      "Sistema de CCTV con cobertura completa en todas las áreas comunes",
  },
  {
    icon: Lock,
    title: "Control de Acceso",
    description:
      "Garita de entrada con control riguroso de acceso para residentes y visitas",
  },
  {
    icon: Eye,
    title: "Monitoreo Constante",
    description: "Centro de monitoreo con tecnología de última generación",
  },
  {
    icon: Clock,
    title: "Respuesta Inmediata",
    description:
      "Equipo de respuesta rápida ante cualquier emergencia o incidente",
  },
  {
    icon: UserCheck,
    title: "Registro de Visitas",
    description: "Sistema digital de registro y autorización de visitantes",
  },
];

const Security = () => {
  return (
    <section
      id="seguridad"
      className="py-20 bg-linear-to-br from-primary/5 via-background to-accent/5"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-primary to-accent rounded-full mb-6 shadow-lg">
            <Shield className="h-10 w-10 text-primary-foreground" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-primary to-accent bg-clip-text ">
            Seguridad Incomparable
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tu tranquilidad y la de tu familia es nuestra prioridad absoluta
          </p>
        </div>

        {/* Main Security Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 animate-scale-in border-2 hover:border-primary/50">
            <div className="relative h-64 overflow-hidden">
              <img
                src={gateImage.src}
                alt="Garita de seguridad"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-linear-to-t from-card/95 via-card/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-primary rounded-lg">
                    <Lock className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Garita de Entrada
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Control de acceso profesional
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="overflow-hidden group hover:shadow-xl transition-all duration-300 animate-scale-in border-2 hover:border-primary/50"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={camerasImage.src}
                alt="Cámaras de seguridad"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-linear-to-t from-card/95 via-card/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-primary rounded-lg">
                    <Camera className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Sistema CCTV
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Monitoreo en tiempo real
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="overflow-hidden group hover:shadow-xl transition-all duration-300 animate-scale-in border-2 hover:border-primary/50"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={guardImage.src}
                alt="Guardia de seguridad"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-linear-to-t from-card/95 via-card/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-primary rounded-lg">
                    <UserCheck className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Personal Capacitado
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Guardias profesionales 24/7
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="shrink-0 p-3 bg-linear-to-br from-primary/20 to-accent/20 rounded-lg">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Guarantee Box */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-linear-to-r from-primary to-accent p-1 shadow-2xl animate-scale-in">
            <div className="bg-card rounded-lg p-8 md:p-12">
              <div className="text-center">
                <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-3xl font-bold mb-4">
                  Garantía de Seguridad Total
                </h3>
                <p className="text-muted-foreground mb-6 text-lg max-w-2xl mx-auto">
                  Nuestro compromiso es brindarte la máxima seguridad y
                  tranquilidad. Con tecnología de punta y personal altamente
                  capacitado, protegemos lo que más valoras.
                </p>
                <div className="flex flex-wrap justify-center gap-8 text-center mt-8">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-1">
                      24/7
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Vigilancia
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-1">
                      100+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Cámaras CCTV
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-1">
                      15
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Guardias
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-1">
                      &lt;2min
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tiempo Respuesta
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Security;
