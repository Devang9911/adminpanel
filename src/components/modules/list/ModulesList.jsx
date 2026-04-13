import { PencilIcon } from "@heroicons/react/24/solid";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { deleteModule, getProducts } from "../../../store/productSlice";
import Drawer from "../../common/Drawer";
import AddModules from "./AddModules";

function ProductList() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const [drawer, setDrawer] = useState({
    open: false,
    type: "add",
    data: null,
  });

  useEffect(() => {
    dispatch(getProducts());
  }, []);

  const handleDelete = async (moduleId) => {
    try {
      await dispatch(deleteModule({ moduleId })).unwrap();
      dispatch(getProducts());
      toast.success("Module deleted");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-semibold text-gray-800 tracking-tight">
            Modules
          </h2>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {products.length}
          </span>
        </div>
        <button
          onClick={() =>
            setDrawer({ open: true, type: "addModule", data: null })
          }
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <span className="text-base leading-none">+</span> Add module
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-5">
        {loading
          ? [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-xl bg-gray-100 animate-pulse"
              />
            ))
          : products.map((p) => (
              <div
                key={p.id}
                className="flex flex-col justify-between bg-gray-100 border border-gray-200 rounded-xl p-4 hover:border-gray-200 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 capitalize truncate">
                      {p.product_name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                      {p.product_description || "No description available"}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 text-[11px] font-medium px-2.5 py-0.5 rounded-full ring-1 ${
                      p.is_active
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                        : "bg-red-50 text-red-600 ring-red-200"
                    }`}
                  >
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex gap-4 mt-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">
                      {p.features_count}
                    </span>
                    <span className="text-[11px] text-gray-600">Features</span>
                  </div>
                  <div className="w-px bg-gray-100" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">
                      {p.active_users_count}
                    </span>
                    <span className="text-[11px] text-gray-600">Users</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                  <span className="text-[11px] text-gray-600 font-mono">
                    #{p.id}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setDrawer({ open: true, type: "editModule", data: p })
                      }
                      className="relative p-1.5 rounded-lg hover:bg-blue-50 transition-colors group/btn"
                    >
                      <PencilIcon className="w-3.5 h-3.5 text-blue-400 group-hover/btn:text-blue-600" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                        Edit
                      </span>
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="relative p-1.5 rounded-lg hover:bg-red-50 transition-colors group/btn"
                    >
                      <Trash className="w-3.5 h-3.5 text-red-400 group-hover/btn:text-red-600" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                        Delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>

      <Drawer
        open={drawer.open}
        onClose={() => setDrawer({ open: false, type: "", data: null })}
        title={drawer.type === "addModule" ? "Add module" : "Update module"}
      >
        <AddModules
          onClose={() => setDrawer({ open: false, type: "", data: null })}
          type={drawer.type}
          editData={drawer.data}
        />
      </Drawer>
    </div>
  );
}

export default ProductList;
