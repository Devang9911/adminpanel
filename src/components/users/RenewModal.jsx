import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPlans } from "../../store/planSlice";

const getStatusBadge = (status) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "inactive":
      return "bg-gray-200 text-gray-600";
    case "expired":
      return "bg-red-200 text-red-600";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

function formatDate(dateString, locale = "en-IN") {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
export default function RenewModal({ onClose, data }) {
  const dispatch = useDispatch();
  const { plans = [] } = useSelector((state) => state.plans);

  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    dispatch(getAllPlans());
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
    <div className="bg-white">
      {data?.category === "General" ? (
        <div className="bg-yellow-50 text-yellow-700 p-3 rounded-xl text-sm mb-5">
          User is not subscribed to any plan yet.
        </div>
      ) : (
        <div className="p-4 mb-5 bg-gray-50">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">Current Plan</span>
            <span className="font-medium">{data?.plan?.name}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">Last Renewal</span>
            <span>{formatDate(data?.renewal_date)}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">Expiry</span>
            <span>{formatDate(data?.expiry_date)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Status</span>
            <span
              className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(
                data?.status,
              )}`}
            >
              {data?.status}
            </span>
          </div>
        </div>
      )}

      <div className="mb-5">
        <label className="text-sm font-medium mb-1 block">
          Select New Plan
        </label>

        <select
          onChange={handleSelect}
          className="w-full border p-2 rounded-xl"
          defaultValue=""
        >
          <option value="" disabled>
            Choose a plan
          </option>

          {plans.map((p) =>
            p.prices?.map((price) => (
              <option
                key={price.priceId}
                value={JSON.stringify({
                  planId: p.planId,
                  priceId: price.priceId,
                  billingCycle: price.billingCycle,
                })}
              >
                {p.planName} - {p.productName} - {price.billingCycle} - ₹
                {price.amount}
              </option>
            )),
          )}
        </select>

        {selectedPlan && (
          <div className="mt-3 p-3 bg-indigo-50 rounded-xl text-sm capitalize">
            <p>
              <strong>Selected :</strong> {selectedPlan.billingCycle} plan
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded-xl hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleRenew}
          disabled={!selectedPlan}
          className={`px-4 py-2 rounded-xl text-white ${
            selectedPlan
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Renew Plan
        </button>
      </div>
    </div>
  );
}
