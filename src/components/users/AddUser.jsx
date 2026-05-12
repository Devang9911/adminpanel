import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createUser, getAllUsers } from "../../store/userSlice";

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

export default function AddUser({ onClose }) {
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
      await dispatch(
        createUser({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          phoneNumber: data.phoneNumber,
        }),
      ).unwrap();
      await dispatch(
        getAllUsers({
          search: "",
          status: "",
          page: 1,
          pageSize: 10,
          module: "",
          plan: "",
        }),
      );
      toast.success("User created successfully");
      reset();
      onClose();
    } catch (error) {
      toast.error(error || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "fullName",
      label: "Full name",
      type: "text",
      placeholder: "Enter full name",
      validation: { required: "Full name is required" },
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email",
      validation: {
        required: "Email is required",
        pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
      },
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
      validation: {
        required: "Password is required",
        minLength: { value: 6, message: "Minimum 6 characters" },
      },
    },
    {
      name: "phoneNumber",
      label: "Phone number",
      type: "tel",
      placeholder: "Enter phone number",
      validation: { required: "Phone number is required" },
    },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      {fields.map(({ name, label, type, placeholder, validation }) => (
        <div key={name}>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
            {label}
          </label>
          <input
            type={type}
            {...register(name, validation)}
            placeholder={placeholder}
            disabled={loading}
            className={`w-full border px-3 py-2.5 text-xs text-gray-700 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100
              ${errors[name] ? "border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-300" : "border-gray-200 bg-gray-50"}`}
          />
          {errors[name] && (
            <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
              <svg
                className="w-3 h-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors[name].message}
            </p>
          )}
        </div>
      ))}

      {loading && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-indigo-50 border border-indigo-100">
          <Spinner className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-xs text-indigo-600 font-medium">
            Creating user account…
          </span>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-1.5 min-w-[100px] justify-center"
        >
          {loading ? (
            <>
              <Spinner className="w-3 h-3 text-white" /> Creating…
            </>
          ) : (
            "Create user"
          )}
        </button>
      </div>
    </form>
  );
}
