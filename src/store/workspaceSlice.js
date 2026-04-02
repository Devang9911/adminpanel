import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem("token");

const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

//get all the workspace list
export const getAllWorkspace = createAsyncThunk(
  "workspace/getAll",
  async (filters, { rejectWithValue }) => {
    try {
      const { page, pageSize } = filters;
      const res = await fetch(
        `${BASE_URL}/api/admin/getAllWorkspaces?page=${page}&pageSize=${pageSize}`,
        {
          headers: authHeader(),
        },
      );

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

//get individual workspace details by group id
export const getWorkspaceDetails = createAsyncThunk(
  "workspace/details",
  async (groupId, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/admin/getWorkspaceDetails/${groupId}`,
        {
          headers: authHeader(),
        },
      );

      const data = await res.json();
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

//get individual workspace member by group id
export const getWorkspaceMembers = createAsyncThunk(
  "workspace/members",
  async (groupId, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/admin/getWorkspaceMembers/${groupId}`,
        {
          headers: authHeader(),
        },
      );

      const data = await res.json();
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

//add member
export const addMember = createAsyncThunk(
  "workspace/addMember",
  async ({ groupId, body }, { dispatch, rejectWithValue }) => {
    try {
      await fetch(`${BASE_URL}/api/admin/workspace-add-members/${groupId}`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(body),
      });

      dispatch(getWorkspaceMembers(groupId));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

//update member
export const updateMember = createAsyncThunk(
  "workspace/updateMember",
  async ({ groupId, userId, body }, { dispatch, rejectWithValue }) => {
    try {
      await fetch(
        `${BASE_URL}/api/admin/workspace-update-members/${groupId}/${userId}`,
        {
          method: "PUT",
          headers: authHeader(),
          body: JSON.stringify(body),
        },
      );

      dispatch(getWorkspaceMembers(groupId));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

//remove from workspace
export const removeMember = createAsyncThunk(
  "workspace/removeMember",
  async ({ groupId, userId }, { dispatch, rejectWithValue }) => {
    try {
      await fetch(
        `${BASE_URL}/api/admin/workspace-remove-members/${groupId}/${userId}`,
        {
          method: "DELETE",
          headers: authHeader(),
        },
      );

      dispatch(getWorkspaceMembers(groupId));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const workspaceSlice = createSlice({
  name: "workspace",

  initialState: {
    list: [],
    members: [],
    details: null,
    loadingList: false,
    loadingMembers: false,
    loadingDetails: false,
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  },

  extraReducers: (builder) => {
    builder

      .addCase(getAllWorkspace.pending, (state) => {
        state.loadingList = true;
      })
      .addCase(getAllWorkspace.fulfilled, (state, action) => {
        state.loadingList = false;
        state.list = action.payload.data;
        state.page = action.payload.page;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })

      .addCase(getAllWorkspace.rejected, (state) => {
        state.loadingList = false;
      })

      .addCase(getWorkspaceMembers.pending, (state) => {
        state.loadingMembers = true;
      })
      .addCase(getWorkspaceMembers.fulfilled, (state, action) => {
        state.loadingMembers = false;
        state.members = action.payload;
      })
      .addCase(getWorkspaceMembers.rejected, (state) => {
        state.loadingMembers = false;
      })

      .addCase(getWorkspaceDetails.pending, (state) => {
        state.loadingDetails = true;
      })
      .addCase(getWorkspaceDetails.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.details = action.payload;
      })
      .addCase(getWorkspaceDetails.rejected, (state) => {
        state.loadingDetails = false;
      });
  },
});

export default workspaceSlice.reducer;
