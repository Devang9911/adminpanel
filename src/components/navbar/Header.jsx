import {
  ArrowRightEndOnRectangleIcon,
  BellIcon,
  UserCircleIcon
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
    <div className="h-15 shrink-0 bg-white border-b border-gray-200 flex items-center justify-end px-6">
      <div className="flex items-center gap-4">
        <Dropdown
          trigger={
            <div className="relative cursor-pointer p-2 rounded-lg hover:bg-gray-100">
              <BellIcon className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
          }
        >
          <div className="p-3 text-sm text-gray-700 border-b font-medium">
            Notifications
          </div>
          <div className="p-3 text-sm text-gray-500">No new notifications</div>
        </Dropdown>

        <Dropdown
          trigger={
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg">
              <UserCircleIcon className="w-9 h-9 text-gray-500" />
            </div>
          }
        >
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-medium text-gray-800">{name}</p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition"
          >
            <ArrowRightEndOnRectangleIcon className="w-4 h-4" />
            Logout
          </button>
        </Dropdown>
      </div>
    </div>
  );
}

export default Header;
