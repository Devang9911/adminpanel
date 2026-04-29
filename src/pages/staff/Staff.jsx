import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllStaff } from "../../store/staffSlice";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { EyeIcon } from "lucide-react";
import Drawer from "../../components/common/Drawer";
import AddUser from "../../components/users/AddUser";
import StaffForm from "../../components/common/staff/AddStaff";

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

const getRoleBadge = (role) => {
  switch (role?.toLowerCase()) {
    case "super_admin":
      return "bg-purple-50 text-purple-700 ring-1 ring-purple-200";
    case "support":
      return "bg-blue-50 text-blue-600 ring-1 ring-blue-200";
    case "admin":
      return "bg-yellow-50 text-yellow-600 ring-1 ring-yellow-200";
    default:
      return "bg-gray-100 text-gray-400 ring-1 ring-gray-200";
  }
};

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="space-y-1.5">
            <div className="h-2.5 w-24 bg-gray-200" />
            <div className="h-2 w-32 bg-gray-100" />
          </div>
        </div>
      </td>
      {[...Array(2)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-2.5 w-16 bg-gray-200" />
        </td>
      ))}
      <td className="px-6 py-4">
        <div className="flex justify-center gap-1.5">
          <div className="w-6 h-6 bg-gray-100" />
        </div>
      </td>
    </tr>
  );
}

function Staff() {
  const dispatch = useDispatch();
  const [drawer, setDrawer] = useState({
    open: false,
    type: "add",
    data: null,
  });

  useEffect(() => {
    dispatch(getAllStaff());
  }, [dispatch]);

  const { staff = [], loading } = useSelector((state) => state.staff);

  return (
    <div className="w-full bg-white shadow-sm border border-gray-100">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-semibold text-gray-800 tracking-tight">
            Staff
          </h2>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {loading ? "..." : staff.length}
          </span>
        </div>

        <button
          className="px-3.5 py-2 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700
          transition-colors flex items-center gap-1.5 active:scale-95"
          onClick={() => setDrawer({ type: "create", open: true, data: null })}
        >
          <span className="text-base leading-none">+</span> Add staff
        </button>
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
            placeholder="Search name, email…"
            className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 bg-gray-50 text-gray-700
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/70">
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase">
                Staff
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase">
                Status
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase">
                Role
              </th>
              <th className="text-center px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading && [...Array(5)].map((_, i) => <SkeletonRow key={i} />)}

            {!loading && staff.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-14 text-gray-300">
                  No staff found
                </td>
              </tr>
            )}

            {!loading &&
              staff.map((s) => {
                const status =
                  s.is_active === true ||
                  s.is_active === 1 ||
                  s.is_active === "1"
                    ? "active"
                    : "inactive";

                return (
                  <tr
                    key={s.id}
                    className="hover:bg-gray-50/60 transition-colors group"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-full text-white flex items-center justify-center
                          text-xs font-semibold ${getColorFromName(
                            s?.user_name,
                          )}`}
                        >
                          {s?.user_name?.[0] || "U"}
                        </span>

                        <div>
                          <div className="text-xs font-semibold text-gray-800">
                            {s.user_name}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            {s.user_email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-3.5">
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize
                        ${getStatusBadge(status)}`}
                      >
                        {status}
                      </div>
                    </td>

                    <td className="px-6 py-3.5">
                      {s.role ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize
      ${getRoleBadge(s.role)}`}
                        >
                          {s.role}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>

                    <td className="px-6 py-3.5">
                      <div className="flex justify-center gap-1">
                        <button
                          className="p-1.5  hover:bg-gray-100"
                          onClick={() => console.log(s.id)}
                        >
                          <EyeIcon className="w-4 h-4 text-gray-400" />
                        </button>

                        <button
                          className="p-1.5 hover:bg-blue-50"
                          onClick={() =>
                            setDrawer({ type: "edit", open: true, data: s })
                          }
                        >
                          <PencilSquareIcon className="w-4 h-4 text-blue-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <Drawer
          open={drawer.open}
          onClose={() => setDrawer({ open: false, type: "create", data: null })}
          title={`${drawer.type === "create" ? "Add" : "Edit"} staff`}
        >
          {drawer.type === "create" && (
            <StaffForm
              onClose={() => setDrawer({ open: false, type: "", data: null })}
            />
          )}
          {drawer.type === "edit" && (
            <StaffForm
              onClose={() => setDrawer({ open: false, type: "", data: null })}
              editData={drawer.data}
            />
          )}
        </Drawer>
      </div>
    </div>
  );
}

export default Staff;
