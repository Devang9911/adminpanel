import { useState } from "react";
import { Clock } from "lucide-react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { ChangeBadge, VersionBadge, EditBtn, DeleteBtn } from "./constants";

export default function ChangelogContent({ entries, whatsNewIds = new Set(), onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(new Set([entries[0]?.id]));

  const toggle = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-gray-300">
        <Clock className="w-10 h-10" />
        <p className="text-xs font-medium text-gray-400">No changelog entries yet</p>
        <p className="text-xs text-gray-300">Click "+ New Release" to publish the first one.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {entries.map((entry, idx) => {
        const isOpen = expanded.has(entry.id);
        const isLatest = idx === 0;
        const isPromoted = whatsNewIds.has(entry.id);

        return (
          <div key={entry.id}>
            <div className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50/60 transition-colors group">
              <button
                onClick={() => toggle(entry.id)}
                className="flex-1 flex items-start gap-4 text-left min-w-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-mono font-semibold text-gray-900 text-xs">
                      {entry.version}
                    </span>
                    <VersionBadge type={entry.type} />
                    {isLatest && (
                      <span className="text-xs bg-indigo-600 text-white px-2.5 py-0.5 rounded-full font-medium">
                        Latest
                      </span>
                    )}
                    {isPromoted && (
                      <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium">
                        ✦ What's New
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-700 truncate">{entry.title}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{entry.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                  <span className="text-xs text-gray-400 hidden sm:inline">
                    {entry.changes.length} change{entry.changes.length !== 1 ? "s" : ""}
                  </span>
                  {isOpen ? (
                    <ChevronUpIcon className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>

              <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <EditBtn onClick={() => onEdit(entry)} />
                <DeleteBtn onClick={() => onDelete(entry.id)} />
              </div>
            </div>

            {isOpen && (
              <div className="px-6 pb-5 bg-gray-50/50 border-t border-gray-100">
                <ul className="pt-4 space-y-3">
                  {entry.changes.map((c) => (
                    <li key={c.id} className="flex items-start gap-3">
                      <ChangeBadge type={c.type} />
                      <span className="text-xs text-gray-600 leading-relaxed">{c.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}