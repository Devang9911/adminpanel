import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getFeaturesById } from "../../../store/featuresSlice";
import { addFeature, getPlanById } from "../../../store/planSlice";

export default function FeaturesForm({ planId, productId, onClose, editData }) {
  const { register, handleSubmit, reset, setValue } = useForm();
  const dispatch = useDispatch();
  const features = useSelector((state) => state.features.features);
  const [loading, setLoading] = useState(false);
  const isEdit = !!editData;

  useEffect(() => {
    if (productId) dispatch(getFeaturesById(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (editData && features.length) {
      const matchedFeature = features.find(
        (f) => f.featureName === editData.feature_name,
      );
      if (matchedFeature) {
        setValue("featureId", matchedFeature.id);
      }
      setValue("featureValue", editData.feature_value);
    }
  }, [editData, features, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        id: editData.plan_feature_id,
        planId: Number(planId),
        featureId: Number(data.featureId),
        featureValue: data.featureValue,
      };
      await dispatch(addFeature(payload)).unwrap();
      dispatch(getPlanById({ planId }));
      toast.success(isEdit ? "Feature updated" : "Feature added");
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
          Feature
        </label>
        <select
          {...register("featureId", { required: true })}
          disabled={isEdit}
          className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <option value="">Select feature…</option>
          {features?.map((f) => (
            <option key={f.id} value={f.id}>
              {f.featureName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
          Feature value
        </label>
        <input
          type="text"
          {...register("featureValue", { required: true })}
          placeholder="e.g. Unlimited, 10, true"
          className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition"
        />
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
          {loading ? "Saving…" : isEdit ? "Save changes" : "Add feature"}
        </button>
      </div>
    </form>
  );
}
