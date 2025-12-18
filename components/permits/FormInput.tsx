import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    icon?: React.ElementType
    error?: string
    required?: boolean
}

export function FormInput({
    label,
    icon: Icon,
    error,
    required,
    className,
    ...inputProps
}: FormInputProps) {
    return (
        <div className="space-y-2">
            {label && (
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    {Icon && <Icon className="w-4 h-4 text-violet-600" />}
                    {label}
                    {required && <span className="text-violet-600">*</span>}
                </label>
            )}

            <input
                {...inputProps}
                className={cn(
                    "w-full px-4 py-3.5 border-2 rounded-xl transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500",
                    "hover:border-violet-300",
                    error ? "border-red-300 bg-red-50/50" : "border-gray-200",
                    className
                )}
            />

            {error && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </p>
            )}
        </div>
    )
}
