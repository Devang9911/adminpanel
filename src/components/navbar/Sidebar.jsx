import {
  AdjustmentsHorizontalIcon,
  Bars3Icon,
  BuildingOffice2Icon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  CubeIcon,
  HomeIcon,
  TagIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/", icon: HomeIcon },
  { name: "Users", path: "/users", icon: UsersIcon },
  { name: "Workspaces", path: "/workspaces", icon: BuildingOffice2Icon },
  { name: "Audit Logs", path: "/auditlogs", icon: ClipboardDocumentListIcon },

  { name: "Modules", path: "/modules/moduleslist", icon: CubeIcon },
  { name: "Category", path: "/modules/categories", icon: TagIcon },
  { name: "Features", path: "/modules/features", icon: AdjustmentsHorizontalIcon },
  { name: "Plans", path: "/modules/plans", icon: CreditCardIcon },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } h-full bg-white border-r border-gray-300 flex flex-col transition-all duration-300`}
    >
      <div className="flex items-center justify-between px-4 h-15 border-b border-gray-300">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded font-bold">
              A
            </div>
            <span className="font-semibold text-gray-800">AdminPanel</span>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded hover:bg-gray-100"
        >
          <Bars3Icon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {menu.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <item.icon className="w-5 h-5" />

            {collapsed && (
              <span className="absolute left-12 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                {item.name}
              </span>
            )}

            {!collapsed && item.name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
