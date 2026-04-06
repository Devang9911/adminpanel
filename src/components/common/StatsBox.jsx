function StatsBox({ title, value, icon: Icon, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group relative flex-1 min-w-55 cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white p-5 transition-all "
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-linear-to-r from-transparent to-gray-50" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>

        <div
          className={`w-12 h-12 rounded flex items-center justify-center ${color} shadow-sm`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400 group-hover:text-gray-600">
        Click to view details →
      </div>
    </div>
  );
}

export default StatsBox;
