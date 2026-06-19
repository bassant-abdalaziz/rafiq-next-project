import { getProjectMembers } from "@/actions/project";
import { Member } from "@/types/project";
import { getErrorMessage } from "@/utils/helpers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type FetchProjectMembersArgs = {
  projectId: string;
};

type ProjectMembersState = {
  projectMembers: Member[];
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
};

const initialState: ProjectMembersState = {
  projectMembers: [],
  isLoading: false,
  error: null,
  hasFetched: false,
};

export const fetchAllProjectMembers = createAsyncThunk<
  Member[],
  FetchProjectMembersArgs,
  { rejectValue: string }
>(
  "projectMembers/fetchAllProjectMembers",
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const response = await getProjectMembers(projectId);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const projectMembersSlice = createSlice({
  name: "projectMembers",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProjectMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchAllProjectMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projectMembers = action.payload;
        state.error = null;
        state.hasFetched = true;
      })

      .addCase(fetchAllProjectMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.projectMembers = [];
        state.error = action.payload ?? "Failed to load project members. Please try again.";
        state.hasFetched = true;
      });
  },
});

export default projectMembersSlice.reducer;