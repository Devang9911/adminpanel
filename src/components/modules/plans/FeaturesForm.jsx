import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getFeaturesById } from "../../../store/featuresSlice";

export default function FeaturesForm({ planId, productId, onClose }) {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();

  const features = useSelector((state) => state.features.features);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getFeaturesById(productId));
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        planId: Number(planId),
        featureId: Number(data.featureId),
        featureValue: data.featureValue,
      };

      console.log("FINAL PAYLOAD:", payload);

      // await dispatch(addFeatureToPlan(payload)).unwrap();

      toast.success("Feature Added Successfully");
      onClose();
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Error adding feature");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-5 bg-white rounded-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <select
          {...register("featureId", { required: true })}
          className="border border-gray-300 p-2 rounded w-full"
          required
        >
          <option value="">Select Feature</option>
          {features?.map((f) => (
            <option key={f.id} value={f.id}>
              {f.featureName}
            </option>
          ))}
        </select>

        <select
          {...register("featureValue", { required: true })}
          className="border border-gray-300 p-2 rounded w-full"
          required
        >
          <option value="">Select Value</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>

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
            {loading ? "Saving..." : "Save Feature"}
          </button>
        </div>
      </form>
    </div>
  );
}
