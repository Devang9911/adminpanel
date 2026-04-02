import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getDashboardSummary = createAsyncThunk("summary/get", async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/api/admin/dashboard-summary`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = response.json();
  return data;
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    summary: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder

      .addCase(getDashboardSummary.pending, (state) => {
        state.loading = true;
      })

      .addCase(getDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
