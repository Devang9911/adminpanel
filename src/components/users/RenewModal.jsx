import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPlans } from "../../store/planSlice";

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
      <span className="text-xs font-medium text-gray-700">{value}</span>
    </div>
  );
}

export default function RenewModal({ onClose, data }) {
  const dispatch = useDispatch();
  const { plans = [] } = useSelector((state) => state.plans);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    dispatch(getAllPlans({ status: "", module: "", category: "" }));
  }, [dispatch]);

  const handleRenew = () => {
    if (!selectedPlan) return;
    const payload = {
      userId: data?.id,
      planId: selectedPlan.planId,
      priceId: selectedPlan.priceId,
      billingCycle: selectedPlan.billingCycle,
    };
    console.log(payload);
  };

  const handleSelect = (e) => {
    const value = JSON.parse(e.target.value);
    setSelectedPlan(value);
  };

  return (
    <div className="flex flex-col gap-5">
      {data?.category === null && (
        <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-100">
          <span className="text-amber-500 text-base mt-0.5">⚠</span>
          <p className="text-xs text-amber-700 leading-relaxed">
            This user is not subscribed to any plan yet.
          </p>
        </div>
      )}

      {data?.category !== null && (
        <div className=" border border-gray-100 bg-gray-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Current subscription
            </span>
            <span
              className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium capitalize ${getStatusStyle(data?.status)}`}
            >
              {data?.status}
            </span>
          </div>

          <div className="px-4 py-1">
            <InfoRow label="Plan" value={data?.plan?.name || "—"} />
            <InfoRow
              label="Last renewal"
              value={formatDate(data?.renewal_date)}
            />
            <InfoRow
              label="Expiry"
              value={
                <span
                  className={data?.status === "expired" ? "text-red-500" : ""}
                >
                  {formatDate(data?.expiry_date)}
                </span>
              }
            />
          </div>
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-2 block">
          Select new plan
        </label>

        <select
          onChange={handleSelect}
          defaultValue=""
          className="w-full border border-gray-200 bg-gray-50 text-xs text-gray-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition"
        >
          <option value="" disabled>
            Choose a plan…
          </option>
          {plans.map((p) =>
            p.pricing?.map((price , i) => (
              <option
                key={i}
                value={JSON.stringify({
                  planId: p.id,
                  priceId: price.priceId,
                  billingCycle: price.cycle,
                })}
              >
                {p.plan_name} — {p.module_name} — {price.cycle} — ₹
                {price.amount}
              </option>
            )),
          )}
        </select>

        {selectedPlan && (
          <div className="mt-3 flex items-center justify-between px-3.5 py-3 bg-indigo-50 border border-indigo-100">
            <div>
              <p className="text-[11px] text-indigo-400 font-medium uppercase tracking-wider mb-0.5">
                Selected
              </p>
              <p className="text-xs font-semibold text-indigo-700 capitalize">
                {selectedPlan.billingCycle} billing cycle
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-indigo-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 16 16"
              >
                <polyline points="2,8 6,12 14,4" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleRenew}
          disabled={!selectedPlan}
          className={`px-4 py-2 text-xs font-medium text-white transition-colors ${
            selectedPlan
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Renew plan
        </button>
      </div>
    </div>
  );
}
