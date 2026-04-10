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

  const { plans, loading } = useSelector((state) => state.plans);
  const { products } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);

  const [drawer, setDrawer] = useState({
    open: false,
    type: "add",
    data: null,
  });

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    dispatch(
      getAllPlans({
        ...filters,
        search: debouncedSearch,
      }),
    );
  }, [filters, debouncedSearch, dispatch]);

  const handleStatusTab = (status) => {
    setFilters((prev) => ({
      ...prev,
      status,
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="w-full bg-white rounded-xl shadow">
      <div className="flex items-center justify-between py-3 px-5 border-b border-gray-300">
        <h2 className="text-2xl uppercase tracking-wider font-semibold">
          Plans
        </h2>

        <button
          onClick={() => setDrawer({ open: true, type: "add", data: null })}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
        >
          <PlusIcon className="w-4 h-4" />
          Add Plan
        </button>
      </div>

      <div className="flex gap-6 px-5 pt-4 border-b border-gray-300">
        {tabs.map((tab, i) => {
          const isActive = filters.status === tab.name.toLowerCase();

          return (
            <button
              key={i}
              onClick={() => handleStatusTab(tab.name.toLowerCase())}
              className={`pb-3 text-sm font-medium ${
                isActive
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 py-3 px-5 border-b border-gray-300">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by plan..."
          className="flex-1 min-w-62.5 px-4 py-2 border border-gray-300 rounded-xl text-sm"
        />

        <select
          value={filters.module}
          onChange={(e) => handleFilterChange("module", e.target.value)}
          className="border rounded-xl border-gray-300 px-3 py-2 text-sm"
        >
          <option value="all">All Modules</option>
          {products.map((p) => (
            <option key={p.id} value={p.product_name}>
              {p.product_name}
            </option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="border rounded-xl border-gray-300 px-3 py-2 text-sm"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.categoryName}>
              {c.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-6 py-3">Plan</th>
              <th className="text-left px-6 py-3">Modules</th>
              <th className="text-left px-6 py-3">Category</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-center px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && plans?.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <Loader />
                </td>
              </tr>
            )}

            {!loading && plans?.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No plans found
                </td>
              </tr>
            )}

            {!loading &&
              plans?.map((p) => {

                return (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium capitalize">
                      {p.plan_name}
                    </td>

                    <td className="px-6 py-4 capitalize">{p.module_name}</td>

                    <td className="px-6 py-4 capitalize text-gray-600">
                      {p.category_name}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          p.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {p.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() =>
                            navigate(`details/${p.id}`)
                          }
                          className="group relative hover:bg-gray-200 p-2 rounded-xl"
                        >
                          <EyeIcon className="w-5 h-5 text-gray-600" />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                            View
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <Drawer
        open={drawer.open}
        onClose={() => setDrawer({ open: false, type: "", data: null })}
        title={"Create Plan"}
      >
        <AddPlan
          onClose={() => setDrawer({ open: false, type: "", data: null })}
        />
      </Drawer>
    </div>
  );
}

export default PlanList;
