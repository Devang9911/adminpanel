import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getProducts, manageProduct } from "../../../store/productSlice";

function AddModules({ onClose, type, editData }) {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: editData || {},
  });

  useEffect(() => {
    if (editData) {
      reset({
        product_name: editData.product_name,
        product_description: editData.product_description,
        is_active: !!editData.is_active,
      });
    } else {
      reset({ product_name: "", product_description: "", is_active: true });
    }
  }, [editData, reset]);

  const handleFormSubmit = async (formData) => {
    try {
      const payload = {
        productName: formData.product_name,
        productDescription: formData.product_description,
        isActive: !!formData.is_active,
        id: type === "editModule" ? editData?.id : undefined,
      };
      await dispatch(manageProduct(payload)).unwrap();
      dispatch(getProducts());
      toast.success(
        type === "editModule" ? "Module updated" : "Module created",
      );
      onClose();
      reset();
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-5"
    >
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
          Module name
        </label>
        <input
          {...register("product_name")}
          required
          placeholder="e.g. SignalX"
          className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
          Description
        </label>
        <textarea
          {...register("product_description")}
          placeholder="Short description about this module…"
          rows={3}
          className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-xs text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition"
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl">
        <div>
          <p className="text-xs font-semibold text-gray-700">Active module</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Enable or disable this module
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            {...register("is_active")}
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
          className="px-4 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-xs font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          {type === "editModule" ? "Save changes" : "Create module"}
        </button>
      </div>
    </form>
  );
}

export default AddModules;
