import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllPlans = createAsyncThunk(
  "plans/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/Product/getallplan`);

      if (!response.ok) {
        return rejectWithValue("Failed to fetch plans");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const createPlan = createAsyncThunk(
  "plans/createPlan",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/api/Product/manage-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: Number(formData.productId),
          categoryId: Number(formData.categoryId),
          planName: formData.planName,
          planDescription: formData.planDescription,
          isActive: true,
        }),
      });

      const data = await response.json();
      console.log("CREATE PLAN RESPONSE:", data);

      if (!response.ok) {
        return rejectWithValue(data?.message || "Plan create failed");
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const planSlice = createSlice({
  name: "plans",
  initialState: {
    plans: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAllPlans.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(getAllPlans.rejected, (state) => {
        state.loading = false;
      })

      .addCase(createPlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPlan.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default planSlice.reducer;
