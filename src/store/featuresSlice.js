import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getFeaturesById = createAsyncThunk(
  "features/get",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/api/Product/getFeaturesByProductID?productId=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        return rejectWithValue("Failed to fetch features");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
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

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue("Server error");
    }
  },
);

export const deleteFeature = createAsyncThunk(
  "workspace/deleteFeature",
  async ({ featureId }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${BASE_URL}/api/Product/feature/${featureId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const featuresSlice = createSlice({
  name: "features",
  initialState: {
    features: [],
    loading: false,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getFeaturesById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeaturesById.fulfilled, (state, action) => {
        state.loading = false;
        state.features = action.payload;
      })
      .addCase(getFeaturesById.rejected, (state) => {
        state.loading = false;
      })

      .addCase(deleteFeature.fulfilled, (state, action) => {
        state.features = state.features.filter((f) => f.id !== action.payload);
      });
  },
});

export default featuresSlice.reducer;
