import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || data?.error || "Something went wrong");
  }

  return data;
};

export const getAllStaff = createAsyncThunk(
  "staff/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchWithAuth("/api/admin/getAllStaff");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const createStaff = createAsyncThunk(
  "staff/create",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await fetchWithAuth("/api/admin/create-internal-staff", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateStaff = createAsyncThunk(
  "staff/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const data = await fetchWithAuth(
        `/api/admin/update-internalstaff/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        },
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const staffSlice = createSlice({
  name: "staff",
  initialState: {
    staff: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearStaffError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(getAllStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff = action.payload?.data || [];
      })
      .addCase(getAllStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStaff.fulfilled, (state, action) => {
        state.loading = false;

        const newStaff = action.payload?.data;
        if (newStaff) {
          state.staff.unshift(newStaff);
        }
      })
      .addCase(createStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        state.loading = false;

        const updated = action.payload?.data;

        if (updated) {
          state.staff = state.staff.map((s) =>
            s.id === updated.id ? updated : s,
          );
        }
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStaffError } = staffSlice.actions;
export default staffSlice.reducer;
