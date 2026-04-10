function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const prev = () => page > 1 && onPageChange(page - 1);
  const next = () => page < totalPages && onPageChange(page + 1);

  const visiblePages = Array.from(
    new Set([1, 2, totalPages - 1, totalPages, page - 1, page, page + 1]),
  )
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={prev}
        disabled={page === 1}
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 16 16"
        >
          <polyline points="10,3 5,8 10,13" />
        </svg>
        Prev
      </button>

      <div className="flex items-center gap-1">
        {visiblePages.map((visiblePage, index) => {
          const previousPage = visiblePages[index - 1];
          const isActive = visiblePage === page;

          return (
            <div key={visiblePage} className="flex items-center gap-1">
              {previousPage && visiblePage - previousPage > 1 && (
                <span className="px-1 text-xs text-gray-300 select-none">
                  ···
                </span>
              )}
              <button
                onClick={() => onPageChange(visiblePage)}
                className={`h-7 min-w-7 px-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {visiblePage}
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={next}
        disabled={page === totalPages}
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 16 16"
        >
          <polyline points="6,3 11,8 6,13" />
        </svg>
      </button>
    </div>
  );
}

export default Pagination;
