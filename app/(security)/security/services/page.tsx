export default function ServicesPage() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Servicios Programados</h1>

      <p className="text-gray-600 mb-6">
        Lista de servicios (jardinería, fumigación, mantenimiento) con días y horarios asignados.
      </p>

      <div className="border rounded-lg p-4 bg-gray-50 text-gray-700">
        <p>No hay servicios programados por el momento.</p>
      </div>
    </div>
  );
}
