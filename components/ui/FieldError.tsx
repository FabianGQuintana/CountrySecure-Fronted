export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-xs font-medium text-danger mt-1.5">
      {message}
    </p>
  );
}
