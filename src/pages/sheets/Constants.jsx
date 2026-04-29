export const CHANGE_TYPE_CONFIG = {
  feature: {
    label: "New",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  improvement: {
    label: "Improved",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  fix: {
    label: "Fixed",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  security: {
    label: "Security",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  breaking: {
    label: "Breaking",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

export const VERSION_TYPE_CONFIG = {
  major: {
    label: "Major",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  minor: {
    label: "Minor",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  patch: {
    label: "Patch",
    color: "text-gray-500",
    bg: "bg-gray-100",
    border: "border-gray-200",
  },
};

export const INITIAL_CHANGELOG = [
  {
    id: "cl-1",
    version: "v2.4.1",
    date: "July 2025",
    type: "patch",
    title: "Bug Fixes & Stability",
    changes: [
      { id: "c1", type: "fix", text: "Fixed bar stream disconnect on sheet tab switch" },
      { id: "c2", type: "fix", text: "Resolved LTQ formula returning stale values after market close" },
      { id: "c3", type: "improvement", text: "Improved websocket reconnection logic" },
    ],
  },
  {
    id: "cl-2",
    version: "v2.4.0",
    date: "July 2025",
    type: "major",
    title: "Bar Streaming — Live Candlestick Data",
    changes: [
      { id: "c4", type: "feature", text: "Bar Streaming: stream live OHLC candles into your spreadsheet" },
      { id: "c5", type: "feature", text: "Built-in candlestick chart rendered inline alongside streaming data" },
      { id: "c6", type: "improvement", text: "Toolbar redesigned to accommodate Bar Streaming panel" },
    ],
  },
  {
    id: "cl-3",
    version: "v2.3.0",
    date: "June 2025",
    type: "minor",
    title: "Price Flash & UI Improvements",
    changes: [
      { id: "c7", type: "feature", text: "Price Flash: cells flash green/red on tick price changes" },
      { id: "c8", type: "fix", text: "Fixed sidebar not scrolling to active section on mobile" },
    ],
  },
];

export const INITIAL_WHATS_NEW = [
  {
    id: "wn-1",
    changelog_id: "cl-2",
    title: "Bar Streaming — Live OHLC Candlestick Data",
    date: "July 2025",
    version: "v2.4.0",
    description:
      "Stream live OHLC candlestick bars directly into your spreadsheet. Choose any symbol, set a start date, pick your interval, and watch candles build in real time.",
    highlights: [
      "Historical bar replay from any past date, then seamless live stream",
      "Supports intervals: 1s, 1m, 5m, 15m, 30m, 1h, 1d",
      "Works for NSE, BSE, MCX, and F&O symbols",
    ],
  },
  {
    id: "wn-2",
    changelog_id: "cl-3",
    title: "Price Flash — Visual Tick Indicators",
    date: "June 2025",
    version: "v2.3.0",
    description:
      "Cells now flash green or red on every price tick — giving you instant visual feedback on price movement direction.",
    highlights: [
      "Green flash on price increase, red flash on decrease",
      "Enable per-column via right-click → Price Flash",
      "Zero performance impact — uses CSS transitions only",
    ],
  },
];

export const uid = () => Math.random().toString(36).slice(2, 9);

export const emptyChangelogForm = () => ({
  version: "",
  type: "",
  date: "",
  title: "",
  changes: [{ id: uid(), type: "feature", text: "" }],
});

export const emptyWhatsNewForm = () => ({
  changelog_id: "",
  title: "",
  description: "",
  highlights: [{ id: uid(), text: "" }],
});

export const inputCls =
  "w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg bg-white text-gray-800 " +
  "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition";

export const selectCls =
  "w-full border border-gray-200 rounded-lg bg-white px-3 py-2.5 text-xs text-gray-700 " +
  "focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition";

export const labelCls =
  "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2";

export const DATE_OPTIONS = [
  ...["January","February","March","April","May","June","July","August","September","October","November","December"].map((m) => `${m} 2025`),
  ...["January","February","March","April","May","June"].map((m) => `${m} 2026`),
];

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";

export function ChangeBadge({ type }) {
  const cfg = CHANGE_TYPE_CONFIG[type] || CHANGE_TYPE_CONFIG.improvement;
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md border whitespace-nowrap ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {cfg.label}
    </span>
  );
}

export function VersionBadge({ type }) {
  const cfg = VERSION_TYPE_CONFIG[type] || VERSION_TYPE_CONFIG.patch;
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
      {cfg.label}
    </span>
  );
}

export function ActionBtn({ onClick, title, icon, hoverCls = "hover:bg-gray-100" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`relative p-2 rounded-lg ${hoverCls} transition-colors group/btn`}
    >
      {icon}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
        {title}
      </span>
    </button>
  );
}

export function EditBtn({ onClick }) {
  return (
    <ActionBtn
      onClick={onClick}
      title="Edit"
      hoverCls="hover:bg-blue-50"
      icon={<PencilSquareIcon className="w-4 h-4 text-blue-400 group-hover/btn:text-blue-600" />}
    />
  );
}

export function DeleteBtn({ onClick, title = "Delete" }) {
  return (
    <ActionBtn
      onClick={onClick}
      title={title}
      hoverCls="hover:bg-red-50"
      icon={<TrashIcon className="w-4 h-4 text-red-400 group-hover/btn:text-red-600" />}
    />
  );
}

export const CLOSED_DRAWER = { open: false, formType: null, mode: "add", data: null };

export function Drawer({ open, onClose, title, subtitle, children, width = "w-[480px]" }) {
  return (
    <div className={`fixed inset-0 z-50 transition-all ${open ? "visible" : "invisible"}`}>
      <div
        className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        className={`absolute right-0 top-0 h-full ${width} bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <div className="w-1 h-5 bg-indigo-500 rounded-full mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-base font-semibold text-gray-800 tracking-tight">{title}</h2>
              {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0 ml-3"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}