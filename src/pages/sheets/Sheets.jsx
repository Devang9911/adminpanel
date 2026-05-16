import { useState, useCallback, useMemo, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  uid,
  emptyChangelogForm,
  emptyWhatsNewForm,
  Drawer,
  CLOSED_DRAWER,
} from "./constants";

import {
  getChangelog,
  createChangelog,
  updateChangelog,
  deleteChangelog,
  getWhatsNew,
  createWhatsNew,
  updateWhatsNew,
  deleteWhatsNew,
} from "../../store/Versionslice";

import { getProducts } from "../../store/productSlice";

import ChangelogContent from "./ChangelogContent";
import WhatsNewContent from "./WhatsNewContent";
import ChangelogForm from "./ChangelogForm";
import WhatsNewForm from "./WhatsNewForm";

const PAGE_TABS = [
  { key: "whats-new", name: "What's New" },
  { key: "changelog", name: "Changelog" },
];

export default function Sheets() {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.product.products);
  const { changelog, whatsNew, changelogLoading, whatsNewLoading } =
    useSelector((state) => state.version);

  const [tab, setTab] = useState("whats-new");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedProductName, setSelectedProductName] = useState("");
  const [drawer, setDrawer] = useState(CLOSED_DRAWER);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0].id);
      setSelectedProductName(products[0].product_name);
    }
  }, [products, selectedProduct]);

  useEffect(() => {
    if (!selectedProduct) return;
    dispatch(getChangelog(selectedProduct));
    dispatch(getWhatsNew(selectedProduct));
  }, [selectedProduct, dispatch]);

  const handleChangeProduct = (e) => {
    const id = Number(e.target.value);
    const product = products.find((p) => p.id === id);
    setSelectedProduct(id);
    setSelectedProductName(product?.product_name || "");
  };

  const closeDrawer = () => setDrawer(CLOSED_DRAWER);

  const promotedIds = useMemo(
    () => new Set(whatsNew.map((w) => w.versionId).filter(Boolean)),
    [whatsNew],
  );

  const normalizedChangelog = useMemo(
    () =>
      changelog.map((entry) => ({
        ...entry,
        changes: (entry.changes || []).map((c, i) => ({
          id: c.id || `c-${entry.id}-${i}`,
          type: c.type?.toLowerCase() || "feature",
          text: c.text,
        })),
      })),
    [changelog],
  );

  const normalizedWhatsNew = useMemo(
    () =>
      whatsNew.map((w) => ({
        id: w.id,
        changelog_id: w.versionId,
        title: w.featureTitle,
        description: w.shortDescription,
        highlights: w.highlights || [],
        version: w.versionNumber || "",
        date: w.createdAt
          ? new Date(w.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "",
      })),
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
          type: entry.type?.toLowerCase() || "",
          date: entry.date,
          title: entry.title,
          changes: entry.changes.map((c) => ({ ...c })),
        },
      },
    });

  const handleSaveChangelog = useCallback(
    async (form) => {
      const isAdd = drawer.mode === "add";

      const payload = {
        versionNumber: form.version.trim(),
        releaseDate: form.date,
        releaseType: form.type,
        title: form.title.trim(),
        isPublished: true,
        changes: form.changes
          .filter((c) => c.text.trim())
          .map((c, i) => ({
            type: c.type,
            text: c.text.trim(),
            sortOrder: i,
          })),
      };

      try {
        if (isAdd) {
          await dispatch(
            createChangelog({ productId: selectedProduct, payload }),
          ).unwrap();
          toast.success("Release published");
        } else {
          await dispatch(
            updateChangelog({
              productId: selectedProduct,
              versionId: drawer.data.entryId,
              payload,
            }),
          ).unwrap();
          toast.success("Changelog entry updated");
        }
        dispatch(getChangelog(selectedProduct));
        closeDrawer();
      } catch (err) {
        toast.error(err || "Something went wrong");
      }
    },
    [drawer, selectedProduct, dispatch],
  );

  const handleDeleteChangelog = async (id) => {
    try {
      await dispatch(
        deleteChangelog({ productId: selectedProduct, versionId: id }),
      ).unwrap();
      dispatch(getChangelog(selectedProduct));
      dispatch(getWhatsNew(selectedProduct));
      toast.success("Entry deleted");
    } catch (err) {
      toast.error(err || "Something went wrong");
    }
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
          highlights: (feature.highlights || []).map((h) => ({
            id: uid(),
            text: h,
          })),
          _version: feature.version,
          _date: feature.date,
        },
      },
    });

  const handleSaveWhatsNew = useCallback(
    async (form) => {
      const isAdd = drawer.mode === "add";

      const payload = {
        productId: selectedProduct,
        versionId: form.changelog_id ? Number(form.changelog_id) : 0,
        featureTitle: form.title.trim(),
        shortDescription: form.description.trim(),
        highlights: form.highlights.map((h) => h.text).filter(Boolean),
      };

      try {
        if (isAdd) {
          await dispatch(createWhatsNew(payload)).unwrap();
          toast.success("Published to What's New");
        } else {
          await dispatch(
            updateWhatsNew({ id: drawer.data.featureId, payload }),
          ).unwrap();
          toast.success("What's New card updated");
        }
        dispatch(getWhatsNew(selectedProduct));
        closeDrawer();
      } catch (err) {
        toast.error(err || "Something went wrong");
      }
    },
    [drawer, selectedProduct, dispatch],
  );

  const handleDeleteWhatsNew = async (id) => {
    try {
      await dispatch(deleteWhatsNew(id)).unwrap();
      toast.success("Removed from What's New");
    } catch (err) {
      toast.error(err || "Something went wrong");
    }
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

  const loading = changelogLoading || whatsNewLoading;

  return (
    <div className="w-full bg-white shadow-sm border border-gray-100">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-gray-800">
            Release Notes
          </h2>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {tab === "whats-new"
              ? normalizedWhatsNew.length
              : normalizedChangelog.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openAddWhatsNew}
            disabled={!selectedProduct}
            className="px-3.5 py-2 text-xs font-medium border border-indigo-200 text-indigo-600 bg-indigo-50
             hover:bg-indigo-100 transition-colors flex items-center gap-1.5 active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="text-base leading-none">+</span> What's New
          </button>
          <button
            onClick={openAddChangelog}
            disabled={!selectedProduct}
            className="px-4 py-2 text-xs font-medium bg-indigo-600 text-white
              hover:bg-indigo-700 transition-colors flex items-center gap-1.5 active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="text-base leading-none">+</span> New Release
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-100">
        <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">
          Module
        </label>
        <select
          value={selectedProduct}
          onChange={handleChangeProduct}
          className="border capitalize border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600
            focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id} className="capitalize">
              {p.product_name}
            </option>
          ))}
        </select>
        {selectedProductName && (
          <span className="text-xs text-gray-400">
            Showing releases for{" "}
            <span className="font-medium text-gray-600 capitalize">
              {selectedProductName}
            </span>
          </span>
        )}
      </div>

      <div className="flex gap-1 px-6 pt-1 border-b border-gray-100">
        {PAGE_TABS.map((t) => {
          const count =
            t.key === "whats-new"
              ? normalizedWhatsNew.length
              : normalizedChangelog.length;
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

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-xs text-gray-400">Loading…</p>
          </div>
        </div>
      )}

      {!loading && tab === "whats-new" && (
        <WhatsNewContent
          features={normalizedWhatsNew}
          onEdit={openEditWhatsNew}
          onDelete={handleDeleteWhatsNew}
        />
      )}
      {!loading && tab === "changelog" && (
        <ChangelogContent
          entries={normalizedChangelog}
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
            changelogEntries={normalizedChangelog}
            onSave={handleSaveWhatsNew}
            onCancel={closeDrawer}
            mode={drawer.mode}
          />
        )}
      </Drawer>
    </div>
  );
}
