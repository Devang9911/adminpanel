import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

export const getAuditLogs = createAsyncThunk(
  "audit/getAll",
  async ({ limit = 50 }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/admin/audit-logs?limit=${limit}`,
        {
          headers: authHeader(),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to fetch logs");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const auditLogSlice = createSlice({
  name: "auditLogs",
  initialState: {
    list: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAuditLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getAuditLogs.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default auditLogSlice.reducer;