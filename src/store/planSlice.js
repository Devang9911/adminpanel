import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const parseError = async (response) => {
  try {
    const data = await response.json();
    const raw = data?.message || "";

    if (
      raw.toLowerCase().includes("linked") ||
      raw.toLowerCase().includes("reference") ||
      raw.toLowerCase().includes("constraint") ||
      raw.toLowerCase().includes("foreign key")
    ) {
      return "This item can't be deleted because it's being used elsewhere. Remove the dependency first, then try again.";
    }

    if (response.status === 403)
      return (
        raw ||
        "Action not allowed — this item may already exist or conflict with existing data."
      );
    if (response.status === 409)
      return raw || "Conflict — a duplicate entry already exists.";

    return raw || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
};

export const getAllPlans = createAsyncThunk(
  "plans/get",
  async (filters, { rejectWithValue }) => {
    try {
      const { search = "", status = "", module = "", category = "" } = filters;
      const query = new URLSearchParams({
        search,
        status: status === "all" ? "" : status,
        module: module === "all" ? "" : module,
        category: category === "all" ? "" : category,
      });
      const response = await fetch(
        `${BASE_URL}/api/Product/getallplans?${query.toString()}`,
      );
      if (!response.ok) return rejectWithValue(await parseError(response));
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Network error — please check your connection.",
      );
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
      if (!response.ok) return rejectWithValue(await parseError(response));
      return await response.json();
    } catch (err) {
      return rejectWithValue(
        err.message || "Network error — could not create plan.",
      );
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
          body: JSON.stringify(formData),
        },
      );
      if (!response.ok) return rejectWithValue(await parseError(response));
      return await response.json();
    } catch (err) {
      return rejectWithValue(
        err.message || "Network error — could not add pricing.",
      );
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
          body: JSON.stringify(formData),
        },
      );
      if (!response.ok) return rejectWithValue(await parseError(response));
      return await response.json();
    } catch (err) {
      return rejectWithValue(
        err.message || "Network error — could not add feature.",
      );
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
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) return rejectWithValue(await parseError(response));
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Network error — could not load plan details.",
      );
    }
  },
);

const planSlice = createSlice({
  name: "plans",
  initialState: {
    plans: [],
    selectedPlan: null,
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {
    clearPlanError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(getAllPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlan.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addPricing.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(addPricing.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(addPricing.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(addFeature.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(addFeature.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(addFeature.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(getPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
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

export const { clearPlanError } = planSlice.actions;
export default planSlice.reducer;
