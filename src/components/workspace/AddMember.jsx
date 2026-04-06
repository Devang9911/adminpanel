import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMember, updateMember } from "../../store/workspaceSlice";
import { getAllUsers } from "../../store/userSlice";
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
    if (type === "addMember" && !userId) {
      return toast.error("Please select user");
    }

    try {
      setLoading(true);

      if (type === "addMember") {
        await dispatch(
          addMember({
            groupId,
            body: {
              userId: Number(userId),
              role,
            },
          }),
        ).unwrap();

        toast.success("Member added");
      }

      if (type === "updateMember") {
        await dispatch(
          updateMember({
            groupId,
            userId: member.id,
            body: { newRole: role },
          }),
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
    <div className="space-y-5">
      {type === "addMember" && (
        <div>
          <label className="text-sm font-medium text-gray-600">
            Select User
          </label>

          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full mt-1 border border-gray-300 p-2 rounded-xl"
          >
            <option value="">Select user</option>

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
        <label className="text-sm font-medium text-gray-600">Select Role</label>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mt-1 border border-gray-300 p-2 rounded-xl"
        >
          <option value="support">Support</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-xl"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-4 py-2 text-white rounded-xl ${
            loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading
            ? "Processing..."
            : type === "addMember"
              ? "Add Member"
              : "Update Member"}
        </button>
      </div>
    </div>
  );
}
