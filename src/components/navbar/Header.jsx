import {
  ArrowRightEndOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email, name } = useSelector((state) => state.auth);

  const user = {
    name: name,
    email: email,
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="h-15 shrink-0 bg-white border-b border-gray-200 flex items-center justify-end px-6">
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition"
        >
          <UserCircleIcon className="w-9 h-9 text-gray-500" />
        </div>

        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow z-50 overflow-hidden">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition"
            >
              <ArrowRightEndOnRectangleIcon className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
