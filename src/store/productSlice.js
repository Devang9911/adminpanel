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

export const getProducts = createAsyncThunk(
  "product/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/Product/getallproduct`);
      if (!response.ok) return rejectWithValue(await parseError(response));
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error.message || "Network error — could not load products.",
      );
    }
  },
);

export const manageProduct = createAsyncThunk(
  "product/manage",
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/Product/manage-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) return rejectWithValue(await parseError(response));
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error.message || "Network error — could not save product.",
      );
    }
  },
);

export const deleteModule = createAsyncThunk(
  "workspace/deleteModule",
  async ({ moduleId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/Product/module/${moduleId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) return rejectWithValue(await parseError(response));
      return moduleId;
    } catch (err) {
      return rejectWithValue(
        err.message || "Network error — could not delete module.",
      );
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState: { products: [], loading: false, error: null },
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(manageProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(manageProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(manageProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteModule.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteModule.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteModule.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
