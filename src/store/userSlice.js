import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const fetchAPI = async (url, options = {}, rejectWithValue) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}${url}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
      ...options,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
};

const buildQuery = (filters = {}) => {
  const {
    search = "",
    status = "",
    page = 1,
    pageSize = 10,
    module = "",
    plan = "",
  } = filters;

  return new URLSearchParams({
    search,
    status: status === "all" ? "" : status,
    page,
    pageSize,
    module: module === "all" ? "" : module,
    plan: plan === "all" ? "" : plan,
  }).toString();
};

export const getAllUsers = createAsyncThunk(
  "users/getAll",
  async (filters, { rejectWithValue }) => {
    const query = buildQuery(filters);
    return fetchAPI(`/api/admin/getUsers?${query}`, {}, rejectWithValue);
  },
);

export const createUser = createAsyncThunk(
  "users/create",
  async (user, { rejectWithValue }) => {
    return fetchAPI(
      `/api/admin/create-regular-user`,
      {
        method: "POST",
        body: JSON.stringify(user),
      },
      rejectWithValue,
    );
  },
);

export const getUserDetailById = createAsyncThunk(
  "users/getById",
  async (userId, { rejectWithValue }) => {
    return fetchAPI(`/api/admin/users/${userId}`, {}, rejectWithValue);
  },
);

export const resetUserPassword = createAsyncThunk(
  "users/resetPassword",
  async ({ userId, password }, { rejectWithValue }) => {
    return fetchAPI(
      `/api/admin/users/${userId}/reset-password`,
      {
        method: "POST",
        body: JSON.stringify({
          newPassword: password,
        }),
      },
      rejectWithValue,
    );
  },
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ userId, ...data }, { rejectWithValue }) => {
    return fetchAPI(
      `/api/admin/update-regular-user/${userId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      rejectWithValue,
    );
  },
);

const initialState = {
  users: [],
  loading: false,
  error: null,

  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  },

  selectedUser: null,
  selectedUserLoading: false,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;

        const { data, page, pageSize, total, totalPages } = action.payload;

        state.users = data;
        state.pagination = { page, pageSize, total, totalPages };
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
      })

      .addCase(getUserDetailById.pending, (state) => {
        state.selectedUserLoading = true;
      })
      .addCase(getUserDetailById.fulfilled, (state, action) => {
        state.selectedUserLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserDetailById.rejected, (state) => {
        state.selectedUserLoading = false;
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.users.findIndex((u) => u.id === updated.id);
        if (index !== -1) state.users[index] = updated;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
