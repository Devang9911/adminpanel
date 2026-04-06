import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InlineLoader } from "../common/Loader";
import { getAllPlans } from "../../store/planSlice";
import { getCategories } from "../../store/categorySlice";
import toast from "react-hot-toast";

const modulesList = ["TrueSheet", "SignalX"];

function CreateUserForm({ data = null, onClose }) {
  const disptach = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const { plans } = useSelector((state) => state.plans);
  useEffect(() => {
    disptach(getAllPlans());
    disptach(getCategories());
  }, []);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category_id: "",
    plan_id: "",
    modules: [],
  });

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        category_id: data.category_id || "",
        plan_id: data.plan_id || "",
        modules: data.modules || [],
      });
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        category_id: "",
        plan_id: "",
        modules: [],
      });
    }
  }, [data]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleModule = (m) => {
    setForm((prev) => ({
      ...prev,
      modules: prev.modules.includes(m)
        ? prev.modules.filter((x) => x !== m)
        : [...prev.modules, m],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-5 pr-1">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Full name
            </label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-2 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Category
            </label>
            <select
              value={form.category_id}
              onChange={(e) => handleChange("category_id", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Plan</label>
            <select
              value={form.plan_id}
              onChange={(e) => handleChange("plan_id", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {plans.map((p) => (
                <option key={p.planId} value={p.planId}>
                  {p.planName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            Module access
          </label>

          <div className="flex gap-2 flex-wrap">
            {modulesList.map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => toggleModule(m)}
                className={`px-3 py-1.5 rounded-xl text-sm border border-gray-400 ${
                  form.modules.includes(m)
                    ? "bg-indigo-100 text-indigo-600 border-indigo-200"
                    : "bg-gray-50 text-gray-600"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 mt-4 flex justify-between items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading && <InlineLoader />}
          {data ? "Save changes" : "Create user"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-xl cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default CreateUserForm;
