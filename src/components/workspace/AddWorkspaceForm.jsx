import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../store/userSlice";
import { createWorkspace } from "../../store/workspaceSlice";
import toast from "react-hot-toast";

function AddWorkspaceForm({ onClose }) {
  const dispatch = useDispatch();
  const { users = [] } = useSelector((state) => state.users);

  const [workspaceName, setWorkspaceName] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(
      getAllUsers({
        search: "",
        status: "all",
        plan: "all",
        category: "all",
        module: "all",
        page: 1,
        pageSize: 50,
      }),
    );
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!workspaceName.trim()) return toast.error("Workspace name is required");

    if (!ownerId) return toast.error("Please select an owner");

    try {
      setLoading(true);

      await dispatch(
        createWorkspace({
          workspaceName,
          ownerId: Number(ownerId),
        }),
      ).unwrap();

      toast.success("Workspace created");
      onClose();
    } catch (err) {
      toast.error(err || "Failed to create workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
          Workspace Name
        </label>
        <input
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
          type="text"
          placeholder="Enter workspace name"
          className="w-full border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
          Owner
        </label>
        <select
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
          className="w-full border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
        >
          <option value="">Select owner…</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.email}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create Workspace"}
        </button>
      </div>
    </div>
  );
}

export default AddWorkspaceForm;
