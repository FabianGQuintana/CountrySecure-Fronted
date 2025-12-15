import React from "react";
import MenuSecurity from "../Security/MenuSecurity"; // Asegúrate de la ruta correcta

interface SecurityLayoutProps {
  children: React.ReactNode;
}

const SecurityLayout: React.FC<SecurityLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Navbar lateral */}
      <MenuSecurity />

      {/* 2. Contenido principal */}
      <main className="lg:pl-64 pt-4 lg:pt-0">
        <div className="p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SecurityLayout;