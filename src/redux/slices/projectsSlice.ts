import { getProjects } from "@/actions/project";
import { Project } from "@/types/project";
import { getErrorMessage } from "@/utils/helpers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type FetchProjectsArgs = {
  limit: number;
  offset: number;
};

type FetchProjectsResponse = {
  projects: Project[];
  totalCount: number;
};

type ProjectsState = {
  projects: Project[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  hasFetched: boolean;
};

const initialState: ProjectsState = {
  projects: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  currentPage: 1,
  hasFetched: false,
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

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload.projects;
        state.totalCount = action.payload.totalCount;
        state.error = null;
        state.hasFetched = true;
      })

      .addCase(fetchAllProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.projects = [];
        state.totalCount = 0;
        state.error = action.payload ?? "Failed to load projects";
      });
  },
});

export const { setCurrentPage } = projectsSlice.actions;

export default projectsSlice.reducer;
