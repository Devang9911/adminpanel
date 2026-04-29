import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getCategories, manageCategory } from "../../../store/categorySlice";

function AddCategory({ onClose, mode, editData }) {
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { categoryName: "" },
  });

  useEffect(() => {
    if (mode === "edit" && editData) {
      reset({ categoryName: editData.categoryName || "" });
    } else {
      reset({ categoryName: "" });
    }
  }, [editData, mode, reset]);

  const handleFormSubmit = async (data) => {
    try {
      setSubmitting(true);
      await dispatch(manageCategory({ ...data, id: editData?.id })).unwrap();
      dispatch(getCategories());
      toast.success(mode === "edit" ? "Category updated" : "Category added");
      onClose();
      reset();
    } catch (error) {
      toast.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
          Category name
        </label>
        <input
          {...register("categoryName")}
          required
          placeholder="e.g. Enterprise"
          className="w-full border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition"
        />
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
          disabled={submitting}
          className="px-4 py-2 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving…" : mode === "edit" ? "Save changes" : "Add category"}
        </button>
      </div>
    </form>
  );
}

export default AddCategory;