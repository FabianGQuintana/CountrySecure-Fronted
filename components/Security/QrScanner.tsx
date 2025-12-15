
"use client";
import React, { useState, useCallback } from 'react';
import { QrCode, Search, CheckCircle, XCircle, AlertTriangle, User, Home, Clock, Loader } from 'lucide-react'; // Añadí Loader
import { validateQrCode, registerEntryOrDeparture, GateCheckResponse } from '@/actions/securityActions';
import { useSession } from 'next-auth/react';

// ----------------------------------------------------
// Componente de Escáner QR
// ----------------------------------------------------

const QrScanner: React.FC = () => {
    // 1. Obtener la sesión y el ID del guardia
    const { data: session, status } = useSession(); 
    const guardId = session?.user?.id; // Usamos el ID de la sesión
    
    // 2. Estados Locales
    const [qrCode, setQrCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<GateCheckResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isMovementProcessing, setIsMovementProcessing] = useState(false);

    // Mapeo de colores y estados basado en CheckResultStatus del backend
    const statusMap: { [key: string]: { icon: React.ElementType, color: string, action: string, actionLabel: string, isError: boolean } } = {
        'Autorizado - Marcar Entrada': { icon: CheckCircle, color: 'bg-green-500', action: 'ENTRY', actionLabel: 'Registrar ENTRADA', isError: false },
        'Dentro - Marcar Salida': { icon: AlertTriangle, color: 'bg-amber-500', action: 'DEPARTURE', actionLabel: 'Registrar SALIDA', isError: false },
        'error': { icon: XCircle, color: 'bg-red-500', action: '', actionLabel: 'Permiso Inválido', isError: true },
    };
    
    // --- Lógica de Validación (Al escanear/buscar) ---
    const handleValidation = useCallback(async () => {
        if (!qrCode.trim()) {
            setError("Por favor, ingrese o escanee un código QR.");
            setResult(null);
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await validateQrCode(qrCode);
            setResult(data);
        } catch (err: any) {
            setError(err.message || "Error de conexión con el sistema de validación.");
        } finally {
            setIsLoading(false);
        }
    }, [qrCode]);

    // --- Lógica de Registro de Movimiento (Entrada/Salida) ---
    const handleRegisterMovement = useCallback(async () => {
        if (!result) return;
        
        if (!guardId) {
            setError("Error: ID de Guardia no encontrado. Por favor, vuelva a iniciar sesión.");
            return;
        }

        const status = statusMap[result.checkResultStatus] || statusMap['error'];
        const isEntry = status.action === 'ENTRY';
        
        setIsMovementProcessing(true);
        setError(null);

        try {
            await registerEntryOrDeparture(result.permissionId, isEntry, guardId); 
            
            setQrCode('');
            setResult(null);
            alert(`Movimiento de ${isEntry ? 'ENTRADA' : 'SALIDA'} registrado con éxito para ${result.visitorFullName}.`);
            
        } catch (err: any) {
            setError(`Fallo al registrar el movimiento: ${err.message || 'Error de API'}`);
        } finally {
            setIsMovementProcessing(false);
        }
    }, [result, guardId, statusMap]); // Añadí statusMap a deps para evitar warnings

    // Obtener el estado actual para la UI
    const currentStatus = result ? (statusMap[result.checkResultStatus] || statusMap['error']) : statusMap['error'];
    const displayResult = result || (error ? { message: error } : null);
    
    // Formateo simple para DNI
    const formatDni = (dni: number) => dni.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");


    // ----------------------------------------------------
    // 🔥 Manejo de Estado de Carga (UI) - CRÍTICO: Debe ir antes del return principal
    // ----------------------------------------------------
    
    // 1. Mostrar spinner mientras se carga la sesión
    if (status === "loading") {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
                <Loader className="h-10 w-10 animate-spin text-teal-600" />
                <p className="ml-4 text-xl text-gray-600">Cargando datos del guardia...</p>
            </div>
        );
    }
    
    // 2. Mostrar error si no hay ID (p. ej., sesión expirada o token malo)
    if (status === "unauthenticated" || !guardId) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-red-50 p-6 rounded-xl">
                <XCircle className="h-8 w-8 text-red-600" />
                <p className="ml-4 text-xl text-red-800">Error de sesión. Por favor, vuelva a iniciar sesión.</p>
            </div>
        );
    }

    // ----------------------------------------------------
    // Renderizado Principal (si la sesión está activa)
    // ----------------------------------------------------
    return (
        <div className="flex flex-col md:flex-row h-full min-h-[calc(100vh-64px)] bg-gray-100 p-4 md:p-8">
            
            {/* 1. Panel de Escaneo (Izquierda) */}
            <div className="md:w-1/3 p-4 bg-white rounded-xl shadow-2xl space-y-6 mb-6 md:mb-0 md:mr-6">
                <h2 className="text-3xl font-extrabold text-teal-600 flex items-center">
                    <QrCode className="h-8 w-8 mr-3" /> Control de Acceso Rápido
                </h2>
                <p className="text-gray-500">Ingrese el código QR o utilice un escáner de código de barras. Guardia: {guardId.substring(0, 8)}...</p> {/* Muestra el ID para debug */}

                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={qrCode}
                        onChange={(e) => setQrCode(e.target.value)}
                        placeholder="Código QR / Permiso ID"
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleValidation()}
                    />
                    <button
                        onClick={handleValidation}
                        disabled={isLoading || isMovementProcessing}
                        className="flex items-center justify-center p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200 disabled:opacity-50"
                    >
                        {isLoading ? 'Validando...' : <Search className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mensaje de Estado Inicial */}
                {!result && !error && !isLoading && (
                    <div className="text-center p-8 bg-gray-50 rounded-lg text-gray-500">
                        Esperando código para validar...
                    </div>
                )}
            </div>

            {/* 2. Panel de Resultado (Derecha - Luz de Semáforo) */}
            <div className="md:w-2/3 p-6 rounded-xl shadow-2xl relative overflow-hidden" 
                 style={{ backgroundColor: currentStatus.color, color: 'white' }}>
                
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center space-x-4">
                        <currentStatus.icon className="h-10 w-10 md:h-16 md:w-16" />
                        <h1 className="text-4xl md:text-5xl font-black">
                            {currentStatus.actionLabel}
                        </h1>
                    </div>

                    <p className="text-xl md:text-2xl font-semibold mt-4 border-b border-white/50 pb-3">
                        {displayResult?.message || "Ingrese un código para comenzar la validación."}
                    </p>

                    {/* Datos del Permiso (Solo si hay resultado válido) */}
                    {result && !currentStatus.isError && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                                <h3 className="flex items-center text-lg font-bold mb-2">
                                    <User className="h-5 w-5 mr-2" /> VISITANTE
                                </h3>
                                <p className="text-sm font-semibold">{result.visitorFullName}</p>
                                <p className="text-xs">DNI: {formatDni(result.visitorDni)}</p>
                            </div>
                            
                            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                                <h3 className="flex items-center text-lg font-bold mb-2">
                                    <Home className="h-5 w-5 mr-2" /> RESIDENTE
                                </h3>
                                <p className="text-sm font-semibold">{result.residentFullName}</p>
                                <p className="text-xs">ID Permiso: {result.permissionId.substring(0, 8)}...</p>
                            </div>

                            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                                <h3 className="flex items-center text-lg font-bold mb-2">
                                    <Clock className="h-5 w-5 mr-2" /> HORARIOS
                                </h3>
                                <p className="text-sm">Entrada: {result.entryTime ? new Date(result.entryTime).toLocaleString() : 'PENDIENTE'}</p>
                                <p className="text-sm">Salida: {result.departureTime ? new Date(result.departureTime).toLocaleString() : 'PENDIENTE'}</p>
                            </div>
                            
                            {/* Botón de Acción (Entrada/Salida) */}
                            <div className="flex items-end">
                                <button
                                    onClick={handleRegisterMovement}
                                    disabled={isMovementProcessing}
                                    className="w-full p-4 bg-white text-gray-900 rounded-lg text-lg font-bold hover:bg-gray-100 transition duration-200 disabled:opacity-70"
                                >
                                    {isMovementProcessing ? 'Procesando...' : currentStatus.actionLabel}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QrScanner;