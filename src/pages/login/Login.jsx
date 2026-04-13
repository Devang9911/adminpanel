import {
  ArrowRightEndOnRectangleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../store/authSlice";
import toast from "react-hot-toast";

function Login() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(loginUser(data)).unwrap();

      if (response.token) {
        navigate("/");
        toast.success(response.message || "Logged in successfully");
        reset();
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded shadow-lg">
        <h2 className="text-center text-2xl font-semibold text-gray-700 pt-10 uppercase tracking-wider">
          Admin Panel
        </h2>

        <form
          className="flex flex-col gap-6 p-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-1">
            <label className="text-md flex gap-2 items-center">
              <EnvelopeIcon className="w-5 h-5" /> Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="border rounded px-3 py-2"
              {...register("email")}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-md flex gap-2 items-center">
              <LockClosedIcon className="w-5 h-5" /> Password
            </label>

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                className="border rounded px-3 py-2 w-full pr-10"
                {...register("password")}
                required
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-2 top-2 text-gray-500"
              >
                {showPass ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
            type="submit"
          >
            <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
