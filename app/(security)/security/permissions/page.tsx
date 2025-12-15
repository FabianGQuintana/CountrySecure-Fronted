export default function PermissionsPage() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Permisos de Ingreso</h1>

      <p className="text-gray-600 mb-6">
        Permisos creados por los residentes para autorizar el ingreso de visitantes o proveedores.
      </p>

      <div className="border rounded-lg p-4 bg-gray-50 text-gray-700">
        <p>No hay permisos cargados aún.</p>
      </div>
    </div>
  );
}
