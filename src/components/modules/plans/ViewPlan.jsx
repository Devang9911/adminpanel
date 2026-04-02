import { useSelector } from "react-redux";

function ViewPlan({ plan, setViewPlan }) {
  const categories = useSelector((state) => state.category.categories);

  const categoryName =
    categories.find((c) => c.id === plan.categoryId)?.categoryName || "—";

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded shadow flex flex-col max-h-[90vh]">
        <div className="bg-linear-to-r from-blue-600 to-blue-900 text-white flex justify-between items-center px-6 py-4 border-b sticky top-0 rounded-t">
          <div>
            <h2 className="text-xl font-semibold">{plan.planName}</h2>
            <p className="text-sm opacity-80">Plan overview</p>
          </div>

          <button
            onClick={() => setViewPlan(null)}
            className="text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-3 py-3 space-y-3">
          <div className="grid grid-cols-4 gap-2">
            <div className="rounded border p-4">
              <p className="text-xs text-gray-500">Product</p>
              <p className="capitalize font-semibold">{plan.productName}</p>
            </div>

            <div className="rounded border p-4">
              <p className="text-xs text-gray-500">Category</p>
              <p className="capitalize font-semibold">{categoryName}</p>
            </div>

            <div className="rounded border p-4">
              <p className="text-xs text-gray-500">Status</p>

              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  plan.isActive
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {plan.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="rounded border p-4">
              <p className="text-xs text-gray-500">Prices</p>
              <div className="flex flex-wrap gap-2">
                {plan.prices?.map((p) => (
                  <div
                    key={p.priceId}
                    className="capitalize rounded text-sm"
                  >
                    {p.billingCycle} — ₹ {p.amount}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Features</p>

            <div className="max-h-64 overflow-y-auto border rounded">
              <div className="grid grid-cols-2 gap-2 p-3">
                {plan.features?.map((f) => (
                  <div
                    key={f.id}
                    className="rounded border px-3 py-2 text-sm flex justify-between bg-gray-50"
                  >
                    <span>{f.featureName}</span>

                    <span className="font-medium">{f.featureValue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t sticky bottom-0 bg-white rounded-b">
          <button
            onClick={() => setViewPlan(null)}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewPlan;
