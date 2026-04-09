import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getCategories = createAsyncThunk("category/get", async () => {
  const resonse = await fetch(`${BASE_URL}/api/Product/getallcategory`);
  return resonse.json();
});

export const manageCategory = createAsyncThunk(
  "category/manage",
  async (data) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}/api/Product/manage-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      return result;
    } catch (error) {
      return isRejectedWithValue("Server error");
    }
  },
);

export const deleteCategory = createAsyncThunk(
  "workspace/deleteCategory",
  async ({ categoryId }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${BASE_URL}/api/Product/category/${categoryId}`, {
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

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder

      .addCase(getCategories.pending, (state) => {
        state.loading = true;
      })

      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c.id !== action.payload,
        );
      });
  },
});

export default categorySlice.reducer;
