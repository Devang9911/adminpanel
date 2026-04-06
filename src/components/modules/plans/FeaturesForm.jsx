import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getFeaturesById } from "../../../store/featuresSlice";
import { addFeature } from "../../../store/planSlice";

export default function FeaturesForm({ planId, productId, onClose, editData }) {
  const { register, handleSubmit, reset } = useForm();
  useEffect(() => {
    if (editData) {
      reset({
        featureId: editData.featureId,
        featureValue: editData.featureValue,
      });
    }
  }, [editData, reset]);
  const isEdit = !!editData;
  const dispatch = useDispatch();

  const features = useSelector((state) => state.features.features);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      dispatch(getFeaturesById(productId));
    }
  }, [dispatch, productId]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        planId: Number(planId),
        featureId: Number(data.featureId),
        featureValue: data.featureValue,
      };

      console.log("FINAL PAYLOAD:", payload);
      await dispatch(addFeature(payload)).unwrap();
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

        <input
          type="text"
          {...register("featureValue", { required: true })}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="Enter feature value"
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
            {loading ? "Saving..." : isEdit ? "Update Feature" : "Save Feature"}
          </button>
        </div>
      </form>
    </div>
  );
}
