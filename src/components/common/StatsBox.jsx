function StatsBox({ title, value, icon: Icon, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-white border border-gray-100 p-5 overflow-hidden transition-all hover:shadow-sm hover:border-gray-200 ${onClick ? "cursor-pointer" : ""}`}
    >
      <div
        className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-5 ${color}`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-semibold text-gray-800 mt-1.5 tracking-tight">
            {value}
          </p>
        </div>
        <div
          className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${color}`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>

      {onClick && (
        <div className="mt-4 flex items-center gap-1 text-[11px] text-gray-300 group-hover:text-indigo-400 transition-colors">
          <span>View details</span>
          <svg
            className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 16 16"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default StatsBox;
