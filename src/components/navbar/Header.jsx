import {
  ArrowRightEndOnRectangleIcon,
  BellIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import { Dropdown } from "../common/Dropdown";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email, name } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="h-14 shrink-0 bg-white border-b border-gray-100 flex items-center justify-end px-6">
      <div className="flex items-center gap-2">
        <Dropdown
          trigger={
            <div className="relative cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <BellIcon className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-400 rounded-full" />
            </div>
          }
        >
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-700">Notifications</p>
          </div>
          <div className="px-4 py-3 text-xs text-gray-400">
            No new notifications
          </div>
        </Dropdown>

        <Dropdown
          trigger={
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2.5 py-1.5 rounded-lg transition-colors">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600 uppercase">
                {name?.[0] || "U"}
              </div>
              {name && (
                <span className="text-xs font-medium text-gray-700 max-w-24 truncate">
                  {name}
                </span>
              )}
            </div>
          }
        >
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-800">{name}</p>
            <p className="text-[11px] text-gray-400 mt-0.5 truncate">{email}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <ArrowRightEndOnRectangleIcon className="w-3.5 h-3.5" />
            Sign out
          </button>
        </Dropdown>
      </div>
    </div>
  );
}

export default Header;
