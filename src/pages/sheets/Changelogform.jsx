import { useState } from "react";
import { X, Save } from "lucide-react";
import { uid, inputCls, selectCls, labelCls, DATE_OPTIONS } from "./constants";

export default function ChangelogForm({
  initial,
  onSave,
  onCancel,
  mode = "add",
}) {
  const [form, setForm] = useState(initial);
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const updateChange = (id, field, val) =>
    set(
      "changes",
      form.changes.map((c) => (c.id === id ? { ...c, [field]: val } : c)),
    );

  const addChange = () =>
    set("changes", [...form.changes, { id: uid(), type: "feature", text: "" }]);

  const removeChange = (id) =>
    set(
      "changes",
      form.changes.filter((c) => c.id !== id),
    );

  const handleSave = () => {
    if (!form.version.trim() || !form.type || !form.title.trim()) {
      alert("Please fill in version, release type, and title.");
      return;
    }

    const payload = {
      version: form.version.trim(),
      type: form.type,
      date: form.date,
      title: form.title.trim(),
      changes: form.changes
        .filter((c) => c.text.trim())
        .map(({ type, text }) => ({ type, text: text.trim() })),
    };

    console.log("[ChangelogForm] payload →", payload);
    onSave(form);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelCls}>Version</label>
          <input
            className={inputCls}
            placeholder="v2.5.0"
            value={form.version}
            onChange={(e) => set("version", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Type</label>
          <select
            className={selectCls}
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
          >
            <option value="">Select…</option>
            <option value="major">Major</option>
            <option value="minor">Minor</option>
            <option value="patch">Patch</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Date</label>
          <select
            className={selectCls}
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
          >
            <option value="">Month…</option>
            {DATE_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Release title</label>
        <input
          className={inputCls}
          placeholder="e.g. Dark Mode & Performance Fixes"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
        />
      </div>

      <div>
        <label className={labelCls}>Changes</label>
        <div className="space-y-2.5 mb-3">
          {form.changes.map((c) => (
            <div key={c.id} className="flex gap-2 items-center">
              <select
                className="border border-gray-200 bg-white px-2.5 py-2.5 text-sm text-gray-600
                  focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 flex-shrink-0"
                value={c.type}
                onChange={(e) => updateChange(c.id, "type", e.target.value)}
              >
                <option value="feature">New</option>
                <option value="improvement">Improved</option>
                <option value="fix">Fixed</option>
              </select>
              <input
                className={inputCls}
                placeholder="Describe this change…"
                value={c.text}
                onChange={(e) => updateChange(c.id, "text", e.target.value)}
              />
              <button
                onClick={() => removeChange(c.id)}
                disabled={form.changes.length === 1}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center
                  border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500
                  hover:border-red-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addChange}
          className="w-full text-sm text-indigo-600 border border-dashed border-indigo-200
           py-2.5 hover:bg-indigo-50 transition font-medium"
        >
          + Add change
        </button>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          onClick={onCancel}
          className="px-4 py-2.5 text-sm border border-gray-200 text-gray-500
            hover:bg-gray-50 transition font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium
            bg-indigo-600 text-white hover:bg-indigo-700 transition active:scale-95"
        >
          <Save size={14} />
          {mode === "add" ? "Publish release" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
