export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-xs text-red-500 mt-1.5">
      {message}
    </p>
  );
}
