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
      { name: "Staff", path: "/staff", icon: Users },
    ],
  },
  {
    title: "Modules",
    items: [
      { name: "Modules", path: "/modules/moduleslist", icon: Boxes },
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
  {
    title: "Change Logs",
    items: [{ name: "Sheets Log", path: "/sheetslog", icon: ClipboardList }],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "bg-indigo-50 text-indigo-600"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    }`;

  return (
    <aside
      className={`${
        collapsed ? "w-[58px]" : "w-[220px]"
      } h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 flex-shrink-0`}
    >
      <div className="flex items-center justify-center px-4 h-20 border-b border-gray-100 flex-shrink-0">
        {!collapsed && (
          <img
            src="/tdLogo.png"
            alt="TrueData"
            className="h-14 w-auto object-contain cursor-pointer"
            onClick={() => setCollapsed(!collapsed)}
          />
        )}
        {collapsed && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors text-gray-400 ${
              collapsed ? "mx-auto" : ""
            }`}
          >
            <Bars3Icon className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {sidebarData.map((section) => (
          <div key={section.title} className="mb-2">
            {!collapsed && (
              <p className="px-3 pt-3 pb-1 text-[10px] font-semibold text-gray-300 uppercase tracking-widest">
                {section.title}
              </p>
            )}
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
        ))}
      </div>
    </aside>
  );
}
