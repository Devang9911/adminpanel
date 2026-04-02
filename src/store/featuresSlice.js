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
      });
  },
});

export default featuresSlice.reducer;
