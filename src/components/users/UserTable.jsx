import {
  ArrowPathIcon,
  EnvelopeIcon,
  EyeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../store/userSlice";
import Drawer from "../common/Drawer";
import Loader from "../common/Loader";
import Pagination from "../common/Pagination";
import ViewUser from "../users/ViewUser";
import CreateUserForm from "./CreateUserForm";
import RenewModal from "./RenewModal";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { getAllPlans } from "../../store/planSlice";
import { getProducts } from "../../store/productSlice";

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
  "bg-red-500",
  "bg-pink-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-green-500",
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
      return "bg-green-100 text-green-700";
    case "inactive":
      return "bg-gray-200 text-gray-600";
    case "expired":
      return "bg-red-200 text-red-600";
    default:
      return "bg-gray-100 text-gray-500";
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
    dispatch(
      getAllUsers({
        ...filters,
        search: debouncedSearch,
      }),
    );
  }, [
    filters.page,
    filters.status,
    filters.module,
    filters.plan,
    debouncedSearch,
    dispatch,
  ]);

  const [sorting, setSorting] = useState({
    field: "name",
    order: "asc",
  });

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
    dispatch(getAllPlans());
    dispatch(getProducts());
  }, [dispatch]);

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleSearch = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleStatusTab = (status) => {
    setFilters((prev) => ({
      ...prev,
      status,
      page: 1,
    }));
  };

  const sortData = [...users].sort((a, b) => {
    const valueA = a[sorting.field] || "";
    const valueB = b[sorting.field] || "";

    if (typeof valueA === "string") {
      return sorting.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return sorting.order === "asc" ? valueA - valueB : valueB - valueA;
  });

  return (
    <div className="w-full bg-white rounded-xl shadow">
      <div className="flex items-center justify-between py-3 px-5 border-b border-gray-300">
        <h2 className="text-2xl uppercase tracking-wider font-semibold">
          Users{" "}
          <span className="text-sm font-normal">{`(${users.length})`}</span>
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setDrawer({ open: true, type: "add", data: null })}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
          >
            + Add User
          </button>
        </div>
      </div>

      <div className="flex gap-6 px-5 pt-4 border-b border-gray-300">
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
          value={filters.search}
          onChange={handleSearch}
          type="text"
          placeholder="Search name, email..."
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
          value={filters.plan}
          onChange={(e) => handleFilterChange("plan", e.target.value)}
          className="border rounded-xl border-gray-300 px-3 py-2 text-sm"
        >
          <option value="all">All Plans</option>
          {plans.map((p) => (
            <option key={p.planId} value={p.planName}>
              {p.planName}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th
                className="text-left px-6 py-3 cursor-pointer flex items-center gap-2"
                onClick={() => handleSorting("name")}
              >
                User
                {sorting.order === "asc" ? (
                  <ChevronUpIcon className="w-4 h-4" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4" />
                )}
              </th>
              <th className="text-left px-6 py-3">Category</th>
              <th className="text-left px-6 py-3">Plan</th>
              <th className="text-left px-6 py-3">Modules</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Expiry</th>
              <th className="text-left px-6 py-3">Renewal</th>
              <th className="text-center px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={8}>
                  <Loader />
                </td>
              </tr>
            )}

            {!loading && users?.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-400">
                  No users found
                </td>
              </tr>
            )}

            {!loading &&
              sortData?.map((u) => (
                <tr key={u.id} className={`border-t hover:bg-gray-50 `}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-9 h-9 rounded-full text-white flex items-center justify-center uppercase text-sm font-semibold ${getColorFromName(
                          u?.name,
                        )}`}
                      >
                        {u?.name?.[0] || "U"}
                      </span>

                      <div>
                        <div className="font-medium capitalize">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">{u.category}</td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-600">
                      {u.plan?.name || "-"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      {u.modules?.length ? (
                        u.modules.map((m, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-xl"
                          >
                            {m}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${getStatusBadge(
                        u.status,
                      )}`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-red-500 font-medium">
                    {formatDate(u.expiry_date) || "-"}
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {formatDate(u.renewal_date) || "-"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() =>
                          setDrawer({ type: "view", open: true, data: u })
                        }
                        className="hover:bg-gray-300 p-2 rounded-xl group relative"
                      >
                        <EyeIcon className="w-5 h-5 text-gray-600 cursor-pointer " />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                          View
                        </span>
                      </button>

                      <button
                        onClick={() =>
                          setDrawer({ type: "edit", open: true, data: u })
                        }
                        className="group relative hover:bg-blue-100 p-2 rounded-xl"
                      >
                        <PencilSquareIcon className="w-5 h-5 text-blue-600 cursor-pointer" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                          Edit
                        </span>
                      </button>

                      <button className="group relative hover:bg-yellow-100 p-2 rounded-xl">
                        <EnvelopeIcon className="w-5 h-5 text-yellow-600 cursor-pointer" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                          Mail
                        </span>
                      </button>

                      <button
                        className="group relative hover:bg-green-100 p-2 rounded-xl"
                        onClick={() =>
                          setDrawer({ type: "renew", open: true, data: u })
                        }
                      >
                        <ArrowPathIcon className="w-5 h-5 text-green-600 cursor-pointer" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
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

      <div className="px-4 py-1.5 border-t bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-b-xl">
        <div className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-700">
            {(page - 1) * 10 + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium text-gray-700">
            {Math.min(page * 10, total)}
          </span>{" "}
          of <span className="font-semibold text-gray-800">{total}</span> users
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
        {drawer.type === "add" && (
          <CreateUserForm
            onClose={() => setDrawer({ open: false, type: "", data: null })}
          />
        )}
        {drawer.type === "edit" && (
          <CreateUserForm
            data={drawer.data}
            onClose={() => setDrawer({ open: false, type: "", data: null })}
          />
        )}
      </Drawer>
    </div>
  );
}

export default UserTable;
