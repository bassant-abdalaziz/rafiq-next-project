import { getProjectByID } from "@/actions/project";
import { Project } from "@/types/project";
import { getErrorMessage } from "@/utils/helpers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type FetchProjectArgs = {
  projectId: string;
};

type FetchProjectResponse = {
  project: Project;
};

type ProjectsState = {
  project: Project | null;
  projectLoading: boolean;
  projectError: string | null;
  isProjectFetched: boolean;
  fetchedProjectId: string | null;
};

const initialState: ProjectsState = {
  project: null,
  projectLoading: false,
  projectError: null,
  isProjectFetched: false,
  fetchedProjectId: null,
};

export const fetchProjectByID = createAsyncThunk<
  FetchProjectResponse,
  FetchProjectArgs,
  { rejectValue: string }
>("projects/fetchProjectByID", async ({ projectId }, { rejectWithValue }) => {
  try {
    const response = await getProjectByID(projectId);

    return {
      project: response.data,
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectByID.pending, (state, action) => {
        state.projectLoading = true;
        state.projectError = null;

        /**
         * Clear stale project details when loading a different project,
         * so the UI does not briefly display details from the previous project.
         */
        if (state.fetchedProjectId !== action.meta.arg.projectId) {
          state.project = null;
          state.isProjectFetched = false;
        }
      })

      .addCase(fetchProjectByID.fulfilled, (state, action) => {
        state.projectLoading = false;
        state.projectError = null;
        state.project = action.payload.project;
        state.isProjectFetched = true;
        state.fetchedProjectId = action.meta.arg.projectId;
      })

      .addCase(fetchProjectByID.rejected, (state, action) => {
        state.projectLoading = false;
        state.project = null;
        state.projectError = action.payload ?? "Failed to load project";

        /**
         * Mark this project request as completed even if it failed,
         * so the app can show the error state instead of retrying forever.
         */
        state.isProjectFetched = true;
        state.fetchedProjectId = action.meta.arg.projectId;
      });
  },
});

export default projectsSlice.reducer;
