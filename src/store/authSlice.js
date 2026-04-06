import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getCurrentUser = createAsyncThunk(
  "auth/currentUser",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const ID = localStorage.getItem("userId");

      const response = await fetch(
        `${BASE_URL}/api/admin/getAdminDetails/${ID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        return thunkAPI.rejectWithValue("Failed to fetch user");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/api/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("userId", result.userId);
      }

      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const initialState = {
  token: localStorage.getItem("token") || null,
  email: null,
  name: null,
  userId: localStorage.getItem("userId") || null,
  role: null,
  plan: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.email = null;
      state.role = null;
      state.plan = null;

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.email = action.payload.email;
        state.role = action.payload.role;
        state.plan = action.payload.plan;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;

        const user = action.payload.data;

        state.userId = user.id;
        state.email = user.user_email;
        state.name = user.user_name;
        state.role = user.user_role;
      })

      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
