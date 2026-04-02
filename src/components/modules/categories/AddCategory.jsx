import { useForm } from "react-hook-form";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getCategories, manageCategory } from "../../../store/categorySlice";

function AddCategory({ onClose, mode, editData }) {
  const dispatch = useDispatch();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      categoryName: "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && editData) {
      reset(editData);
    } else {
      reset({ categoryName: "" });
    }
  }, [editData, mode, reset]);

  const handleFormSubmit = async (data) => {
    try {
      await dispatch(
        manageCategory({
          ...data,
          id: editData?.id,
        }),
      ).unwrap();

      dispatch(getCategories());

      toast.success(mode === "edit" ? "Category updated" : "Category added");

      onClose();
      reset();
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="text-sm font-medium text-gray-600">
          Category Name
        </label>

        <input
          {...register("categoryName")}
          required
          placeholder="Enter category name"
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-5 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          {mode === "edit" ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}

export default AddCategory;
