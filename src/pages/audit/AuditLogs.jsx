import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuditLogs } from "../../store/auditLogSlice";
import Loader from "../../components/common/Loader";

function formatDate(dateString, locale = "en-IN") {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AuditLogs() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.auditLogs);

  useEffect(() => {
    dispatch(getAuditLogs({ limit: 50 }));
  }, [dispatch]);

  return (
    <div className="w-full bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800 tracking-tight">
          Audit Logs
        </h2>
        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {list.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/70">
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase">
                Actor
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase">
                Action
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase">
                Target
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase">
                Details
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase">
                IP
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase">
                Time
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading && (
              <tr>
                <td colSpan={6}>
                  <Loader />
                </td>
              </tr>
            )}

            {!loading && list.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 text-gray-300 text-xs"
                >
                  No logs found
                </td>
              </tr>
            )}

            {!loading &&
              list.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/60">
                  <td className="px-6 py-3 text-xs font-medium text-gray-700">
                    {log.ActorName}
                  </td>

                  <td className="px-6 py-3 text-xs text-indigo-600 font-semibold">
                    {log.action_type}
                  </td>

                  <td className="px-6 py-3 text-xs text-gray-500">
                    {log.target_table}
                  </td>

                  <td className="px-6 py-3 text-xs text-gray-400">
                    {log.new_value}
                  </td>

                  <td className="px-6 py-3 text-xs text-gray-400">
                    {log.ip_address}
                  </td>

                  <td className="px-6 py-3 text-xs text-gray-400">
                    {formatDate(log.created_at)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditLogs;
