import { EyeIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../../store/categorySlice";
import { getAllPlans } from "../../../store/planSlice";
import { getProducts } from "../../../store/productSlice";
import Drawer from "../../common/Drawer";
import Loader from "../../common/Loader";
import AddPlan from "./AddPlan";
import { TrashIcon } from "lucide-react";

const tabs = [{ name: "All" }, { name: "Active" }, { name: "Inactive" }];

function PlanList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    module: "all",
    status: "all",
  });
  const [drawer, setDrawer] = useState({
    open: false,
    type: "add",
    data: null,
  });

  const { plans, loading } = useSelector((state) => state.plans);
  const { products } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    dispatch(getAllPlans({ ...filters, search: debouncedSearch }));
  }, [filters, debouncedSearch, dispatch]);

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="w-full bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-semibold text-gray-800 tracking-tight">
            Plans
          </h2>
          {!loading && (
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {plans.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setDrawer({ open: true, type: "add", data: null })}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="w-3.5 h-3.5" /> Add plan
        </button>
      </div>

      <div className="flex gap-1 px-6 pt-3 border-b border-gray-100">
        {tabs.map((tab, i) => {
          const isActive = filters.status === tab.name.toLowerCase();
          return (
            <button
              key={i}
              onClick={() =>
                handleFilterChange("status", tab.name.toLowerCase())
              }
              className={`pb-2.5 px-3 text-xs font-medium transition-colors ${
                isActive
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2.5 px-6 py-3 border-b border-gray-100">
        <div className="relative flex-1 min-w-52">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 16 16"
          >
            <circle cx="6.5" cy="6.5" r="4" />
            <line x1="10.5" y1="10.5" x2="14" y2="14" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by plan…"
            className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
          />
        </div>
        <select
          value={filters.module}
          onChange={(e) => handleFilterChange("module", e.target.value)}
          className="border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="all">All modules</option>
          {products.map((p) => (
            <option key={p.id} value={p.product_name}>
              {p.product_name}
            </option>
          ))}
        </select>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.categoryName}>
              {c.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/70">
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Plan
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Module
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="text-center px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading && plans?.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <Loader />
                </td>
              </tr>
            )}

            {!loading && plans?.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-14 text-gray-300 text-xs"
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M9 9h6M9 13h4" />
                    </svg>
                    No plans found
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              plans?.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-6 py-3.5 text-xs font-semibold text-gray-800 capitalize">
                    {p.plan_name}
                  </td>
                  <td className="px-6 py-3.5 text-xs text-gray-500 capitalize">
                    {p.module_name}
                  </td>
                  <td className="px-6 py-3.5 text-xs text-gray-500 capitalize">
                    {p.category_name}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex items-center text-[11px] font-medium px-2.5 py-0.5 rounded-full ring-1 ${
                        p.is_active
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : "bg-red-50 text-red-600 ring-red-200"
                      }`}
                    >
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => console.log("Delete feature:", p.id)}
                        className="relative p-1.5 hover:bg-red-50 transition-colors group/btn"
                      >
                        <TrashIcon className="w-4 h-4 text-red-400 group-hover/btn:text-red-600" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                          Delete
                        </span>
                      </button>
                      <button
                        onClick={() => navigate(`details/${p.id}`)}
                        className="relative p-1.5 hover:bg-gray-100 transition-colors group/btn"
                      >
                        <EyeIcon className="w-4 h-4 text-gray-400 group-hover/btn:text-gray-600" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                          View
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Drawer
        open={drawer.open}
        onClose={() => setDrawer({ open: false, type: "", data: null })}
        title="Create plan"
      >
        <AddPlan
          onClose={() => setDrawer({ open: false, type: "", data: null })}
        />
      </Drawer>
    </div>
  );
}

export default PlanList;
