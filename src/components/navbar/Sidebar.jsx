import { Bars3Icon } from "@heroicons/react/24/outline";
import {
  Boxes,
  LayoutDashboard,
  Users,
  Folder,
  Zap,
  CreditCard,
  Briefcase,
  ClipboardList,
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
      { name: "Modules List", path: "/modules/moduleslist", icon: Boxes },
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
    items: [{ name: "Audit Logs", path: "/auditlogs", icon: ClipboardList }],
  },
];

const navItemClass =
  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const linkClass = ({ isActive }) =>
    `${navItemClass} ${
      isActive
        ? "bg-indigo-50 text-indigo-600"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-60"
      } h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}
    >
      <div className="flex items-center justify-between px-3 h-15 border-b border-gray-200">
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

      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        {sidebarData.map((section) => (
          <SidebarSection
            key={section.title}
            title={section.title}
            items={section.items}
            collapsed={collapsed}
            linkClass={linkClass}
          />
        ))}
      </div>
    </aside>
  );
}

function NavItem({ to, icon: Icon, label, collapsed, linkClass }) {
  return (
    <NavLink to={to} className={linkClass}>
      <Icon size={18} />
      {!collapsed && label}
    </NavLink>
  );
}

function SidebarSection({ title, items, collapsed, linkClass }) {
  return (
    <div>
      {!collapsed && (
        <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase">
          {title}
        </p>
      )}

      <div className="space-y-1">
        {items.map((item) => (
          <NavItem
            key={item.path}
            to={item.path}
            icon={item.icon}
            label={item.name}
            collapsed={collapsed}
            linkClass={linkClass}
          />
        ))}
      </div>
    </div>
  );
}
