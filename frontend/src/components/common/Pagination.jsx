export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="btn-secondary px-3 py-2"
      >
        Prev
      </button>
      {start > 1 && (
        <>
          <button type="button" onClick={() => onPageChange(1)} className="btn-secondary px-3 py-2">
            1
          </button>
          {start > 2 && <span className="px-2 text-stone-400">…</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`min-w-[2.5rem] rounded-lg px-3 py-2 text-sm font-medium ${
            p === page
              ? 'bg-accent-500 text-white'
              : 'border border-stone-300 bg-white text-stone-700 hover:bg-surface-100'
          }`}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2 text-stone-400">…</span>}
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            className="btn-secondary px-3 py-2"
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="btn-secondary px-3 py-2"
      >
        Next
      </button>
    </nav>
  );
}
