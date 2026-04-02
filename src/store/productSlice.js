import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getProducts = createAsyncThunk(
  "product/get",
  async () => {
    const response = await fetch(
      `${BASE_URL}/api/Product/getallproduct`
    );

    const data = await response.json();
    return data;
  }
);

export const manageProduct = createAsyncThunk(
  "product/manage",
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/api/Product/manage-product`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue("Server error");
    }
  }
);

const productSlice = createSlice({
  name: "product",

  initialState: {
    products: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state) => {
        state.loading = false;
      })

      .addCase(manageProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(manageProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(manageProduct.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default productSlice.reducer;