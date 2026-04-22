import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllUsers = createAsyncThunk(
  "users/get",
  async (filters, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const {
        search = "",
        status = "",
        page,
        pageSize,
        module = "",
        plan = "",
      } = filters;

      const query = new URLSearchParams({
        search,
        status: status === "all" ? "" : status,
        page,
        plan: plan === "all" ? "" : plan,
        module: module === "all" ? "" : module,
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

export const updateUserStatus = createAsyncThunk(
  "users/updateStatus",
  async (update, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { userid, status } = update;
      const response = await fetch(
        `${BASE_URL}/api/admin/users/${userid}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isActive: status,
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to update status");
      }
      return { userid, status };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const createUser = createAsyncThunk(
  "users/create",
  async (user, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/admin/create-regular-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(user),
        },
      );
      const data = await response.json();
      console.log("CREATE USER RESPONSE:", data);
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to create user");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const getUserDetailById = createAsyncThunk(
  "users/getById",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to fetch user");
      }

      return data;
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
  updatingUserId: null,
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
      })

      .addCase(updateUserStatus.pending, (state, action) => {
        state.updatingUserId = action.meta.arg.userid;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.updatingUserId = null;

        const { userid, status } = action.payload;

        const user = state.users.find((u) => u.id === userid);

        if (user) {
          user.isActive = status;
          user.status = status ? "active" : "inactive";
        }
      })
      .addCase(updateUserStatus.rejected, (state) => {
        state.updatingUserId = null;
      });
  },
});

export const { setUsers, addUser, removeUser, setLoading, setError } =
  userSlice.actions;

export default userSlice.reducer;
