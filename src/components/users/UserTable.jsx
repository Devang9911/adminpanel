import {
  ArrowPathIcon,
  EnvelopeIcon,
  EyeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPlans } from "../../store/planSlice";
import { getProducts } from "../../store/productSlice";
import { getAllUsers } from "../../store/userSlice";
import Drawer from "../common/Drawer";
import Loader from "../common/Loader";
import Pagination from "../common/Pagination";
import ViewUser from "../users/ViewUser";
import RenewModal from "./RenewModal";

function formatDate(dateString, locale = "en-IN") {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const tabs = [
  { name: "All" },
  { name: "Active" },
  { name: "Inactive" },
  { name: "Expired" },
];

const colors = [
  "bg-violet-500",
  "bg-pink-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-indigo-500",
];

const getColorFromName = (name = "") => {
  const index =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};

const getStatusBadge = (status) => {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "inactive":
      return "bg-gray-100 text-gray-500 ring-1 ring-gray-200";
    case "expired":
      return "bg-red-50 text-red-600 ring-1 ring-red-200";
    default:
      return "bg-gray-100 text-gray-400";
  }
};

function UserTable() {
  const dispatch = useDispatch();

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    page: 1,
    pageSize: 10,
    search: "",
    module: "all",
    plan: "all",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 400);
    return () => clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    dispatch(getAllUsers({ ...filters, search: debouncedSearch }));
  }, [
    filters.page,
    filters.status,
    filters.module,
    filters.plan,
    debouncedSearch,
    dispatch,
  ]);

  const [sorting, setSorting] = useState({ field: "name", order: "asc" });

  const handleSorting = (field) => {
    setSorting((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const [drawer, setDrawer] = useState({
    open: false,
    type: "add",
    data: null,
  });

  const {
    users = [],
    loading,
    page,
    totalPages,
    total,
  } = useSelector((state) => state.users);
  const { products = [] } = useSelector((state) => state.product);
  const { plans = [] } = useSelector((state) => state.plans);

  useEffect(() => {
    dispatch(getAllPlans({ status: "", module: "", category: "" }));
    dispatch(getProducts());
  }, [dispatch]);

  const handlePageChange = (newPage) =>
    setFilters((prev) => ({ ...prev, page: newPage }));
  const handleSearch = (e) =>
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  const handleStatusTab = (status) =>
    setFilters((prev) => ({ ...prev, status, page: 1 }));

  const sortData = [...users].sort((a, b) => {
    const valueA = a[sorting.field] || "";
    const valueB = b[sorting.field] || "";
    if (typeof valueA === "string")
      return sorting.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    return sorting.order === "asc" ? valueA - valueB : valueB - valueA;
  });

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-semibold text-gray-800 tracking-tight">
            Users
          </h2>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {total}
          </span>
        </div>
        <button
          className="px-3.5 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
          onClick={() => setDrawer({ type: "create", open: true, data: null })}
        >
          <span className="text-base leading-none">+</span> Add user
        </button>
      </div>

      <div className="flex gap-1 px-6 pt-3 border-b border-gray-100">
        {tabs.map((tab, i) => {
          const isActive = filters.status === tab.name.toLowerCase();
          return (
            <button
              key={i}
              onClick={() =>
                handleStatusTab(
                  tab.name.toLowerCase() === "all"
                    ? "all"
                    : tab.name.toLowerCase(),
                )
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
            value={filters.search}
            onChange={handleSearch}
            type="text"
            placeholder="Search name, email…"
            className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
          />
        </div>
        <select
          value={filters.module}
          onChange={(e) => handleFilterChange("module", e.target.value)}
          className="border border-gray-200 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="all">All modules</option>
          {products.map((p) => (
            <option key={p.id} value={p.product_name}>
              {p.product_name}
            </option>
          ))}
        </select>
        <select
          value={filters.plan}
          onChange={(e) => handleFilterChange("plan", e.target.value)}
          className="border border-gray-200 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="all">All plans</option>
          {plans.map((p) => (
            <option key={p.id} value={p.plan_name}>
              {p.plan_name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/70">
              <th
                className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSorting("name")}
              >
                <div className="flex items-center gap-1">
                  User
                  {sorting.field === "name" ? (
                    sorting.order === "asc" ? (
                      <ChevronUpIcon className="w-3 h-3 text-indigo-400" />
                    ) : (
                      <ChevronDownIcon className="w-3 h-3 text-indigo-400" />
                    )
                  ) : (
                    <ChevronUpIcon className="w-3 h-3 text-gray-300" />
                  )}
                </div>
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Plan
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Modules
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Expiry
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Renewal
              </th>
              <th className="text-center px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading && (
              <tr>
                <td colSpan={8}>
                  <Loader />
                </td>
              </tr>
            )}

            {!loading && users?.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-14 text-gray-300 text-sm"
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>No users found</span>
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              sortData?.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-50/60 transition-colors group"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-full text-white flex items-center justify-center uppercase text-xs font-semibold flex-shrink-0 ${getColorFromName(u?.name)}`}
                      >
                        {u?.name?.[0] || "U"}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-gray-800 capitalize leading-tight">
                          {u.name}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-3.5 text-xs text-gray-500">
                    {u.category ?? <span className="text-gray-500">-</span>}
                  </td>

                  <td className="px-6 py-3.5">
                    {u.plan?.name ? (
                      <span className="text-xs text-gray-500">
                        {u.plan.name}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs">-</span>
                    )}
                  </td>

                  <td className="px-6 py-3.5">
                    <div className="flex gap-1.5 flex-wrap">
                      {u.modules?.length ? (
                        u.modules.map((m, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-500"
                          >
                            {m}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-xs">-</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize ${getStatusBadge(u.status)}`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="px-6 py-3.5">
                    {formatDate(u.expiry_date) ? (
                      <span className="text-xs font-medium text-red-400">
                        {formatDate(u.expiry_date)}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs">-</span>
                    )}
                  </td>

                  <td className="px-6 py-3.5">
                    {formatDate(u.renewal_date) ? (
                      <span className="text-xs text-gray-500">
                        {formatDate(u.renewal_date)}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs">-</span>
                    )}
                  </td>

                  <td className="px-6 py-3.5">
                    <div className="flex justify-center items-center gap-1">
                      <button
                        onClick={() =>
                          setDrawer({ type: "view", open: true, data: u })
                        }
                        className="relative p-1.5 rounded-lg hover:bg-gray-100 transition-colors group/btn"
                        title="View"
                      >
                        <EyeIcon className="w-4 h-4 text-gray-400 group-hover/btn:text-gray-600" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                          View
                        </span>
                      </button>

                      <button
                        onClick={() =>
                          setDrawer({ type: "update", open: true, data: u })
                        }
                        className="relative p-1.5 rounded-lg hover:bg-blue-50 transition-colors group/btn"
                        title="Edit"
                      >
                        <PencilSquareIcon className="w-4 h-4 text-blue-400 group-hover/btn:text-blue-600" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                          Edit
                        </span>
                      </button>

                      <button
                        className="relative p-1.5 rounded-lg hover:bg-amber-50 transition-colors group/btn"
                        title="Mail"
                      >
                        <EnvelopeIcon className="w-4 h-4 text-amber-400 group-hover/btn:text-amber-600" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                          Mail
                        </span>
                      </button>

                      <button
                        onClick={() =>
                          setDrawer({ type: "renew", open: true, data: u })
                        }
                        className="relative p-1.5 rounded-lg hover:bg-emerald-50 transition-colors group/btn"
                        title="Renew"
                      >
                        <ArrowPathIcon className="w-4 h-4 text-emerald-400 group-hover/btn:text-emerald-600" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                          Renew
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 border-t border-gray-100 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-b-2xl">
        <div className="text-xs text-gray-400">
          Showing{" "}
          <span className="font-medium text-gray-600">
            {(page - 1) * 10 + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium text-gray-600">
            {Math.min(page * 10, total)}
          </span>{" "}
          of <span className="font-semibold text-gray-700">{total}</span> users
        </div>
        <div className="flex justify-end">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <Drawer
        open={drawer.open}
        onClose={() => setDrawer({ open: false, type: "", data: null })}
        title={`${drawer.type} user`}
      >
        {drawer.type === "view" && <ViewUser data={drawer.data} />}
        {drawer.type === "renew" && (
          <RenewModal
            data={drawer.data}
            onClose={() => setDrawer({ open: false, type: "", data: null })}
          />
        )}
      </Drawer>
    </div>
  );
}

export default UserTable;
