import { Bars3Icon } from "@heroicons/react/24/outline";
import {
  Boxes,
  Briefcase,
  ClipboardList,
  CreditCard,
  Folder,
  LayoutDashboard,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const sidebarData = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", path: "/", icon: LayoutDashboard },
      { name: "Users", path: "/users", icon: Users },
    ],
  },
  {
    title: "Modules",
    items: [
      { name: "Modules list", path: "/modules/moduleslist", icon: Boxes },
      { name: "Category", path: "/modules/categories", icon: Folder },
      { name: "Features", path: "/modules/features", icon: Zap },
      { name: "Plans", path: "/modules/plans", icon: CreditCard },
    ],
  },
  {
    title: "Workspace",
    items: [{ name: "Workspaces", path: "/workspaces", icon: Briefcase }],
  },
  {
    title: "System",
    items: [{ name: "Audit logs", path: "/auditlogs", icon: ClipboardList }],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
      isActive
        ? "bg-indigo-50 text-indigo-600"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    }`;

  return (
    <aside
      className={`${collapsed ? "w-14" : "w-56"} h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 flex-shrink-0`}
    >
      <div className="flex items-center justify-between px-3 h-14 border-b border-gray-100">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 text-white flex items-center justify-center rounded-lg text-xs font-bold">
              A
            </div>
            <span className="text-sm font-semibold text-gray-800">
              AdminPanel
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${collapsed ? "mx-auto" : ""}`}
        >
          <Bars3Icon className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-5">
        {sidebarData.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold text-gray-300 uppercase tracking-wider">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={linkClass}
                  title={collapsed ? item.name : ""}
                >
                  <item.icon size={15} className="flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
