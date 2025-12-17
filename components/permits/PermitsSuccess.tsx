import { CheckCircle2 } from "lucide-react"

export function PermitsSuccess({ name, onReset }: any) {
    return (
        <div className="bg-white p-12 rounded-3xl shadow-2xl text-center">
            <CheckCircle2 className="w-20 h-20 text-violet-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold">¡Permiso Creado!</h2>
            <p className="text-gray-600 mt-2">{name}</p>

            <button
                onClick={onReset}
                className="mt-6 w-full py-3 rounded-xl text-white bg-violet-600"
            >
                Crear otro permiso
            </button>
        </div>
    )
}