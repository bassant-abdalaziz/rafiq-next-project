import { getProjectByID, getProjects } from "@/actions/project";
import { Project } from "@/types/project";
import { getErrorMessage } from "@/utils/helpers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type FetchProjectsArgs = {
  limit: number;
  offset: number;
  mode?: "append" | "replace";
};

type FetchProjectsResponse = {
  projects: Project[];
  totalCount: number;
};

type FetchProjectArgs = {
  projectId: string;
};

type FetchProjectResponse = {
  project: Project;
};

type ProjectsState = {
  projects: Project[];
  totalCount: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  loadMoreError: string | null;
  hasFetched: boolean;
  project: Project | null;
  projectLoading: boolean;
  projectError: string | null;
};

const initialState: ProjectsState = {
  projects: [],
  totalCount: 0,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  loadMoreError: null,
  hasFetched: false,
  project: null,
  projectLoading: false,
  projectError: null,
};

export const fetchAllProjects = createAsyncThunk<
  FetchProjectsResponse,
  FetchProjectsArgs,
  { rejectValue: string }
>("projects/fetchAllProjects", async ({ limit, offset }, { rejectWithValue }) => {
  try {
    const response = await getProjects(limit, offset);

    return response;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

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
      .addCase(fetchAllProjects.pending, (state, action) => {
        const mode = action.meta.arg.mode ?? "replace";

        if (mode === "append") {
          state.isLoadingMore = true;
          state.loadMoreError = null;
        } else {
          state.isLoading = true;
          state.error = null;
        }
      })

      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        const mode = action.meta.arg.mode ?? "replace";

        state.isLoading = false;
        state.isLoadingMore = false;
        state.error = null;
        state.loadMoreError = null;
        state.hasFetched = true;
        state.totalCount = action.payload.totalCount;

        if (mode === "append") {
          state.projects = [...state.projects, ...action.payload.projects];
        } else {
          state.projects = action.payload.projects;
        }
      })

      .addCase(fetchAllProjects.rejected, (state, action) => {
        const mode = action.meta.arg.mode ?? "replace";

        if (mode === "append") {
          state.isLoadingMore = false;
          state.loadMoreError = action.payload ?? "Failed to load more projects";
        } else {
          state.isLoading = false;
          state.projects = [];
          state.totalCount = 0;
          state.error = action.payload ?? "Failed to load projects";
          state.hasFetched = true;
        }
      })
      .addCase(fetchProjectByID.pending, (state, action) => {
        state.projectLoading = true;
        state.projectError = null;
      })

      .addCase(fetchProjectByID.fulfilled, (state, action) => {
        state.projectLoading = false;
        state.projectError = null;
        state.project = action.payload.project;
      })

      .addCase(fetchProjectByID.rejected, (state, action) => {
        state.projectLoading = false;
        state.project = null;
        state.projectError = action.payload ?? "Failed to load project";
      });
  },
});

export default projectsSlice.reducer;
