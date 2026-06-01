export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;
  const styles = {
    error: 'bg-red-50 text-red-800 border-red-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    info: 'bg-primary-50 text-primary-800 border-primary-200',
  };
  return (
    <div
      className={`mb-4 flex items-start justify-between rounded-lg border px-4 py-3 text-sm ${styles[type]}`}
      role="alert"
    >
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-4 font-medium opacity-70 hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  );
}
