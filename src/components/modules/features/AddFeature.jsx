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
    defaultValues: {
      product: "",
      featureName: "",
      active: true,
    },
  });

  useEffect(() => {
    if (editData) {
      reset({
        product: selectedProductName,
        featureName: editData.featureName,
        active: editData.isActive,
      });
    } else {
      reset({
        product: selectedProductName,
        featureName: "",
        active: true,
      });
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
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col">
      <div className="flex-1 space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-600">Product</label>

          <div className="bg-gray-200 mt-1 flex items-center border border-gray-300 rounded-xl px-3 focus-within:ring-2 focus-within:ring-indigo-500">
            <input
              {...register("product")}
              readOnly
              className="w-full py-2.5 outline-none text-sm cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            Feature Name
          </label>

          <div className="mt-1 flex items-center border border-gray-300 rounded-xl px-3 focus-within:ring-2 focus-within:ring-indigo-500">
            <input
              {...register("featureName")}
              required
              placeholder="Enter feature name"
              className="w-full py-2.5 outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-4">
          <div>
            <p className="font-medium text-sm">Active Feature</p>
            <p className="text-xs text-gray-500">
              Enable or disable this feature
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register("active")}
              className="sr-only peer"
            />

            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 transition"></div>

            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
          </label>
        </div>
      </div>

      <div className="py-3 flex justify-end gap-3 bg-white">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm rounded-xl border border-gray-300 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-5 py-2 text-sm rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          {editData ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}

export default AddFeature;
