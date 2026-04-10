import {
  ArrowLeftIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getWorkspaceDetails,
  getWorkspaceMembers,
  removeMember,
} from "../../store/workspaceSlice";
import Drawer from "../common/Drawer";
import Loader from "../common/Loader";
import AddMemberForm from "./AddMember";

function formatDate(dateString, locale = "en-IN") {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const colors = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-pink-500",
];
const getColorFromName = (name = "") => {
  const index =
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

function WorkspaceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { members, details, loadingMembers, loadingDetails } = useSelector(
    (state) => state.workspace,
  );
  const [drawer, setDrawer] = useState({
    open: false,
    type: "add",
    data: null,
  });

  useEffect(() => {
    dispatch(getWorkspaceMembers(id));
    dispatch(getWorkspaceDetails(id));
  }, [id, dispatch]);

  const handleDelete = (delid) => {
    try {
      dispatch(removeMember({ groupId: id, userId: delid }));
      toast.success("Member removed");
    } catch (error) {
      toast.error(error);
    }
  };

  const closeDrawer = () => setDrawer({ open: false, type: "", data: null });

  if (loadingDetails) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <UsersIcon className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-800">
              {details?.group_name}
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Manage workspace members and roles
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/workspaces")}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" /> Back
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-semibold text-gray-800">Members</h3>
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {members.length}
            </span>
          </div>
          <button
            onClick={() =>
              setDrawer({
                open: true,
                type: "addMember",
                data: { groupId: id },
              })
            }
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-3.5 h-3.5" /> Add member
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/70">
                <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="text-center px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {loadingMembers ? (
                <tr>
                  <td colSpan={4}>
                    <Loader />
                  </td>
                </tr>
              ) : members.length === 0 ? (
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
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      No members found
                    </div>
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white uppercase flex-shrink-0 ${getColorFromName(member.user_name)}`}
                        >
                          {member.user_name?.[0]}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800 capitalize">
                            {member.user_name}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            {member.user_email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 capitalize">
                        {member.user_role}
                      </span>
                    </td>

                    <td className="px-6 py-3.5 text-xs text-gray-400">
                      {formatDate(member.joined_at)}
                    </td>

                    <td className="px-6 py-3.5">
                      <div className="flex justify-center items-center gap-1">
                        <button
                          onClick={() =>
                            setDrawer({
                              open: true,
                              type: "updateMember",
                              data: { groupId: id, member },
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
                          onClick={() => handleDelete(member.id)}
                          className="relative p-1.5 rounded-lg hover:bg-red-50 transition-colors group/btn"
                        >
                          <TrashIcon className="w-4 h-4 text-red-400 group-hover/btn:text-red-600" />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                            Remove
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Drawer
        title={drawer.type === "updateMember" ? "Update member" : "Add member"}
        open={drawer.open}
        onClose={closeDrawer}
      >
        <AddMemberForm
          type={drawer.type}
          groupId={drawer.data?.groupId}
          member={drawer.data?.member}
          onClose={closeDrawer}
          members={members}
        />
      </Drawer>
    </div>
  );
}

export default WorkspaceDetails;
