export default function VisitsPage() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Historial de Visitas</h1>

      <p className="text-gray-600 mb-6">
        Aquí el guardia podrá ver las visitas registradas por los residentes, filtrar por fecha
        y marcar el ingreso o salida.
      </p>

      <div className="border rounded-lg p-4 bg-gray-50 text-gray-700">
        <p>No hay visitas registradas aún.</p>
      </div>
    </div>
  );
}
