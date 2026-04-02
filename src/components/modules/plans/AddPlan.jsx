import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../../store/categorySlice";
import { getFeaturesById } from "../../../store/featuresSlice";
import { getProducts } from "../../../store/productSlice";

function AddPlan({ onClose, editData }) {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.product.products);
  const features = useSelector((state) => state.features.features);
  const categories = useSelector((state) => state.category.categories);

  const [step, setStep] = useState(1);
  const isEdit = !!editData;

  const { register, handleSubmit, watch, reset } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      product: "",
      category: "",
      planName: "",
      description: "",
      billing: "Monthly",
      amount: "",
      features: {},
    },
  });

  const productWatch = watch("product");
  const categoryWatch = watch("category");
  const planNameWatch = watch("planName");
  const amountWatch = watch("amount");

  const canProceedStep1 = productWatch && categoryWatch && planNameWatch;

  const canProceedStep2 = Number(amountWatch) > 0;

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (editData) {
      reset({
        product: editData.productId,
        category: editData.categoryId,
        planName: editData.planName,
        description: editData.description,
        billing: editData.prices?.[0]?.billingCycle || "Monthly",
        amount: editData.prices?.[0]?.amount || "",
        features: editData.features || {},
      });

      dispatch(getFeaturesById(editData.productId));
    }
  }, [editData, reset, dispatch]);

  useEffect(() => {
    if (productWatch) {
      reset((prev) => ({
        ...prev,
        features: {},
      }));
      dispatch(getFeaturesById(productWatch));
    }
  }, [productWatch, dispatch]);

  const onSubmit = (formData) => {
    if (step !== 3) return;

    const payload = {
      productId: formData.product,
      categoryId: formData.category,
      planName: formData.planName,
      description: formData.description,
      prices: [
        {
          billingCycle: formData.billing,
          amount: Number(formData.amount),
        },
      ],
      features: formData.features,
    };

    console.log("Payload:", payload);
    onClose();
  };

  return (
    <div className="w-100 h-full bg-white shadow flex flex-col">
      <div className="px-6 py-4 border-b border-gray-300">
        <p className="text-sm text-gray-500">Step {step} of 3</p>
      </div>

      <form
        onSubmit={
          step === 3 ? handleSubmit(onSubmit) : (e) => e.preventDefault()
        }
        className="flex flex-col overflow-hidden"
      >
        <div className="overflow-y-auto p-6 space-y-5 flex-1">
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Product
                  </label>
                  <select
                    {...register("product")}
                    className="w-full border border-gray-300 rounded px-2 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Select</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.product_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Category
                  </label>
                  <select
                    {...register("category")}
                    className="w-full border border-gray-300 rounded px-2 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Select</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <input
                {...register("planName")}
                placeholder="Plan Name"
                className="w-full border border-gray-300 rounded px-2 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <textarea
                {...register("description")}
                placeholder="Description"
                className="w-full border border-gray-300 rounded px-2 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </>
          )}

          {step === 2 && (
            <>
              <select
                {...register("billing")}
                className="w-full border border-gray-300 rounded px-2 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option>Monthly</option>
                <option>Yearly</option>
              </select>

              <input
                type="number"
                {...register("amount")}
                placeholder="Amount"
                className="w-full border border-gray-300 rounded px-2 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </>
          )}

          {step === 3 && (
            <div className="flex flex-col h-full">
              <div className="sticky top-0 bg-white z-10">
                <p className="text-lg font-semibold">Plan Features</p>
              </div>

              {features.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                  No features available for this product
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto mt-4 pr-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((f) => (
                      <div
                        key={f.id}
                        className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition"
                      >
                        <label className="text-sm font-medium text-gray-700">
                          {f.featureName}
                        </label>

                        <input
                          {...register(`features.${f.id}`)}
                          placeholder="Enter value"
                          className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 flex justify-between">
          <button
            type="button"
            onClick={() =>
              step === 1 ? onClose() : setStep((prev) => prev - 1)
            }
            className="px-4 py-2 border rounded"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setStep((prev) => prev + 1);
              }}
              disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
              className="px-5 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-5 py-2 bg-green-600 text-white rounded"
            >
              {isEdit ? "Update Plan" : "Create Plan"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddPlan;
