import { useNavigate, useParams } from "react-router-dom";
import Loader from "../common/Loader";

import {
  ArrowLeftIcon,
  PlusIcon,
  UsersIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import toast from "react-hot-toast";
import {
  getWorkspaceDetails,
  getWorkspaceMembers,
  removeMember,
} from "../../store/workspaceSlice";
import WorkspaceDrawer from "./WorkspaceDrawer";

function formatDate(dateString, locale = "en-IN") {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

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
      dispatch(
        removeMember({
          groupId: id,
          userId: delid,
        }),
      );
      toast.success("Member removed");
    } catch (error) {
      toast.error(error);
    }
  };

  if (loadingDetails) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-xl">
            <UsersIcon className="w-6 h-6 text-indigo-600" />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {details?.group_name}
            </h1>
            <p className="text-sm text-gray-500">
              Manage workspace members and roles
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/workspaces")}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-xl transition"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex justify-between items-center p-5 border-b border-gray-300">
          <h3 className="text-lg font-semibold text-gray-700">
            Members ({members.length})
          </h3>

          <button
            onClick={() =>
              setDrawer({
                open: true,
                type: "add-member",
                data: { groupId: id },
              })
            }
            className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition"
          >
            <PlusIcon className="w-5 h-5" />
            Add Member
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Joined</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loadingMembers ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center">
                    <Loader />
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-10 text-gray-400">
                    No members found
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-600 uppercase">
                          {member.user_name?.[0]}
                        </div>

                        <div>
                          <div className="font-medium text-gray-800 capitalize">
                            {member.user_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {member.user_email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                        {member.user_role}
                      </span>
                    </td>

                    <td className="p-4 text-gray-500">
                      {formatDate(member.joined_at)}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <div className="relative group">
                          <button
                            onClick={() =>
                              setDrawer({
                                open: true,
                                type: "update-member",
                                data: { groupId: id, member },
                              })
                            }
                            className="p-2 rounded-xl hover:bg-green-100 text-green-600 transition"
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>

                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                            Update
                          </span>
                        </div>

                        <div className="relative group">
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="p-2 rounded-xl hover:bg-red-100 text-red-600 transition"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>

                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                            Delete
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <WorkspaceDrawer
        open={drawer.open}
        type={drawer.type}
        data={drawer.data}
        onClose={() => setDrawer({ open: false, type: "", data: null })}
      />
    </div>
  );
}

export default WorkspaceDetails;
