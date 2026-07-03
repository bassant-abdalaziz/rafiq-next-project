import { getProjectMembers } from "@/actions/project";
import { Member } from "@/types/project";
import { getErrorMessage } from "@/utils/helpers";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type FetchProjectMembersArgs = {
  projectId: string;
};

type ProjectMembersState = {
  projectMembers: Member[];
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchedProjectId: string | null;
};

const initialState: ProjectMembersState = {
  projectMembers: [],
  isLoading: false,
  error: null,
  hasFetched: false,
  fetchedProjectId: null,
};

export const fetchAllProjectMembers = createAsyncThunk<
  Member[],
  FetchProjectMembersArgs,
  { rejectValue: string }
>("projectMembers/fetchAllProjectMembers", async ({ projectId }, { rejectWithValue }) => {
  try {
    const response = await getProjectMembers(projectId);

    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const projectMembersSlice = createSlice({
  name: "projectMembers",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProjectMembers.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;

        /**
         * If we are fetching members for a different project,
         * clear the existing members to avoid showing stale members
         * from the previously selected project while the new request is loading.
         */
       
        if (state.fetchedProjectId !== action.meta.arg.projectId) {
          state.projectMembers = [];
        }
      })

      .addCase(fetchAllProjectMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projectMembers = action.payload;
        state.error = null;
        state.hasFetched = true;
        state.fetchedProjectId = action.meta.arg.projectId;
      })

      .addCase(fetchAllProjectMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.projectMembers = [];
        state.error = action.payload ?? "Failed to load project members. Please try again.";
        state.hasFetched = true;
        state.fetchedProjectId = action.meta.arg.projectId;
      });
  },
});

export default projectMembersSlice.reducer;
