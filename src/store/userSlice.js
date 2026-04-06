import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllUsers = createAsyncThunk(
  "users/get",
  async (filters, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { search = "", status = "", page, pageSize } = filters;

      const query = new URLSearchParams({
        search,
        status: status === "all" ? "" : status,
        page,
        pageSize,
      });

      const res = await fetch(
        `${BASE_URL}/api/admin/getUsers?${query.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed");

      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const initialState = {
  users: [],
  loading: false,
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 1,
};

const userSlice = createSlice({
  name: "users",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;

        state.users = action.payload.data;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setUsers, addUser, removeUser, setLoading, setError } =
  userSlice.actions;

export default userSlice.reducer;
