import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetailById } from "../../store/userSlice";

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
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  return colors[index];
};
const getStatusStyle = (status) => {
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
function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
function MaskedPassword({ password }) {
  const [visible, setVisible] = useState(false);
  if (!password)
    return <span className="text-xs font-medium text-gray-300">-</span>;
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-medium text-gray-700 font-mono tracking-wide">
        {visible ? password : "••••••••"}
      </span>
      <button
        onClick={() => setVisible((v) => !v)}
        className="text-gray-300 hover:text-gray-500 transition-colors"
      >
        {visible ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default function ViewUser({ data }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) dispatch(getUserDetailById(data));
  }, [data, dispatch]);

  const { selectedUser, selectedUserLoading } = useSelector(
    (state) => state.users,
  );

  const user = selectedUser
    ? {
        id: selectedUser.profile?.id,
        name: selectedUser.profile?.user_name,
        email: selectedUser.profile?.user_email,
        phone: selectedUser.profile?.user_phone_number,
        status: selectedUser.profile?.is_active ? "active" : "inactive",
        websocket_id: selectedUser.profile?.websocket_id,
        websocket_password: selectedUser.profile?.websocket_password,
        subscriptions: selectedUser.subscriptions || [], // ← all subscriptions
        workspaces: selectedUser.workspaces || [],
      }
    : null;

  if (selectedUserLoading || !user) {
    return (
      <div className="animate-pulse flex flex-col gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="h-3 w-32 bg-gray-200 mb-2" />
            <div className="h-2 w-48 bg-gray-200" />
          </div>
        </div>
        <div className="h-16 bg-gray-200" />
        <div className="h-24 bg-gray-200" />
        <div className="h-20 bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3.5 p-4 bg-gray-50 border border-gray-100">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold text-white uppercase flex-shrink-0 ${getColorFromName(user.name)}`}
        >
          {user.name?.[0] || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 capitalize truncate">
            {user.name || "-"}
          </p>
          <p className="text-xs text-gray-400 truncate mt-0.5">
            {user.email || "-"}
          </p>
          {user.phone && (
            <p className="text-xs text-gray-400 mt-0.5">{user.phone}</p>
          )}
          <p className="text-xs text-gray-400">{user.id || "-"}</p>
        </div>
        <span
          className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium capitalize flex-shrink-0 ${getStatusStyle(user.status)}`}
        >
          {user.status}
        </span>
      </div>

      {/* Subscriptions — one card per subscription */}
      <div className="border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Subscriptions
          </span>
          <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {user.subscriptions.length}
          </span>
        </div>

        {user.subscriptions.length === 0 ? (
          <div className="px-4 py-5 text-center text-xs text-gray-300">
            No subscriptions found
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {user.subscriptions.map((sub) => {
              const isExpired = new Date(sub.expires_at) < new Date();
              const subStatus = !sub.is_active
                ? "inactive"
                : isExpired
                  ? "expired"
                  : "active";
              return (
                <div key={sub.id} className="px-4 py-3 flex flex-col gap-2">
                  {/* Plan name + status badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-gray-700">
                      {sub.plan_name}
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${getStatusStyle(subStatus)}`}
                    >
                      {subStatus}
                    </span>
                  </div>
                  {/* Dates */}
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>
                      Start:{" "}
                      <span className="text-gray-600 font-medium">
                        {formatDate(sub.start_date)}
                      </span>
                    </span>
                    <span>
                      Expires:{" "}
                      <span
                        className={`font-medium ${isExpired ? "text-red-400" : "text-gray-600"}`}
                      >
                        {formatDate(sub.expires_at)}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* WebSocket */}
      <div className="border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            WebSocket
          </span>
        </div>
        <div className="px-4 py-1 bg-white">
          <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
            <span className="text-xs text-gray-400">ID</span>
            <span className="text-xs font-medium text-gray-700 font-mono tracking-wide">
              {user.websocket_id || "-"}
            </span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-xs text-gray-400">Password</span>
            <MaskedPassword password={user.websocket_password} />
          </div>
        </div>
      </div>

      {/* Workspaces */}
      {user.workspaces?.length > 0 && (
        <div className="border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Workspaces
            </span>
            <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {user.workspaces.length}
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {user.workspaces.map((ws) => (
              <div
                key={ws.GroupId}
                className="px-4 py-2.5 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-medium text-gray-700">
                    {ws.group_name}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Joined {formatDate(ws.joined_at)}
                  </p>
                </div>
                <span className="text-[11px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full font-medium capitalize">
                  {ws.user_role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
