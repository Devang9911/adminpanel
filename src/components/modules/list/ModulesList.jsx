import { PencilIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../store/productSlice";
import ModuleDrawer from "./ModuleDrawer";

function ProductList() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProducts());
  }, []);
  const { products, loading } = useSelector((state) => state.product);
  const [drawer, setDrawer] = useState({
    open: false,
    type: "add",
    data: null,
  });
  return (
    <div className="bg-white rounded flex flex-col gap-5 ">
      <div className="flex items-center justify-between py-3 px-5 border-b border-gray-300">
        <h2 className="text-2xl uppercase tracking-wider font-semibold">
          Modules
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setDrawer({ open: true, type: "add", data: null })}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            + Add Modules
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 px-5">
        {loading
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="h-36 rounded bg-gray-200 animate-pulse" />
            ))
          : products.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-gray-200 rounded p-5 hover:shadow-lg transition group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold capitalize">
                      {p.product_name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {p.product_description || "No description available"}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      p.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex gap-6 mt-4 text-sm text-gray-600">
                  <div>
                    <span className="font-semibold text-gray-800">
                      {p.features_count}
                    </span>{" "}
                    Features
                  </div>

                  <div>
                    <span className="font-semibold text-gray-800">
                      {p.active_users_count}
                    </span>{" "}
                    Users
                  </div>
                </div>

                <div className="flex justify-between items-center mt-5 pt-3 border-t">
                  <span className="text-xs text-gray-400">ID: {p.id}</span>

                  <button
                    onClick={() =>
                      setDrawer({ open: true, type: "edit", data: p })
                    }
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
      </div>
      <ModuleDrawer
        open={drawer.open}
        type={drawer.type}
        data={drawer.data}
        onClose={() => setDrawer({ open: false })}
      />
    </div>
  );
}

export default ProductList;
