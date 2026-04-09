import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addPricing, getPlanById } from "../../../store/planSlice";

export default function PricingForm({ planId, onClose, editData }) {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
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
        planId: Number(planId),
        planBillingCycle: data.planBillingCycle,
        planAmount: Number(data.planAmount),
      };

      if (isEdit) {
        toast.success("Pricing Updated Successfully");
      } else {
        await dispatch(addPricing(payload)).unwrap();
        toast.success("Pricing Added Successfully");
      }

      dispatch(getPlanById({ planId }));

      onClose();
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto bg-white rounded-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <select
          {...register("planBillingCycle", { required: true })}
          className="border border-gray-300 p-2 rounded w-full"
        >
          <option value="">Select Billing Cycle</option>
          <option value="15 days">15 Days</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <input
          type="number"
          {...register("planAmount", { required: true })}
          placeholder="Plan Amount"
          className="border border-gray-300 p-2 rounded w-full"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full border border-gray-300 p-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded-lg"
          >
            {loading ? "Saving..." : isEdit ? "Update Pricing" : "Save Pricing"}
          </button>
        </div>
      </form>
    </div>
  );
}
