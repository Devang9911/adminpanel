import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../../store/categorySlice";
import { getProducts } from "../../../store/productSlice";
import { createPlan, getAllPlans } from "../../../store/planSlice";

export default function AddPlan({ onClose }) {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();

  const products = useSelector((state) => state.product.products);
  const categoryList = useSelector((state) => state.category.categories);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCategories());
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        productId: Number(data.productId),
        categoryId: Number(data.categoryId),
        planName: data.planName,
        planDescription: data.planDescription,
        isActive: true,
      };
      // console.log("FINAL PAYLOAD:", payload);
      await dispatch(createPlan(payload)).unwrap();
      dispatch(getAllPlans({ search: "", status: "", module: "", category: "" }));
      toast.success("Plan created successfully");
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
          Module
        </label>
        <select
          {...register("productId", { required: true })}
          required
          className="w-full border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition"
        >
          <option value="">Select module…</option>
          {products?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.product_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
          Category
        </label>
        <select
          {...register("categoryId", { required: true })}
          required
          className="w-full border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition"
        >
          <option value="">Select category…</option>
          {categoryList?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
          Plan name
        </label>
        <input
          {...register("planName", { required: true })}
          required
          placeholder="e.g. Pro, Starter, Enterprise"
          className="w-full border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
          Description
        </label>
        <textarea
          {...register("planDescription")}
          required
          rows={3}
          placeholder="Short description about this plan…"
          className="w-full border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition"
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
          disabled={loading}
          className="px-4 py-2 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating…" : "Create plan"}
        </button>
      </div>
    </form>
  );
}
