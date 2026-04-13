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

export const getCategories = createAsyncThunk(
  "category/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/Product/getallcategory`);
      if (!response.ok) return rejectWithValue(await parseError(response));
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error.message || "Network error — could not load categories.",
      );
    }
  },
);

export const manageCategory = createAsyncThunk(
  "category/manage",
  async (data, { rejectWithValue }) => {
    // ← fixed: was using wrong import
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/Product/manage-category`, {
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
        error.message || "Network error — could not save category.",
      );
    }
  },
);

export const deleteCategory = createAsyncThunk(
  "workspace/deleteCategory",
  async ({ categoryId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/Product/category/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) return rejectWithValue(await parseError(response));
      return categoryId;
    } catch (err) {
      return rejectWithValue(
        err.message || "Network error — could not delete category.",
      );
    }
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState: { categories: [], loading: false, error: null },
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(manageCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(manageCategory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(manageCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteCategory.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c.id !== action.payload,
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
