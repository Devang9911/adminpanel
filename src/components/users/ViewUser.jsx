const colors = [
  "bg-violet-500",
  "bg-pink-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-indigo-500",
];

const getColorFromName = (name = "") => {
  const index =
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

const getStatusStyle = (status) => {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "inactive":
      return "bg-gray-100 text-gray-500 ring-1 ring-gray-200";
    case "expired":
      return "bg-red-50 text-red-600 ring-1 ring-red-200";
    default:
      return "bg-gray-100 text-gray-400";
  }
};

function formatDate(dateString, locale = "en-IN") {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-xs font-medium text-gray-700">{value ?? "-"}</span>
    </div>
  );
}

export default function ViewUser({ data }) {
  if (!data) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3.5 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold text-white uppercase flex-shrink-0 ${getColorFromName(data.name)}`}
        >
          {data.name?.[0] || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 capitalize truncate">
            {data.name || "-"}
          </p>
          <p className="text-xs text-gray-400 truncate mt-0.5">
            {data.email || "-"}
          </p>
          {data.phone && (
            <p className="text-xs text-gray-400 mt-0.5">{data.phone}</p>
          )}
        </div>
        <span
          className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium capitalize flex-shrink-0 ${getStatusStyle(data.status)}`}
        >
          {data.status || "-"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-2">
            Plan
          </p>
          {data.plan?.name || data.plan ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
              {data.plan?.name || data.plan}
            </span>
          ) : (
            <span className="text-xs text-gray-300">No plan</span>
          )}
        </div>

        <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-2">
            Category
          </p>
          <p className="text-xs font-medium text-gray-700">
            {data.category || <span className="text-gray-300">-</span>}
          </p>
        </div>
      </div>

      <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-2.5">
          Modules
        </p>
        <div className="flex flex-wrap gap-1.5">
          {data.modules?.length ? (
            data.modules.map((m, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-500"
              >
                {m}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-300">No modules assigned</span>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Subscription
          </span>
        </div>
        <div className="px-4 py-1 bg-white">
          <InfoRow label="Last renewal" value={formatDate(data.renewal_date)} />
          <InfoRow
            label="Expiry"
            value={
              <span className={data.status === "expired" ? "text-red-500" : ""}>
                {formatDate(data.expiry_date)}
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
}
