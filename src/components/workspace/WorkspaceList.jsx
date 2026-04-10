import { EyeIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllWorkspace } from "../../store/workspaceSlice";
import Drawer from "../common/Drawer";
import Loader from "../common/Loader";
import Pagination from "../common/Pagination";
import AddWorkspaceForm from "./AddWorkspaceForm";

function formatDate(dateString, locale = "en-IN") {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const tabs = [{ name: "All" }, { name: "Active" }, { name: "Inactive" }];

const colors = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-pink-500",
];

const getColorFromName = (name = "") => {
  const index =
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

function WorkspaceList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { list, loadingList, page, totalPages, total, pageSize } = useSelector(
    (state) => state.workspace,
  );

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    page: 1,
    pageSize: 10,
  });
  const [drawer, setDrawer] = useState({ open: false, type: "", data: null });
  const [sorting, setSorting] = useState({ field: "OwnerName", order: "asc" });

  const handleSorting = (field) => {
    setSorting((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  useEffect(() => {
    dispatch(getAllWorkspace(filters));
  }, [dispatch, filters]);

  const handleSearch = (e) =>
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  const handleTab = (status) =>
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  const handlePageChange = (newPage) =>
    setFilters((prev) => ({ ...prev, page: newPage }));

  const sortData = [...list].sort((a, b) => {
    const valueA = a[sorting.field] || "";
    const valueB = b[sorting.field] || "";
    if (typeof valueA === "string")
      return sorting.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    return sorting.order === "asc" ? valueA - valueB : valueB - valueA;
  });

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-semibold text-gray-800 tracking-tight">
            Workspaces
          </h2>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {total ?? list.length}
          </span>
        </div>
        <button
          onClick={() =>
            setDrawer({ open: true, type: "addWorkspace", data: null })
          }
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <span className="text-base leading-none">+</span> Add workspace
        </button>
      </div>

      <div className="flex gap-1 px-6 pt-3 border-b border-gray-100">
        {tabs.map((tab, i) => {
          const isActive = filters.status === tab.name.toLowerCase();
          return (
            <button
              key={i}
              onClick={() =>
                handleTab(
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

      <div className="px-6 py-3 border-b border-gray-100">
        <div className="relative">
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
            placeholder="Search workspace, owner…"
            className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/70">
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Workspace
              </th>
              <th
                className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSorting("OwnerName")}
              >
                <div className="flex items-center gap-1">
                  Owner
                  {sorting.field === "OwnerName" ? (
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
                Members
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th className="text-center px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loadingList && (
              <tr>
                <td colSpan={5}>
                  <Loader />
                </td>
              </tr>
            )}

            {!loadingList && list?.length === 0 && (
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
                    No workspaces found
                  </div>
                </td>
              </tr>
            )}

            {!loadingList &&
              sortData?.map((w) => (
                <tr
                  key={w.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-semibold uppercase flex-shrink-0 ${getColorFromName(w.group_name)}`}
                      >
                        {w.group_name?.[0]}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-gray-800 capitalize">
                          {w.group_name}
                        </div>
                        <div className="text-[11px] text-gray-300 font-mono mt-0.5">
                          #{w.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-3.5">
                    <div className="text-xs font-medium text-gray-700 capitalize">
                      {w.OwnerName}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {w.OwnerEmail}
                    </div>
                  </td>

                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <svg
                        className="w-3 h-3 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13 13v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1" />
                        <circle cx="8" cy="5" r="2.5" />
                      </svg>
                      {w.MemberCount}
                    </span>
                  </td>

                  <td className="px-6 py-3.5 text-xs text-gray-400">
                    {formatDate(w.created_at)}
                  </td>

                  <td className="px-6 py-3.5">
                    <div className="flex justify-center">
                      <button
                        onClick={() => navigate(`/workspaces/details/${w.id}`)}
                        className="relative p-1.5 rounded-lg hover:bg-gray-100 transition-colors group/btn"
                      >
                        <EyeIcon className="w-4 h-4 text-gray-400 group-hover/btn:text-gray-600" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                          Details
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
            {(page - 1) * pageSize + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium text-gray-600">
            {Math.min(page * pageSize, total)}
          </span>{" "}
          of <span className="font-semibold text-gray-700">{total}</span>{" "}
          workspaces
        </div>
        <Pagination
          page={filters.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <Drawer
        title="Create new workspace"
        open={drawer.open}
        onClose={() => setDrawer({ open: false })}
      >
        {drawer.type === "addWorkspace" && <AddWorkspaceForm />}
      </Drawer>
    </div>
  );
}

export default WorkspaceList;
