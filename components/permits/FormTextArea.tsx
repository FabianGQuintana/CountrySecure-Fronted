import { cn } from "@/lib/utils"

interface FormTextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
}

export function FormTextarea({
    label,
    className,
    ...textareaProps
}: FormTextareaProps) {
    return (
        <div className="space-y-2">
            {label && (
                <label className="text-sm font-semibold text-gray-700">
                    {label}
                </label>
            )}

            <textarea
                {...textareaProps}
                className={cn(
                    "w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl resize-none",
                    "focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500",
                    "hover:border-violet-300",
                    className
                )}
            />
        </div>
    )
}
