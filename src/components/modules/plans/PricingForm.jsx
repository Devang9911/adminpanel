import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function PricingForm({ planId, onClose }) {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        planId: Number(planId),
        planBillingCycle: data.planBillingCycle,
        planAmount: Number(data.planAmount),
      };

      console.log("FINAL PAYLOAD:", payload);

      // await dispatch(createPricing(payload)).unwrap();

      toast.success("Pricing Added Successfully");
      onClose();
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Error adding pricing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-5 bg-white rounded-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <select
          {...register("planBillingCycle", { required: true })}
          className="border border-gray-300 p-2 rounded w-full"
          required
        >
          <option value="">Select Billing Cycle</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <input
          type="number"
          {...register("planAmount", { required: true })}
          placeholder="Plan Amount"
          className="border border-gray-300 p-2 rounded w-full"
          required
        />

        <div className="flex gap-2">
          <button
            className="w-full text-black border border-gray-300 p-2 rounded-lg"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded-lg"
          >
            {loading ? "Saving..." : "Save Pricing"}
          </button>
        </div>
      </form>
    </div>
  );
}
