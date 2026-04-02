import { EyeIcon, PencilSquareIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../../store/categorySlice";
import { getAllPlans } from "../../../store/planSlice";
import Loader from "../../common/Loader";
import PlansDrawer from "./PlansDrawer";

const tabs = [{ name: "All" }, { name: "Active" }, { name: "Inactive" }];

function Plans() {
  const dispatch = useDispatch();

  const { plans, loading } = useSelector((state) => state.plans);
  const categories = useSelector((state) => state.category.categories);

  const [toggleForm, setToggleForm] = useState(false);
  const [viewPlan, setViewPlan] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });

  const [drawer, setDrawer] = useState({
    open: false,
    type: "add",
    data: null,
  });

  useEffect(() => {
    dispatch(getAllPlans());
    dispatch(getCategories());
  }, [dispatch]);

  const handleStatusTab = (status) => {
    setFilters((prev) => ({
      ...prev,
      status,
    }));
  };

  return (
    <div className="w-full bg-white rounded shadow">
      <div className="flex items-center justify-between py-3 px-5 border-b border-gray-300">
        <h2 className="text-2xl uppercase tracking-wider font-semibold">
          Plans
        </h2>

        <button
          onClick={() => {
            setDrawer({ open: true, type: "add", data: null });
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
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
          placeholder="Search name, email, phone..."
          className="flex-1 min-w-62.5 px-4 py-2 border border-gray-300 rounded text-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-6 py-3">Plan</th>
              <th className="text-left px-6 py-3">Modules</th>
              <th className="text-left px-6 py-3">Category</th>
              <th className="text-left px-6 py-3">Price</th>
              <th className="text-left px-6 py-3">Billing</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-center px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={7}>
                  <Loader />
                </td>
              </tr>
            )}

            {!loading && plans?.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-400">
                  No plans found
                </td>
              </tr>
            )}

            {!loading &&
              plans?.map((p) => {
                const price = p.prices?.[0];

                const categoryName =
                  categories.find((c) => c.id === p.categoryId)?.categoryName ||
                  "—";

                return (
                  <tr key={p.planId} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium capitalize">
                      {p.planName}
                    </td>

                    <td className="px-6 py-4 capitalize">{p.productName}</td>

                    <td className="px-6 py-4 capitalize text-gray-600">
                      {categoryName}
                    </td>

                    <td className="px-6 py-4">
                      {price?.amount ? `₹${price.amount}` : "-"}
                    </td>

                    <td className="px-6 py-4 capitalize">
                      {price?.billingCycle || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          p.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => {
                            setDrawer({ open: true, type: "view", data: p });
                          }}
                          className="group relative hover:bg-gray-200 p-2 rounded"
                        >
                          <EyeIcon className="w-5 h-5 text-gray-600" />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                            View
                          </span>
                        </button>

                        <button
                          className="group relative hover:bg-blue-100 p-2 rounded"
                          onClick={() => {
                            setDrawer({ open: true, type: "edit", data: p });
                          }}
                        >
                          <PencilSquareIcon className="w-5 h-5 text-blue-600" />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                            Edit
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
      <PlansDrawer
        open={drawer.open}
        type={drawer.type}
        data={drawer.data}
        onClose={() => setDrawer({ open: false, type: "", data: null })}
      />
    </div>
  );
}

export default Plans;
