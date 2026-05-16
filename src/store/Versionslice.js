import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || data?.error || "Something went wrong");
  }

  return data;
};

export const getChangelog = createAsyncThunk(
  "version/getChangelog",
  async (productId, { rejectWithValue }) => {
    try {
      const data = await fetchWithAuth(`/api/Version/changelog/${productId}`);
      return Array.isArray(data) ? data : data?.data || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const getChangelogById = createAsyncThunk(
  "version/getChangelogById",
  async ({ productId, versionId }, { rejectWithValue }) => {
    try {
      const data = await fetchWithAuth(
        `/api/Version/changelog/${productId}/${versionId}`,
      );
      return data?.data || data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const createChangelog = createAsyncThunk(
  "version/createChangelog",
  async ({ productId, payload }, { rejectWithValue }) => {
    try {
      const data = await fetchWithAuth(
        `/api/Version/changelog/${productId}/create`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );
      return data?.data || data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateChangelog = createAsyncThunk(
  "version/updateChangelog",
  async ({ productId, versionId, payload }, { rejectWithValue }) => {
    try {
      const data = await fetchWithAuth(
        `/api/Version/changelog/${productId}/update/${versionId}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        },
      );
      return data?.data || data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const deleteChangelog = createAsyncThunk(
  "version/deleteChangelog",
  async ({ productId, versionId }, { rejectWithValue }) => {
    try {
      await fetchWithAuth(
        `/api/Version/changelog/${productId}/delete/${versionId}`,
        { method: "DELETE" },
      );
      return versionId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const getWhatsNew = createAsyncThunk(
  "version/getWhatsNew",
  async (productId, { rejectWithValue }) => {
    try {
      const data = await fetchWithAuth(`/api/Version/getWhatsNew/${productId}`);
      return data?.data || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const createWhatsNew = createAsyncThunk(
  "version/createWhatsNew",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await fetchWithAuth(`/api/Version/add`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return data?.data || data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateWhatsNew = createAsyncThunk(
  "version/updateWhatsNew",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const data = await fetchWithAuth(`/api/Version/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      return data?.data || data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const deleteWhatsNew = createAsyncThunk(
  "version/deleteWhatsNew",
  async (id, { rejectWithValue }) => {
    try {
      await fetchWithAuth(`/api/Version/delete/${id}`, { method: "DELETE" });
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const versionSlice = createSlice({
  name: "version",
  initialState: {
    changelog: [],
    whatsNew: [],
    changelogLoading: false,
    whatsNewLoading: false,
    error: null,
  },
  reducers: {
    clearVersionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChangelog.pending, (state) => {
        state.changelogLoading = true;
        state.error = null;
      })
      .addCase(getChangelog.fulfilled, (state, action) => {
        state.changelogLoading = false;
        state.changelog = action.payload;
      })
      .addCase(getChangelog.rejected, (state, action) => {
        state.changelogLoading = false;
        state.error = action.payload;
      })

      .addCase(createChangelog.pending, (state) => {
        state.changelogLoading = true;
        state.error = null;
      })
      .addCase(createChangelog.fulfilled, (state, action) => {
        state.changelogLoading = false;
        if (action.payload) state.changelog.unshift(action.payload);
      })
      .addCase(createChangelog.rejected, (state, action) => {
        state.changelogLoading = false;
        state.error = action.payload;
      })

      .addCase(updateChangelog.pending, (state) => {
        state.changelogLoading = true;
        state.error = null;
      })
      .addCase(updateChangelog.fulfilled, (state, action) => {
        state.changelogLoading = false;
        const updated = action.payload;
        if (updated) {
          state.changelog = state.changelog.map((e) =>
            e.id === updated.id ? updated : e,
          );
        }
      })
      .addCase(updateChangelog.rejected, (state, action) => {
        state.changelogLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteChangelog.pending, (state) => {
        state.changelogLoading = true;
      })
      .addCase(deleteChangelog.fulfilled, (state, action) => {
        state.changelogLoading = false;
        state.changelog = state.changelog.filter(
          (e) => e.id !== action.payload,
        );
        state.whatsNew = state.whatsNew.filter(
          (w) => w.versionId !== action.payload,
        );
      })
      .addCase(deleteChangelog.rejected, (state, action) => {
        state.changelogLoading = false;
        state.error = action.payload;
      })

      .addCase(getWhatsNew.pending, (state) => {
        state.whatsNewLoading = true;
        state.error = null;
      })
      .addCase(getWhatsNew.fulfilled, (state, action) => {
        state.whatsNewLoading = false;
        state.whatsNew = action.payload;
      })
      .addCase(getWhatsNew.rejected, (state, action) => {
        state.whatsNewLoading = false;
        state.error = action.payload;
      })

      .addCase(createWhatsNew.pending, (state) => {
        state.whatsNewLoading = true;
        state.error = null;
      })
      .addCase(createWhatsNew.fulfilled, (state, action) => {
        state.whatsNewLoading = false;
        if (action.payload) state.whatsNew.unshift(action.payload);
      })
      .addCase(createWhatsNew.rejected, (state, action) => {
        state.whatsNewLoading = false;
        state.error = action.payload;
      })

      .addCase(updateWhatsNew.pending, (state) => {
        state.whatsNewLoading = true;
        state.error = null;
      })
      .addCase(updateWhatsNew.fulfilled, (state, action) => {
        state.whatsNewLoading = false;
        const updated = action.payload;
        if (updated) {
          state.whatsNew = state.whatsNew.map((w) =>
            w.id === updated.id ? updated : w,
          );
        }
      })
      .addCase(updateWhatsNew.rejected, (state, action) => {
        state.whatsNewLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteWhatsNew.pending, (state) => {
        state.whatsNewLoading = true;
      })
      .addCase(deleteWhatsNew.fulfilled, (state, action) => {
        state.whatsNewLoading = false;
        state.whatsNew = state.whatsNew.filter((w) => w.id !== action.payload);
      })
      .addCase(deleteWhatsNew.rejected, (state, action) => {
        state.whatsNewLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVersionError } = versionSlice.actions;
export default versionSlice.reducer;
