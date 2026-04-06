import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getProducts, manageProduct } from "../../../store/productSlice";
import { useEffect } from "react";

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
      reset({
        product_name: "",
        product_description: "",
        is_active: true,
      });
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
    <div className="flex flex-col h-full bg-white">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col overflow-hidden"
      >
        <div className="flex-1 overflow-y-auto space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Module Name
              </label>
              <input
                {...register("product_name")}
                required
                placeholder="e.g. SignalX"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Description
              </label>
              <textarea
                {...register("product_description")}
                placeholder="Short description about module..."
                className="w-full border border-gray-300 rounded-xl px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">
              Settings
            </h3>

            <div className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-3">
              <div>
                <p className="font-medium text-sm">Active Module</p>
                <p className="text-xs text-gray-500">
                  Enable or disable this module
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("is_active")}
                  className="sr-only peer"
                />

                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-indigo-600 transition"></div>

                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="py-4 bg-white flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium transition"
          >
            {type === "editModule" ? "Save Changes" : "Create Module"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-xl hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddModules;
