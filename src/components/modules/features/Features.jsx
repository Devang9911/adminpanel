import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteFeature, getFeaturesById } from "../../../store/featuresSlice";
import { getProducts } from "../../../store/productSlice";
import Drawer from "../../common/Drawer";
import Loader from "../../common/Loader";
import AddFeature from "./AddFeature";
import toast from "react-hot-toast";

const getStatusBadge = (active) => {
  return active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600";
};

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
    if (selectedProduct) {
      dispatch(getFeaturesById(selectedProduct));
    }
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
    <div className="w-full bg-white rounded-xl shadow">
      <div className="flex items-center justify-between py-3 px-5 border-b border-gray-300">
        <div>
          <h2 className="text-2xl uppercase tracking-wider font-semibold">
            Features
          </h2>
        </div>

        <button
          onClick={() =>
            setDrawer({ open: true, type: "addFeature", data: null })
          }
          className="flex gap-2 items-center px-4 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
        >
          <PlusIcon className="w-4 h-4" />
          Add Feature
        </button>
      </div>

      <div className="flex items-center gap-3 py-3 px-5 border-b border-gray-300">
        <label className="text-sm font-medium">Select Module :</label>

        <select
          value={selectedProduct}
          onChange={handleChangeProduct}
          className="px-3 py-2 border border-gray-300 rounded-xl text-sm"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.product_name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Feature</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={4}>
                  <Loader />
                </td>
              </tr>
            )}

            {!loading && features?.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">
                  No features found
                </td>
              </tr>
            )}

            {!loading &&
              features.map((f) => (
                <tr key={f.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">#{f.id}</td>

                  <td className="px-6 py-4">{f.featureName}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${getStatusBadge(
                        f.isActive,
                      )}`}
                    >
                      {f.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        setDrawer({
                          open: true,
                          type: "editFeature",
                          data: f,
                        })
                      }
                      className="hover:bg-blue-100 p-2 rounded-xl"
                    >
                      <PencilSquareIcon className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="hover:bg-red-100 p-2 rounded-xl"
                    >
                      <Trash className="w-5 h-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Drawer
        open={drawer.open}
        onClose={() => setDrawer({ open: false, type: "", data: null })}
        title={drawer.type === "addFeature" ? "Add Feature" : "Update Feature"}
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
