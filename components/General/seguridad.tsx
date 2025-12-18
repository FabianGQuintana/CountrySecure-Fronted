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
      className="py-20 bg-linear-to-br from-sky-50 via-white to-purple-50 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div
        className="absolute bottom-20 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-purple-500 to-orange-500 rounded-full mb-6 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-110">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-purple-600 via-purple-500 to-orange-500 bg-clip-text text-transparent">
            Seguridad Incomparable
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tu tranquilidad y la de tu familia es nuestra prioridad absoluta
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 animate-scale-in border border-gray-200 hover:border-purple-300 bg-white/80 backdrop-blur-sm hover:-translate-y-2">
            <div className="relative h-64 overflow-hidden">
              <img
                src={gateImage.src || "/placeholder.svg"}
                alt="Garita de seguridad"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-linear-to-br from-purple-500 to-orange-500 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Garita de Entrada
                  </h3>
                </div>
                <p className="text-sm text-gray-300">
                  Control de acceso profesional
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="overflow-hidden group hover:shadow-2xl transition-all duration-500 animate-scale-in border border-gray-200 hover:border-purple-300 bg-white/80 backdrop-blur-sm hover:-translate-y-2"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={camerasImage.src || "/placeholder.svg"}
                alt="Cámaras de seguridad"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-linear-to-br from-purple-500 to-orange-500 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Sistema CCTV</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Monitoreo en tiempo real
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="overflow-hidden group hover:shadow-2xl transition-all duration-500 animate-scale-in border border-gray-200 hover:border-purple-300 bg-white/80 backdrop-blur-sm hover:-translate-y-2"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={guardImage.src || "/placeholder.svg"}
                alt="Guardia de seguridad"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-linear-to-br from-purple-500 to-orange-500 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <UserCheck className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Personal Capacitado
                  </h3>
                </div>
                <p className="text-sm text-gray-300">
                  Guardias profesionales 24/7
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-purple-300 animate-slide-in bg-white/80 backdrop-blur-sm group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="shrink-0 p-3 bg-linear-to-br from-purple-100 to-orange-100 rounded-lg group-hover:scale-110 transition-transform duration-300 border border-purple-200">
                    <feature.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="relative overflow-hidden shadow-2xl animate-scale-in border-0 bg-linear-to-br from-purple-500 via-purple-600 to-orange-500 p-[2px]">
            <div className="bg-white/95 backdrop-blur-xl rounded-lg p-8 md:p-12 relative">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-purple-500 to-orange-500 rounded-full shadow-lg shadow-purple-500/30 mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4 bg-linear-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                  Garantía de Seguridad Total
                </h3>
                <p className="text-gray-600 mb-6 text-lg max-w-2xl mx-auto">
                  Nuestro compromiso es brindarte la máxima seguridad y
                  tranquilidad. Con tecnología de punta y personal altamente
                  capacitado, protegemos lo que más valoras.
                </p>
                <div className="flex flex-wrap justify-center gap-8 text-center mt-8">
                  <div className="group hover:scale-110 transition-transform duration-300">
                    <div className="text-3xl font-bold bg-linear-to-br from-purple-600 to-orange-500 bg-clip-text text-transparent mb-1">
                      24/7
                    </div>
                    <div className="text-sm text-gray-600">Vigilancia</div>
                  </div>
                  <div className="group hover:scale-110 transition-transform duration-300">
                    <div className="text-3xl font-bold bg-linear-to-br from-purple-600 to-orange-500 bg-clip-text text-transparent mb-1">
                      100+
                    </div>
                    <div className="text-sm text-gray-600">Cámaras CCTV</div>
                  </div>
                  <div className="group hover:scale-110 transition-transform duration-300">
                    <div className="text-3xl font-bold bg-linear-to-br from-purple-600 to-orange-500 bg-clip-text text-transparent mb-1">
                      15
                    </div>
                    <div className="text-sm text-gray-600">Guardias</div>
                  </div>
                  <div className="group hover:scale-110 transition-transform duration-300">
                    <div className="text-3xl font-bold bg-linear-to-br from-purple-600 to-orange-500 bg-clip-text text-transparent mb-1">
                      &lt;2min
                    </div>
                    <div className="text-sm text-gray-600">
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
