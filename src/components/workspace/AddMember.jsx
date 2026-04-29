import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../store/userSlice";
import { addMember, updateMember } from "../../store/workspaceSlice";
import toast from "react-hot-toast";

export default function AddMemberForm({
  groupId,
  member,
  type,
  onClose,
  members,
}) {
  const dispatch = useDispatch();
  const { users = [] } = useSelector((state) => state.users);

  const [userId, setUserId] = useState(member?.id || "");
  const [role, setRole] = useState(member?.user_role || "support");
  const [loading, setLoading] = useState(false);
  const memberIds = members.map((m) => m.id);

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
    if (type === "addMember" && !userId)
      return toast.error("Please select a user");
    try {
      setLoading(true);
      if (type === "addMember") {
        await dispatch(
          addMember({ groupId, body: { userId: Number(userId), role } }),
        ).unwrap();
        toast.success("Member added");
      }
      if (type === "updateMember") {
        await dispatch(
          updateMember({ groupId, userId: member.id, body: { newRole: role } }),
        ).unwrap();
        toast.success("Member updated");
      }
      onClose();
    } catch (err) {
      toast.error(err || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {type === "addMember" && (
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
            User
          </label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition"
          >
            <option value="">Select user…</option>
            {users
              .filter((u) => !memberIds.includes(u.id))
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.email}
                </option>
              ))}
          </select>
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
          Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition"
        >
          <option value="support">Support</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Processing…"
            : type === "addMember"
              ? "Add member"
              : "Save changes"}
        </button>
      </div>
    </div>
  );
}
