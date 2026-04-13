import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { addPricing, getPlanById } from "../../../store/planSlice";
import { useDispatch } from "react-redux";

export default function PricingForm({ planId, onClose, editData }) {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const isEdit = !!editData;

  useEffect(() => {
    if (editData) {
      reset({
        planBillingCycle: editData.plan_billing_cycle,
        planAmount: editData.plan_amount,
      });
    }
  }, [editData, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        id: editData?.price_id,
        planId: Number(planId),
        planBillingCycle: data.planBillingCycle,
        planAmount: Number(data.planAmount),
      };
      await dispatch(addPricing(payload)).unwrap();
      dispatch(getPlanById({ planId }));
      toast.success(isEdit ? "Pricing updated" : "Pricing added");
      onClose();
      reset();
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
          Billing cycle
        </label>
        <select
          {...register("planBillingCycle", { required: true })}
          className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition"
        >
          <option value="">Select billing cycle…</option>
          <option value="15 days">15 days</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
          Amount (₹)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
            ₹
          </span>
          <input
            type="number"
            {...register("planAmount", { required: true })}
            placeholder="0"
            className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-7 pr-3 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-xs font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving…" : isEdit ? "Save changes" : "Add pricing"}
        </button>
      </div>
    </form>
  );
}
