export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <div className="h-10 w-10 rounded-full border-[3px] border-slate-200 border-t-sky-500 animate-spin" />
      <p className="text-sm font-medium text-slate-500">{text}</p>
    </div>
  );
}

export function InlineLoader() {
  return (
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-slate-200 border-t-sky-500" />
        <p className="text-sm font-medium text-slate-500">Please wait...</p>
      </div>
    </div>
  );
}
