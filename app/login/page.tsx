// import Image from "next/image";
// import LoginFormulario from "./login-form";

// export default function Login() {
//   return (
//     <main className="relative w-screen h-screen overflow-hidden">
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{
//           backgroundImage: "url(/images/countryHero.png)",
//         }}
//       >
//         {/* Overlay para aclarar la imagen */}
//         <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
//       </div>

//       {/* Contenedor del formulario */}
//       <div className="absolute inset-0 flex items-center justify-center p-4">
//         <LoginFormulario />
//       </div>
//     </main>
//   );
// }

import LoginFormulario from "./login-form";

export default function Login() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Imagen de fondo con efectos */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/countryHero.png)",
        }}
      >
        <div className="absolute inset-0 bg-emerald-800/10 mix-blend-lighten" />
      </div>

      {/* Formulario centrado */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <LoginFormulario />
      </div>
    </main>
  );
}
