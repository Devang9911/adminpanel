function formatDate(dateString, locale = "en-IN") {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ViewUser({ data }) {
  if (!data) return null;

  return (
    <div className="bg-white rounded-xl flex flex-col gap-6 p-5">
      <div className="flex items-center gap-4">
        <div className="capitalize w-14 h-14 bg-linear-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow">
          {data.name?.[0] || "U"}
        </div>

        <div className="flex flex-col">
          <h2 className="capitalize text-lg font-semibold text-gray-800">
            {data.name || "-"}
          </h2>
          <span className="text-sm text-gray-500">{data.email || "-"}</span>
          <span className="text-xs text-gray-400">{data.phone || "-"}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Plan</p>
          <span className="inline-block px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-600 rounded-full">
            {data.plan?.name || data.plan || "N/A"}
          </span>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Status</p>
          <span
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
              data.status === "active"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-500"
            }`}
          >
            {data.status || "N/A"}
          </span>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Category</p>
          <p className="text-sm font-medium text-gray-700">
            {data.category || "-"}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-2">Modules</p>

          <div className="flex flex-wrap gap-2">
            {data.modules?.length ? (
              data.modules.map((m, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs bg-blue-100 text-blue-600 rounded-full"
                >
                  {m}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-400">No modules</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">
          Subscription
        </h3>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Last renewal</span>
          <span className="font-medium text-gray-700">
            {formatDate(data.renewal_date) || "-"}
          </span>
        </div>

        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Expiry</span>
          <span className="font-medium text-gray-700">
            {formatDate(data.expiry_date) || "-"}
          </span>
        </div>
      </div>
    </div>
  );
}
