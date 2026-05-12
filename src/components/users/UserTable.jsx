import {
  ArrowPathIcon,
  EyeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { ChevronDownIcon, ChevronUpIcon, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPlans } from "../../store/planSlice";
import { getProducts } from "../../store/productSlice";
import { getAllUsers } from "../../store/userSlice";
import Drawer from "../common/Drawer";
import Pagination from "../common/Pagination";
import ViewUser from "../users/ViewUser";
import AddUser from "./AddUser";
import RenewModal from "./RenewModal";
import ResetPassword from "./ResetPassword";
import UpdateUser from "./UpdateUser";

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

function Spinner({ className = "w-3 h-3" }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="space-y-1.5">
            <div className="h-2.5 w-24 bg-gray-200 rounded" />
            <div className="h-2 w-32 bg-gray-100 rounded" />
          </div>
        </div>
      </td>
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-2.5 w-16 bg-gray-200 rounded" />
        </td>
      ))}
      <td className="px-6 py-4">
        <div className="flex justify-center gap-1.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-6 h-6 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </td>
    </tr>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize
      ${getStatusBadge(status)}`}
    >
      {status}
    </span>
  );
}

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
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 400);
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
    updatingUserId,
    pagination = {},
  } = useSelector((state) => state.users);

  const { page = 1, totalPages = 1, total = 0, pageSize = 10 } = pagination;
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

  const handleDrawerClose = () => {
    setDrawer({ open: false, type: "", data: null });
  };

  const handleUpdateClose = () => {
    handleDrawerClose();
    dispatch(getAllUsers({ ...filters, search: debouncedSearch }));
  };

  return (
    <div className="w-full bg-white shadow-sm border border-gray-100">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-semibold text-gray-800 tracking-tight">
            Users
          </h2>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {loading ? "…" : total}
          </span>
        </div>
        <button
          className="px-3.5 py-2 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700
            transition-colors flex items-center gap-1.5 active:scale-95"
          onClick={() => setDrawer({ type: "create", open: true, data: null })}
        >
          <span className="text-base leading-none">+</span> Add user
        </button>
      </div>

      <div className="flex gap-1 px-6 pt-3 border-b border-gray-100">
        {tabs.map((tab, i) => {
          const key =
            tab.name.toLowerCase() === "all" ? "all" : tab.name.toLowerCase();
          const isActive = filters.status === key;
          return (
            <button
              key={i}
              onClick={() => handleStatusTab(key)}
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
            className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 bg-gray-50 text-gray-700
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
          />
          {loading && filters.search && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <Spinner className="w-3 h-3 text-indigo-400" />
            </span>
          )}
        </div>
        <select
          value={filters.module}
          onChange={(e) => handleFilterChange("module", e.target.value)}
          className="border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600
            focus:outline-none focus:ring-2 focus:ring-indigo-100"
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
          className="border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600
            focus:outline-none focus:ring-2 focus:ring-indigo-100"
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
              {[
                "Category",
                "Plan",
                "Modules",
                "Status",
                "Expiry",
                "Renewal",
              ].map((col) => (
                <th
                  key={col}
                  className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
              <th className="text-center px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading && [...Array(5)].map((_, i) => <SkeletonRow key={i} />)}

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
                        className={`w-8 h-8 rounded-full text-white flex items-center justify-center
                          uppercase text-xs font-semibold flex-shrink-0 ${getColorFromName(u?.name)}`}
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
                    {u.category ?? <span className="text-gray-300">—</span>}
                  </td>

                  <td className="px-6 py-3.5">
                    {u.plan?.name ? (
                      <span className="text-xs text-gray-500">
                        {u.plan.name}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>

                  <td className="px-6 py-3.5">
                    <div className="flex gap-1.5 flex-wrap">
                      {u.modules?.length ? (
                        u.modules.map((m, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 text-[11px]
                              font-medium bg-blue-50 text-blue-500"
                          >
                            {m}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-3.5">
                    <StatusBadge status={u.status} />
                  </td>

                  <td className="px-6 py-3.5">
                    {formatDate(u.expiry_date) ? (
                      <span className="text-xs font-medium text-red-400">
                        {formatDate(u.expiry_date)}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>

                  <td className="px-6 py-3.5">
                    {formatDate(u.renewal_date) ? (
                      <span className="text-xs text-gray-500">
                        {formatDate(u.renewal_date)}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">-</span>
                    )}
                  </td>

                  <td className="px-6 py-3.5">
                    <div className="flex justify-center items-center gap-1">
                      {[
                        {
                          icon: (
                            <EyeIcon className="w-4 h-4 text-gray-400 group-hover/btn:text-gray-600" />
                          ),
                          label: "View",
                          hoverBg: "hover:bg-gray-100",
                          onClick: () =>
                            setDrawer({ type: "view", open: true, data: u.id }),
                        },
                        {
                          icon: (
                            <PencilSquareIcon className="w-4 h-4 text-blue-400 group-hover/btn:text-blue-600" />
                          ),
                          label: "Edit",
                          hoverBg: "hover:bg-blue-50",
                          onClick: () =>
                            setDrawer({ type: "update", open: true, data: u }),
                        },
                        {
                          icon: (
                            <Lock className="w-4 h-4 text-amber-400 group-hover/btn:text-amber-600" />
                          ),
                          label: "Password",
                          hoverBg: "hover:bg-amber-50",
                          onClick: () =>
                            setDrawer({
                              type: "password",
                              open: true,
                              data: u.id,
                            }),
                        },
                        {
                          icon: (
                            <ArrowPathIcon className="w-4 h-4 text-emerald-400 group-hover/btn:text-emerald-600" />
                          ),
                          label: "Renew",
                          hoverBg: "hover:bg-emerald-50",
                          onClick: () =>
                            setDrawer({ type: "renew", open: true, data: u }),
                        },
                      ].map(({ icon, label, hoverBg, onClick }) => (
                        <button
                          key={label}
                          onClick={onClick}
                          className={`relative p-1.5 ${hoverBg} transition-colors group/btn`}
                          title={label}
                        >
                          {icon}
                          <span
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white
                              text-[10px] px-1.5 py-0.5 opacity-0 group-hover/btn:opacity-100 transition
                              whitespace-nowrap pointer-events-none z-50"
                          >
                            {label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 border-t border-gray-100 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-b-2xl">
        <div className="text-xs text-gray-400">
          {loading ? (
            <span className="flex items-center gap-1.5 text-gray-400">
              <Spinner className="w-3 h-3 text-gray-300" /> Loading…
            </span>
          ) : (
            <>
              Showing{" "}
              <span className="font-medium text-gray-600">
                {(page - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-gray-600">
                {Math.min(page * pageSize, total)}
              </span>{" "}
              of <span className="font-semibold text-gray-700">{total}</span>{" "}
              users
            </>
          )}
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
        onClose={handleDrawerClose}
        title={`${drawer.type === "create" ? "Add" : drawer.type} user`}
      >
        {drawer.type === "create" && <AddUser onClose={handleDrawerClose} />}
        {drawer.type === "view" && (
          <ViewUser data={drawer.data} onClose={handleDrawerClose} />
        )}
        {drawer.type === "renew" && (
          <RenewModal data={drawer.data} onClose={handleDrawerClose} />
        )}
        {drawer.type === "password" && (
          <ResetPassword userId={drawer.data} onClose={handleDrawerClose} />
        )}
        {drawer.type === "update" && (
          <UpdateUser data={drawer.data} onClose={handleUpdateClose} />
        )}
      </Drawer>
    </div>
  );
}

export default UserTable;
