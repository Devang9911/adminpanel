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

      const response1 = await fetch(`${BASE_URL}/api/Product/manage-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: Number(formData.product),
          categoryId: Number(formData.category),
          planName: formData.planName,
          planDescription: formData.description,
          isActive: true,
        }),
      });

      const planData = await response1.json();
      console.log(planData)

      if (!response1.ok) {
        return rejectWithValue("Plan create failed");
      }

      const planId = planData.planId || planData.id;
      console.log("PLAN ID", planId);
      console.log("BILLING", formData.billing);
      console.log("AMOUNT", formData.amount);

      const billingRes = await fetch(
        `${BASE_URL}/api/Product/manage-plan-price`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            planId: Number(planId),
            planBillingCycle: formData.billing,
            planAmount: Number(formData.amount),
          }),
        },
      );

      if (!billingRes.ok) {
        return rejectWithValue("Billing failed");
      }

      const features = formData.features || {};

      for (const featureId in features) {
        const value = features[featureId];

        if (!value) continue;

        const featureRes = await fetch(
          `${BASE_URL}/api/Product/manage-plan-feature`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              planId: Number(planId),
              featureId: Number(featureId),
              featureValue: value,
            }),
          },
        );

        if (!featureRes.ok) {
          return rejectWithValue("Feature add failed");
        }
      }

      return planId;
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
