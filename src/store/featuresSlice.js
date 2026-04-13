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

export const getFeaturesById = createAsyncThunk(
  "features/get",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/Product/getFeaturesByProductID?productId=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) return rejectWithValue(await parseError(response));
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error.message || "Network error — could not load features.",
      );
    }
  },
);

export const manageFeatures = createAsyncThunk(
  "features/manage",
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/Product/manage-product-feature`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        },
      );
      if (!response.ok) return rejectWithValue(await parseError(response));
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error.message || "Network error — could not save feature.",
      );
    }
  },
);

export const deleteFeature = createAsyncThunk(
  "workspace/deleteFeature",
  async ({ featureId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/Product/feature/${featureId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) return rejectWithValue(await parseError(response));
      return featureId;
    } catch (err) {
      return rejectWithValue(
        err.message || "Network error — could not delete feature.",
      );
    }
  },
);

const featuresSlice = createSlice({
  name: "features",
  initialState: { features: [], loading: false, error: null },
  reducers: {
    clearFeaturesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeaturesById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeaturesById.fulfilled, (state, action) => {
        state.loading = false;
        state.features = action.payload;
      })
      .addCase(getFeaturesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(manageFeatures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(manageFeatures.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(manageFeatures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteFeature.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteFeature.fulfilled, (state, action) => {
        state.features = state.features.filter((f) => f.id !== action.payload);
      })
      .addCase(deleteFeature.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearFeaturesError } = featuresSlice.actions;
export default featuresSlice.reducer;
