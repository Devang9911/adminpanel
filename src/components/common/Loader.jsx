export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5 py-16">
      <div className="h-8 w-8 rounded-full border-2 border-gray-100 border-t-indigo-500 animate-spin" />
      <p className="text-xs font-medium text-gray-400">{text}</p>
    </div>
  );
}

export function InlineLoader() {
  return (
    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2.5">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-100 border-t-indigo-500" />
        <p className="text-xs font-medium text-gray-400">Please wait…</p>
      </div>
    </div>
  );
}