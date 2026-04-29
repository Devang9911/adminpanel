import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { resetUserPassword } from "../../store/userSlice";

function Spinner({ className = "w-3.5 h-3.5" }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export default function ResetPassword({ userId, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        userId,
        password: data.password,
      };
      await dispatch(resetUserPassword(payload)).unwrap();
      toast.success("Password updated successfully");
      reset();
      onClose?.();
    } catch (error) {
      toast.error(error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
          New password
        </label>

        <input
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters",
            },
          })}
          placeholder="Enter new password"
          disabled={loading}
          className={`w-full border px-3 py-2.5 text-xs text-gray-700 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100
            ${
              errors.password
                ? "border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-300"
                : "border-gray-200 bg-gray-50"
            }`}
        />

        {errors.password && (
          <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.password.message}
          </p>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-indigo-50 border border-indigo-100">
          <Spinner className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-xs text-indigo-600 font-medium">
            Updating password…
          </span>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-200
            hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-xs font-medium bg-indigo-600 text-white
            hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed
            flex items-center gap-1.5 min-w-[120px] justify-center"
        >
          {loading ? (
            <>
              <Spinner className="w-3 h-3 text-white" />
              Updating…
            </>
          ) : (
            "Update password"
          )}
        </button>
      </div>
    </form>
  );
}
