import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, getCategories } from "../../../store/categorySlice";
import Drawer from "../../common/Drawer";
import { Icon } from "../../common/Icon";
import Loader from "../../common/Loader";
import AddCategory from "./AddCategory";

function Categories() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);
  const [drawer, setDrawer] = useState({ open: false, type: null, data: null });

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleDelete = async (categoryId) => {
    try {
      await dispatch(deleteCategory({ categoryId })).unwrap();
      dispatch(getCategories());
      toast.success("Category deleted");
    } catch (error) {
      toast.error(error);
    }
  };

  const closeDrawer = () => setDrawer({ open: false, type: null, data: null });

  return (
    <div className="w-full bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-semibold text-gray-800 tracking-tight">
            Categories
          </h2>
          {!loading && (
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {categories.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setDrawer({ open: true, type: "add", data: null })}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          <span className="text-base leading-none">+</span> Add category
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/70">
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="text-center px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading && (
              <tr>
                <td colSpan={2}>
                  <Loader />
                </td>
              </tr>
            )}

            {!loading && categories?.length === 0 && (
              <tr>
                <td
                  colSpan={2}
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
                      <path d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    No categories found
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              categories?.map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <p className="text-xs font-semibold text-gray-700 capitalize">
                      {cat.categoryName}
                    </p>
                    <p className="text-[11px] text-gray-300 font-mono mt-0.5">
                      #{cat.id}
                    </p>
                  </td>

                  <td className="px-6 py-3.5">
                    <div className="flex justify-center items-center gap-1">
                      <button
                        onClick={() =>
                          setDrawer({ open: true, type: "edit", data: cat })
                        }
                        className="relative p-1.5 hover:bg-blue-50 transition-colors group/btn"
                      >
                        <Icon icon={"edit"} className={{color : "blue"}}/>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                          Edit
                        </span>
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="relative p-1.5 hover:bg-red-50 transition-colors group/btn"
                      >
                        <Icon icon={"delete"} className={{color : "red"}}/>
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
        onClose={closeDrawer}
        title={drawer.type === "edit" ? "Update category" : "Add category"}
      >
        <AddCategory
          mode={drawer.type}
          editData={drawer.data}
          onClose={closeDrawer}
        />
      </Drawer>
    </div>
  );
}

export default Categories;
