import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  createStaff,
  updateStaff,
  getAllStaff,
} from "../../../store/staffSlice";

function Spinner({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24">
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

export default function StaffForm({ onClose, editData }) {
  const isEdit = !!editData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      reset({
        fullName: editData.user_name,
        email: editData.user_email,
        phoneNumber: editData.user_phone_number,
        role: editData.role,
        isActive: editData.is_active,
        websocketId: editData.websocket_id,
        websocketPassword: editData.websocket_password,
      });
    }
  }, [editData, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (isEdit) {
        const payload = {
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          role: data.role,
          isActive: data.isActive,
          websocketId: data.websocket_id,
          websocketPassword: data.websocket_password,
        };

        await dispatch(
          updateStaff({
            id: editData.id,
            payload,
          }),
        ).unwrap();

        toast.success("Staff updated successfully");
      } else {
        const payload = {
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: data.password,
          role: data.role,
        };
        await dispatch(createStaff(payload)).unwrap();

        toast.success("Staff created successfully");
      }

      dispatch(getAllStaff());
      reset();
      onClose();
    } catch (err) {
      toast.error(err || "Something went wrong");
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
      <Input
        label="Full Name"
        name="fullName"
        placeholder="Enter full name"
        register={register}
        errors={errors}
        disabled={loading}
      />

      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="Enter email address"
        register={register}
        errors={errors}
        disabled={loading}
      />

      <Input
        label="Phone Number"
        name="phoneNumber"
        placeholder="Enter phone number"
        register={register}
        errors={errors}
        disabled={loading}
      />

      {!isEdit && (
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter password"
          register={register}
          errors={errors}
          disabled={loading}
        />
      )}

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
          Role
        </label>
        <select
          {...register("role", { required: "Role is required" })}
          defaultValue=""
          disabled={loading}
          className="w-full border px-3 py-2.5 text-xs bg-gray-50 border-gray-200 text-gray-700"
        >
          <option value="" disabled>
            Select role
          </option>
          <option value="support">Support</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
        {errors.role && (
          <p className="text-[11px] text-red-500 mt-1">{errors.role.message}</p>
        )}
      </div>

      {isEdit && (
        <>
          <Input
            label="Websocket ID"
            name="websocketId"
            register={register}
            errors={errors}
            disabled={loading}
          />

          <Input
            label="Websocket Password"
            name="websocketPassword"
            register={register}
            errors={errors}
            disabled={loading}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("isActive")}
              className="w-4 h-4"
            />
            <label className="text-xs text-gray-600">Active Status</label>
          </div>
        </>
      )}

      {loading && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-indigo-50 border">
          <Spinner />
          <span className="text-xs text-indigo-600">
            {isEdit ? "Updating..." : "Creating..."}
          </span>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-xs border"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-xs bg-indigo-600 text-white flex items-center gap-1"
        >
          {loading ? <Spinner className="w-3 h-3" /> : null}
          {isEdit ? "Update Staff" : "Create Staff"}
        </button>
      </div>
    </form>
  );
}

function Input({
  label,
  name,
  type = "text",
  register,
  errors,
  disabled,
  placeholder,
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, { required: `${label} is required` })}
        disabled={disabled}
        className={`w-full border px-3 py-2.5 text-xs
        placeholder-gray-400
        ${errors[name] ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}`}
      />
      {errors[name] && (
        <p className="text-[11px] text-red-500 mt-1">{errors[name].message}</p>
      )}
    </div>
  );
}
