import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../../store/categorySlice";
import Loader from "../../common/Loader";
import CategoryDrawer from "./CategoryDrawer";

const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
];

const getColorFromName = (name = "") => {
  const index =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};

function Categories() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);

  const [drawer, setDrawer] = useState({
    open: false,
    type: "add",
    data: null,
  });

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleAdd = () => {
    setDrawer({ open: true, type: "add", data: null });
  };

  const handleEdit = (cat) => {
    setDrawer({ open: true, type: "edit", data: cat });
  };

  return (
    <div className="w-full bg-white rounded shadow">
      <div className="flex items-center justify-between py-3 px-5 border-b border-gray-300">
        <h2 className="text-2xl uppercase tracking-wider font-semibold">
          Categories
        </h2>

        <button
          onClick={handleAdd}
          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          + Add Category
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-6 py-3">Category</th>
              <th className="text-center px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={2}>
                  <Loader />
                </td>
              </tr>
            )}

            {!loading && categories?.length === 0 && (
              <tr>
                <td colSpan={2} className="text-center py-6 text-gray-400">
                  No categories found
                </td>
              </tr>
            )}

            {!loading &&
              categories?.map((cat) => (
                <tr key={cat.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium capitalize">
                          {cat.categoryName}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {cat.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="group relative p-2 rounded hover:bg-blue-100"
                      >
                        <PencilIcon className="w-5 h-5 text-blue-600" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                          Edit
                        </span>
                      </button>

                      <button className="group relative p-2 rounded hover:bg-red-100 text-red-600 transition">
                        <TrashIcon className="w-5 h-5" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
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

      <CategoryDrawer
        open={drawer.open}
        type={drawer.type}
        data={drawer.data}
        onClose={() => setDrawer({ open: false, type: "add", data: null })}
      />
    </div>
  );
}

export default Categories;
