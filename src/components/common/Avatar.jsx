export default function Avatar({ name = "", size = "md", className = "" }) {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-7 h-7 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-sm",
    xl: "w-12 h-12 text-base",
  };
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold shrink-0 ${getAvatarColor(name)} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}

export function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getAvatarColor(name = "") {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-violet-100 text-violet-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-sky-100 text-sky-700",
    "bg-teal-100 text-teal-700",
    "bg-indigo-100 text-indigo-700",
  ];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
}
