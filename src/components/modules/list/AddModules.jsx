import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getProducts, manageProduct } from "../../../store/productSlice";
import { useEffect } from "react";

function AddModules({ setToggleForm, mode, defaultData }) {
  const dispatch = useDispatch();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: defaultData || {},
  });

  useEffect(() => {
    if (defaultData) {
      reset({
        product_name: defaultData.product_name,
        product_description: defaultData.product_description,
        is_active: !!defaultData.is_active,
      });
    } else {
      reset({
        product_name: "",
        product_description: "",
        is_active: true,
      });
    }
  }, [defaultData, reset]);

  const handleFormSubmit = async (formData) => {
    try {
      const payload = {
        productName: formData.product_name,
        productDescription: formData.product_description,
        isActive: !!formData.is_active,
        id: mode === "edit" ? defaultData?.id : undefined,
      };

      await dispatch(manageProduct(payload)).unwrap();
      dispatch(getProducts());

      toast.success(mode === "edit" ? "Module updated" : "Module created");

      setToggleForm(false);
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Description
              </label>
              <textarea
                {...register("product_description")}
                placeholder="Short description about module..."
                className="w-full border border-gray-300 rounded px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">
              Settings
            </h3>

            <div className="flex items-center justify-between border rounded px-4 py-3">
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
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded font-medium transition"
          >
            {mode === "edit" ? "Save Changes" : "Create Module"}
          </button>

          <button
            type="button"
            onClick={() => setToggleForm(false)}
            className="px-4 py-2 border rounded hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddModules;
