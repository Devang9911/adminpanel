import { PlusIcon } from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { deleteFeature, getFeaturesById } from "../../../store/featuresSlice";
import { getProducts } from "../../../store/productSlice";
import Drawer from "../../common/Drawer";
import Loader from "../../common/Loader";
import AddFeature from "./AddFeature";

function Features() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const { features, loading } = useSelector((state) => state.features);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedProductName, setSelectedProductName] = useState("");
  const [drawer, setDrawer] = useState({
    open: false,
    type: "add",
    data: null,
  });

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
    if (selectedProduct) dispatch(getFeaturesById(selectedProduct));
  }, [selectedProduct, dispatch]);

  const handleChangeProduct = (e) => {
    const id = Number(e.target.value);
    const product = products.find((p) => p.id === id);
    setSelectedProduct(id);
    setSelectedProductName(product?.product_name || "");
  };

  const handleDelete = async (featureId) => {
    try {
      await dispatch(deleteFeature({ featureId })).unwrap();
      dispatch(getFeaturesById(selectedProduct));
      toast.success("Feature deleted");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-semibold text-gray-800 tracking-tight">
            Features
          </h2>
          {!loading && (
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {features.length}
            </span>
          )}
        </div>
        <button
          onClick={() =>
            setDrawer({ open: true, type: "addFeature", data: null })
          }
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="w-3.5 h-3.5" /> Add feature
        </button>
      </div>

      <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-100">
        <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">
          Module
        </label>
        <select
          value={selectedProduct}
          onChange={handleChangeProduct}
          className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.product_name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/70">
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Feature
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="text-center px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading && (
              <tr>
                <td colSpan={4}>
                  <Loader />
                </td>
              </tr>
            )}

            {!loading && features?.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-14 text-gray-300 text-xs"
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <line x1="9" y1="9" x2="15" y2="9" />
                      <line x1="9" y1="12" x2="15" y2="12" />
                      <line x1="9" y1="15" x2="12" y2="15" />
                    </svg>
                    No features found
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              features.map((f) => (
                <tr
                  key={f.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-6 py-3.5 text-[11px] text-gray-300 font-mono">
                    #{f.id}
                  </td>

                  <td className="px-6 py-3.5 text-xs font-medium text-gray-700">
                    {f.featureName}
                  </td>

                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex items-center text-[11px] font-medium px-2.5 py-0.5 rounded-full ring-1 ${
                        f.isActive
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : "bg-red-50 text-red-600 ring-red-200"
                      }`}
                    >
                      {f.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() =>
                          setDrawer({
                            open: true,
                            type: "editFeature",
                            data: f,
                          })
                        }
                        className="relative p-1.5 rounded-lg hover:bg-blue-50 transition-colors group/btn"
                      >
                        <PencilSquareIcon className="w-4 h-4 text-blue-400 group-hover/btn:text-blue-600" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                          Edit
                        </span>
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="relative p-1.5 rounded-lg hover:bg-red-50 transition-colors group/btn"
                      >
                        <Trash className="w-4 h-4 text-red-400 group-hover/btn:text-red-600" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                          Delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Drawer
        open={drawer.open}
        onClose={() => setDrawer({ open: false, type: "", data: null })}
        title={drawer.type === "addFeature" ? "Add feature" : "Update feature"}
      >
        <AddFeature
          selectedProduct={selectedProduct}
          selectedProductName={selectedProductName}
          editData={drawer.data}
          onClose={() => setDrawer({ open: false, type: "", data: null })}
        />
      </Drawer>
    </div>
  );
}

export default Features;
