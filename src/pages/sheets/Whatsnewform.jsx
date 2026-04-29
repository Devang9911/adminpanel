import { useState } from "react";
import { X, Save, Zap } from "lucide-react";
import { uid, inputCls, selectCls, labelCls } from "./constants";

export default function WhatsNewForm({ initial, changelogEntries = [], onSave, onCancel, mode = "add" }) {
  const [form, setForm] = useState(initial);
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handlePickChangelog = (changelogId) => {
    const entry = changelogEntries.find((e) => e.id === changelogId);
    if (!entry) {
      set("changelog_id", "");
      return;
    }
    setForm((f) => ({
      ...f,
      changelog_id: changelogId,
      title: entry.title,
      _version: entry.version,
      _date: entry.date,
    }));
  };

  const updateHl = (id, val) =>
    set("highlights", form.highlights.map((h) => (h.id === id ? { ...h, text: val } : h)));

  const addHl = () =>
    set("highlights", [...form.highlights, { id: uid(), text: "" }]);

  const removeHl = (id) =>
    set("highlights", form.highlights.filter((h) => h.id !== id));

  const handleSave = () => {
    if (!form.title.trim() || !form.description.trim()) {
      alert("Please fill in the feature title and description.");
      return;
    }
    if (mode === "add" && !form.changelog_id) {
      alert("Please link this card to a changelog entry.");
      return;
    }

    const linkedEntry = changelogEntries.find((e) => e.id === form.changelog_id);

    // Clean flat payload ready for DB — no nested UI state
    const payload = {
      changelog_id: form.changelog_id || null,
      version: form._version || linkedEntry?.version || "",
      date: form._date || linkedEntry?.date || "",
      title: form.title.trim(),
      description: form.description.trim(),
      highlights: form.highlights.map((h) => h.text.trim()).filter(Boolean),
    };

    console.log("[WhatsNewForm] payload →", payload);
    onSave(form);
  };

  return (
    <div className="space-y-6">
      {/* Changelog link (add only) */}
      {mode === "add" && (
        <div>
          <label className={labelCls}>Link to changelog entry</label>
          <select
            className={selectCls}
            value={form.changelog_id}
            onChange={(e) => handlePickChangelog(e.target.value)}
          >
            <option value="">Select a release…</option>
            {changelogEntries.map((e) => (
              <option key={e.id} value={e.id}>
                {e.version} — {e.title}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-400 mt-1.5">
            Linking auto-fills the title. You can still edit freely.
          </p>
        </div>
      )}

      {/* Title */}
      <div>
        <label className={labelCls}>Feature title</label>
        <input
          className={inputCls}
          placeholder="e.g. Bar Streaming — Live OHLC Data"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Short description</label>
        <textarea
          className={`${inputCls} min-h-[90px] resize-y`}
          placeholder="1–2 sentences explaining what this feature does and why it matters…"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      {/* Highlights */}
      <div>
        <label className={labelCls}>Highlights</label>
        <div className="space-y-2.5 mb-3">
          {form.highlights.map((h) => (
            <div key={h.id} className="flex gap-2 items-center">
              <input
                className={inputCls}
                placeholder="Key benefit or capability…"
                value={h.text}
                onChange={(e) => updateHl(h.id, e.target.value)}
              />
              <button
                onClick={() => removeHl(h.id)}
                disabled={form.highlights.length === 1}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg
                  border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500
                  hover:border-red-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addHl}
          className="w-full text-sm text-indigo-600 border border-dashed border-indigo-200
            rounded-lg py-2.5 hover:bg-indigo-50 transition font-medium"
        >
          + Add highlight
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={onCancel}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-500
            hover:bg-gray-50 transition font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium
            bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition active:scale-95"
        >
          <Save size={14} />
          {mode === "add" ? "Publish to What's New" : "Save changes"}
        </button>
      </div>
    </div>
  );
}