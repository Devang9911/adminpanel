import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateUser, getAllUsers } from "../../store/userSlice";

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

export default function UpdateUser({ data: user, onClose }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.name || "",
        email: user.email || "",
        phoneNumber: user.phone || "",
        isActive: user.isActive ?? user.status === "active",
      });
    }
  }, [user, reset]);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      await dispatch(
        updateUser({
          userId: user.id,
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          isActive: formData.isActive,
        }),
      ).unwrap();
      toast.success("User updated successfully");
      onClose();
    } catch (error) {
      toast.error(error || "Failed to update user");
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

      {/* isActive toggle */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200">
        <span className="text-xs font-semibold text-gray-600">
          Active status
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            {...register("isActive")}
            className="sr-only peer"
            disabled={loading}
          />
          <div
            className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-indigo-100 rounded-full peer
            peer-checked:bg-indigo-600 transition-colors after:content-[''] after:absolute after:top-0.5
            after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all
            peer-checked:after:translate-x-4"
          />
        </label>
      </div>

      {loading && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-indigo-50 border border-indigo-100">
          <Spinner className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-xs text-indigo-600 font-medium">
            Saving changes…
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
            flex items-center gap-1.5 min-w-[100px] justify-center"
        >
          {loading ? (
            <>
              <Spinner className="w-3 h-3 text-white" /> Saving…
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </div>
    </form>
  );
}
