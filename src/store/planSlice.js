import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllPlans = createAsyncThunk(
  "plans/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/Product/getallplans`);

      if (!response.ok) {
        return rejectWithValue("Failed to fetch plans");
      }

      const data = await response.json();
      return data.data;
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
export const addPricing = createAsyncThunk(
  "plans/addPricing",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/api/Product/manage-plan-price`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            planId: formData.planId,
            planBillingCycle: formData.planBillingCycle,
            planAmount: formData.planAmount,
          }),
        },
      );

      const data = await response.json();
      console.log("Pricing add RESPONSE:", data);

      if (!response.ok) {
        return rejectWithValue(data?.message || "Price add failed");
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
export const addFeature = createAsyncThunk(
  "plans/addFeature",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/api/Product/manage-plan-feature`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            planId: formData.planId,
            featureId: formData.featureId,
            featureValue: formData.featureValue,
          }),
        },
      );

      const data = await response.json();
      console.log("Feature add RESPONSE:", data);

      if (!response.ok) {
        return rejectWithValue(data?.message || "Feature add failed");
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const getPlanById = createAsyncThunk(
  "plans/getById",
  async ({ planId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/api/Product/getPlanDetails/${planId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        return rejectWithValue("Failed to fetch plan details");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const planSlice = createSlice({
  name: "plans",
  initialState: {
    plans: [],
    selectedPlan: null,
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
      })

      .addCase(addPricing.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addPricing.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addPricing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addFeature.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addFeature.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addFeature.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getPlanById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPlan = action.payload;
      })
      .addCase(getPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default planSlice.reducer;
