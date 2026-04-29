import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getFeaturesById, manageFeatures } from "../../../store/featuresSlice";

function AddFeature({
  selectedProductName,
  selectedProduct,
  editData,
  onClose,
}) {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { product: "", featureName: "", active: true },
  });

  useEffect(() => {
    if (editData) {
      reset({
        product: selectedProductName,
        featureName: editData.featureName,
        active: editData.isActive,
      });
    } else {
      reset({ product: selectedProductName, featureName: "", active: true });
    }
  }, [selectedProductName, editData, reset]);

  const handleFormSubmit = async (data) => {
    const payload = {
      id: editData?.id,
      productId: selectedProduct,
      featureName: data.featureName,
      isActive: data.active,
    };
    try {
      await dispatch(manageFeatures(payload)).unwrap();
      dispatch(getFeaturesById(selectedProduct));
      toast.success(editData ? "Feature updated" : "Feature added");
      onClose();
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-5"
    >
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
          Module
        </label>
        <input
          {...register("product")}
          readOnly
          className="w-full border border-gray-100 bg-gray-100 px-3 py-2.5 text-xs text-gray-400 cursor-not-allowed outline-none"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
          Feature name
        </label>
        <input
          {...register("featureName")}
          required
          placeholder="Enter feature name"
          className="w-full border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition"
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3.5 bg-gray-50 border border-gray-100">
        <div>
          <p className="text-xs font-semibold text-gray-700">Active feature</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Enable or disable this feature
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            {...register("active")}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-indigo-500 transition-colors" />
          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5" />
        </label>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          {editData ? "Save changes" : "Add feature"}
        </button>
      </div>
    </form>
  );
}

export default AddFeature;
