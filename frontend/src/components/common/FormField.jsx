export default function FormField({
  label,
  error,
  children,
  required,
  className = '',
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="label-text">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
