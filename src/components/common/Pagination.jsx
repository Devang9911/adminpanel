function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const prev = () => page > 1 && onPageChange(page - 1);
  const next = () => page < totalPages && onPageChange(page + 1);
  const visiblePages = Array.from(
    new Set([1, 2, totalPages - 1, totalPages, page - 1, page, page + 1]),
  )
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((a, b) => a - b);

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="px-1 text-sm text-slate-500">
        Page <span className="font-semibold text-slate-800">{page}</span> of{" "}
        <span className="font-semibold text-slate-800">{totalPages}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={prev}
          disabled={page === 1}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>

        {visiblePages.map((visiblePage, index) => {
          const previousPage = visiblePages[index - 1];
          const isActive = visiblePage === page;

          return (
            <div key={visiblePage} className="flex items-center gap-2">
              {previousPage && visiblePage - previousPage > 1 && (
                <span className="px-1 text-sm text-slate-400">...</span>
              )}

              <button
                onClick={() => onPageChange(visiblePage)}
                className={`h-10 min-w-10 rounded-full border px-3 text-sm font-semibold transition ${
                  isActive
                    ? "border-blue-600 bg-blue-600 text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {visiblePage}
              </button>
            </div>
          );
        })}

        <button
          onClick={next}
          disabled={page === totalPages}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
