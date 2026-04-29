import { Sparkles, Zap, CheckCircle2 } from "lucide-react";
import { EditBtn, DeleteBtn } from "./constants";

export default function WhatsNewContent({ features, onEdit, onDelete }) {
  if (features.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-gray-300">
        <Sparkles className="w-10 h-10" />
        <p className="text-xs font-medium text-gray-400">
          No featured items yet
        </p>
        <p className="text-xs text-center px-8 text-gray-300">
          Use the "+ What's New" button to highlight a release as a featured
          card.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {features.map((feature) => (
        <div
          key={feature.id}
          className="px-6 py-5 hover:bg-gray-50/60 transition-colors group"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <Zap size={18} className="text-indigo-500" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-emerald-500" />
                  New Feature
                </span>
                <span className="text-xs font-mono text-gray-400">
                  {feature.version}
                </span>
                <span className="text-gray-300 text-sm">·</span>
                <span className="text-xs text-gray-400">{feature.date}</span>
              </div>

              <p className="text-xs font-semibold text-gray-800 mb-1.5 leading-snug">
                {feature.title}
              </p>

              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                {feature.description}
              </p>

              {feature.highlights.length > 0 && (
                <ul className="space-y-1.5">
                  {feature.highlights.map((hl, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-gray-500"
                    >
                      <CheckCircle2
                        size={13}
                        className="text-emerald-500 mt-0.5 flex-shrink-0"
                      />
                      {hl}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <EditBtn onClick={() => onEdit(feature)} />
              <DeleteBtn onClick={() => onDelete(feature.id)} title="Remove" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
