import { EyeIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllWorkspace } from "../../store/workspaceSlice";
import Loader from "../common/Loader";
import Pagination from "../common/Pagination";
import WorkspaceDrawer from "./WorkspaceDrawer";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

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
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
];

const getColorFromName = (name = "") => {
  const index =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
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

  const [drawer, setDrawer] = useState({
    open: false,
    type: "add",
    data: null,
  });

  const [sorting, setSorting] = useState({
    field: "OwnerName",
    order: "asc",
  });

  const handleSorting = (field) => {
    setSorting((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  useEffect(() => {
    dispatch(getAllWorkspace(filters));
  }, [dispatch, filters]);

  const openDetails = (id) => {
    navigate(`/workspaces/details/${id}`);
  };

  const handleSearch = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }));
  };

  const handleTab = (status) => {
    setFilters((prev) => ({
      ...prev,
      status,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const sortData = [...list].sort((a, b) => {
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
          Workspaces
        </h2>

        <button
          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
          onClick={() => {
            setDrawer({ open: true, type: "add", data: null });
          }}
        >
          + Add Workspace
        </button>
      </div>

      <div className="flex gap-6 px-5 pt-4 border-b border-gray-300">
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

      <div className="flex gap-3 py-3 px-5 border-b border-gray-300">
        <input
          value={filters.search}
          onChange={handleSearch}
          type="text"
          placeholder="Search workspace, owner..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-6 py-3 ">Workspace</th>
              <th
                className="text-left px-6 py-3 flex items-center gap-2 cursor-pointer"
                onClick={() => handleSorting("OwnerName")}
              >
                Owner
                {sorting.field === "OwnerName" &&
                  (sorting.order === "asc" ? (
                    <ChevronUpIcon className="w-4 h-4 inline ml-1" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 inline ml-1" />
                  ))}
              </th>
              <th className="text-left px-6 py-3">Members</th>
              <th className="text-left px-6 py-3">Created</th>
              <th className="text-center px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loadingList && (
              <tr>
                <td colSpan={5}>
                  <Loader />
                </td>
              </tr>
            )}

            {!loadingList && list?.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No workspaces found
                </td>
              </tr>
            )}

            {!loadingList &&
              sortData?.map((w) => (
                <tr key={w.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-9 h-9 rounded-full text-white flex items-center justify-center font-semibold ${getColorFromName(
                          w.group_name,
                        )}`}
                      >
                        {w.group_name?.[0]}
                      </span>

                      <div>
                        <div className="font-medium capitalize">
                          {w.group_name}
                        </div>
                        <div className="text-xs text-gray-500">ID: {w.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm font-medium capitalize">
                      {w.OwnerName}
                    </div>
                    <div className="text-xs text-gray-500">{w.OwnerEmail}</div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">{w.MemberCount}</td>

                  <td className="px-6 py-4 text-gray-500">
                    {formatDate(w.created_at)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => openDetails(w.id)}
                        className="group relative p-2 rounded-xl hover:bg-gray-300"
                      >
                        <EyeIcon className="w-5 h-5 text-gray-600" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
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

      <div className="px-4 py-1.5 border-t bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-b-xl">
        <div className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-700">
            {(page - 1) * pageSize + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium text-gray-700">
            {Math.min(page * pageSize, total)}
          </span>{" "}
          of <span className="font-semibold text-gray-800">{total}</span> users
        </div>

        <div className="flex justify-end">
          <Pagination
            page={filters.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <WorkspaceDrawer
        open={drawer.open}
        type={drawer.type}
        data={drawer.data}
        onClose={() => setDrawer({ open: false })}
      />
    </div>
  );
}

export default WorkspaceList;
