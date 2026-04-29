import { useState, useCallback, useMemo } from "react";
import { CheckCircle2 } from "lucide-react";

import {
  uid,
  emptyChangelogForm,
  emptyWhatsNewForm,
  Drawer,
  CLOSED_DRAWER,
  INITIAL_CHANGELOG,
  INITIAL_WHATS_NEW,
} from "./constants";

import ChangelogContent from "./ChangelogContent";
import WhatsNewContent from "./WhatsNewContent";
import ChangelogForm from "./ChangelogForm";
import WhatsNewForm from "./WhatsNewForm";

const PAGE_TABS = [
  { key: "whats-new", name: "What's New" },
  { key: "changelog", name: "Changelog" },
];

export default function Sheets() {
  const [tab, setTab] = useState("whats-new");
  const [changelog, setChangelog] = useState(INITIAL_CHANGELOG);
  const [whatsNew, setWhatsNew] = useState(INITIAL_WHATS_NEW);
  const [drawer, setDrawer] = useState(CLOSED_DRAWER);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const closeDrawer = () => setDrawer(CLOSED_DRAWER);

  const promotedIds = useMemo(
    () => new Set(whatsNew.map((w) => w.changelog_id).filter(Boolean)),
    [whatsNew],
  );

  const openAddChangelog = () =>
    setDrawer({
      open: true,
      formType: "changelog",
      mode: "add",
      data: { form: emptyChangelogForm() },
    });

  const openEditChangelog = (entry) =>
    setDrawer({
      open: true,
      formType: "changelog",
      mode: "edit",
      data: {
        entryId: entry.id,
        form: {
          version: entry.version,
          type: entry.type,
          date: entry.date,
          title: entry.title,
          changes: entry.changes.map((c) => ({ ...c })),
        },
      },
    });

  const handleSaveChangelog = useCallback(
    (form) => {
      const isAdd = drawer.mode === "add";
      const id = isAdd ? `cl-${uid()}` : drawer.data.entryId;

      const entry = {
        id,
        version: form.version.trim(),
        type: form.type,
        date: form.date,
        title: form.title.trim(),
        changes: form.changes
          .filter((c) => c.text.trim())
          .map((c) => ({ id: c.id, type: c.type, text: c.text.trim() })),
      };

      if (isAdd) {
        setChangelog((prev) => [entry, ...prev]);
      } else {
        setChangelog((prev) => prev.map((e) => (e.id === id ? entry : e)));
        setWhatsNew((prev) =>
          prev.map((w) =>
            w.changelog_id === id
              ? { ...w, version: entry.version, date: entry.date }
              : w,
          ),
        );
      }

      closeDrawer();
      showToast(isAdd ? "Release published" : "Changelog entry updated");
    },
    [drawer],
  );

  const handleDeleteChangelog = (id) => {
    setChangelog((prev) => prev.filter((e) => e.id !== id));
    setWhatsNew((prev) => prev.filter((w) => w.changelog_id !== id));
    showToast("Entry deleted");
  };

  const openAddWhatsNew = () =>
    setDrawer({
      open: true,
      formType: "whats-new",
      mode: "add",
      data: { form: emptyWhatsNewForm() },
    });

  const openEditWhatsNew = (feature) =>
    setDrawer({
      open: true,
      formType: "whats-new",
      mode: "edit",
      data: {
        featureId: feature.id,
        form: {
          changelog_id: feature.changelog_id || "",
          title: feature.title,
          description: feature.description,
          highlights: feature.highlights.map((h) => ({ id: uid(), text: h })),
          _version: feature.version,
          _date: feature.date,
        },
      },
    });

  const handleSaveWhatsNew = useCallback(
    (form) => {
      const isAdd = drawer.mode === "add";
      const linked = changelog.find((e) => e.id === form.changelog_id);
      const version = form._version || linked?.version || "";
      const date = form._date || linked?.date || "";

      const card = {
        id: isAdd ? `wn-${uid()}` : drawer.data.featureId,
        changelog_id: form.changelog_id || null,
        title: form.title.trim(),
        version,
        date,
        description: form.description.trim(),
        highlights: form.highlights.map((h) => h.text).filter(Boolean),
      };

      if (isAdd) {
        setWhatsNew((prev) => [card, ...prev]);
      } else {
        setWhatsNew((prev) => prev.map((w) => (w.id === card.id ? card : w)));
      }

      closeDrawer();
      showToast(isAdd ? "Published to What's New" : "What's New card updated");
    },
    [drawer, changelog],
  );

  const handleDeleteWhatsNew = (id) => {
    setWhatsNew((prev) => prev.filter((w) => w.id !== id));
    showToast("Removed from What's New");
  };

  const drawerMeta = {
    changelog: {
      add: {
        title: "Publish new release",
        subtitle: "Creates a versioned changelog entry",
      },
      edit: {
        title: "Edit changelog entry",
        subtitle: "Changes here won't affect the What's New card",
      },
    },
    "whats-new": {
      add: {
        title: "Add to What's New",
        subtitle: "Feature card shown to users in the What's New tab",
      },
      edit: {
        title: "Edit What's New card",
        subtitle: "Changelog entry is edited separately",
      },
    },
  };

  const meta = drawer.formType
    ? drawerMeta[drawer.formType]?.[drawer.mode]
    : null;

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-gray-800">
            Release Notes
          </h2>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {tab === "whats-new" ? whatsNew.length : changelog.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openAddWhatsNew}
            className="px-3.5 py-2 text-xs font-medium border border-indigo-200 text-indigo-600 bg-indigo-50
              rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1.5 active:scale-95"
          >
            <span className="text-base leading-none">+</span> What's New
          </button>
          <button
            onClick={openAddChangelog}
            className="px-4 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg
              hover:bg-indigo-700 transition-colors flex items-center gap-1.5 active:scale-95"
          >
            <span className="text-base leading-none">+</span> New Release
          </button>
        </div>
      </div>

      <div className="flex gap-1 px-6 pt-1 border-b border-gray-100">
        {PAGE_TABS.map((t) => {
          const count =
            t.key === "whats-new" ? whatsNew.length : changelog.length;
          const isActive = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-3 px-3 pt-3 text-xs font-medium transition-colors flex items-center gap-2 ${
                isActive
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t.name}
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  isActive
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {tab === "whats-new" && (
        <WhatsNewContent
          features={whatsNew}
          onEdit={openEditWhatsNew}
          onDelete={handleDeleteWhatsNew}
        />
      )}
      {tab === "changelog" && (
        <ChangelogContent
          entries={changelog}
          whatsNewIds={promotedIds}
          onEdit={openEditChangelog}
          onDelete={handleDeleteChangelog}
        />
      )}

      <Drawer
        open={drawer.open}
        onClose={closeDrawer}
        title={meta?.title || ""}
        subtitle={meta?.subtitle}
        width="w-[480px]"
      >
        {drawer.open && drawer.formType === "changelog" && (
          <ChangelogForm
            key={drawer.mode + (drawer.data?.entryId || "new")}
            initial={drawer.data?.form}
            onSave={handleSaveChangelog}
            onCancel={closeDrawer}
            mode={drawer.mode}
          />
        )}
        {drawer.open && drawer.formType === "whats-new" && (
          <WhatsNewForm
            key={drawer.mode + (drawer.data?.featureId || "new")}
            initial={drawer.data?.form}
            changelogEntries={changelog}
            onSave={handleSaveWhatsNew}
            onCancel={closeDrawer}
            mode={drawer.mode}
          />
        )}
      </Drawer>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg">
          <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
          {toast}
        </div>
      )}
    </div>
  );
}
