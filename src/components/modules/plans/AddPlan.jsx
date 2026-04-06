import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../store/productSlice";
import { getCategories } from "../../../store/categorySlice";
import { createPlan, getAllPlans } from "../../../store/planSlice";
import toast from "react-hot-toast";

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

      console.log("FINAL PAYLOAD:", payload);

      // await dispatch(createPlan(payload)).unwrap();
      // dispatch(getAllPlans());
      onClose();
      toast.success("Plan Created Successfully");

      reset();
    } catch (err) {
      console.error(err);
      toast.error("Error creating plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-5 bg-white rounded-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <select
          {...register("productId", { required: true })}
          className="border border-gray-300 p-2 rounded w-full"
        >
          <option value="">Select Product</option>
          {products?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.product_name}
            </option>
          ))}
        </select>

        <select
          {...register("categoryId", { required: true })}
          className="border border-gray-300 p-2 rounded w-full"
        >
          <option value="">Select Category</option>
          {categoryList?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.categoryName}
            </option>
          ))}
        </select>

        <input
          {...register("planName", { required: true })}
          placeholder="Plan Name"
          className="border border-gray-300 p-2 rounded w-full"
        />

        <textarea
          {...register("planDescription")}
          placeholder="Plan Description"
          className="border border-gray-300 p-2 rounded w-full"
        />
        <div className="flex gap-2">
          <button
            className="w-full text-black border border-gray-300 p-2 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded-lg"
          >
            {loading ? "Creating..." : "Create Plan"}
          </button>
        </div>
      </form>
    </div>
  );
}
