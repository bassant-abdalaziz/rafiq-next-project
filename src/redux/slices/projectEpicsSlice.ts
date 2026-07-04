import { getProjectEpics } from "@/actions/project";
import { ProjectEpic } from "@/types/project";
import { getErrorMessage } from "@/utils/helpers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type FetchProjectEpicsArgs = {
  projectId: string;
  limit: number;
  offset: number;
  mode?: "append" | "replace";
};

type FetchProjectEpicsResponse = {
  projectEpics: ProjectEpic[];
  totalCount: number;
  projectId: string;
};

type ProjectEpicsState = {
  projectEpics: ProjectEpic[];
  totalCount: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  loadMoreError: string | null;
  hasFetched: boolean;
};

const initialState: ProjectEpicsState = {
  projectEpics: [],
  totalCount: 0,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  loadMoreError: null,
  hasFetched: false,
};

export const fetchAllProjectEpics = createAsyncThunk<
  FetchProjectEpicsResponse,
  FetchProjectEpicsArgs,
  { rejectValue: string }
>(
  "projectEpics/fetchAllProjectEpics",
  async ({ projectId, limit, offset }, { rejectWithValue }) => {
    try {
      const response = await getProjectEpics(projectId, limit, offset);

      return {
        ...response,
        projectId,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const projectEpicsSlice = createSlice({
  name: "projectEpics",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProjectEpics.pending, (state, action) => {
        const mode = action.meta.arg.mode ?? "replace";

        if (mode === "append") {
          state.isLoadingMore = true;
          state.loadMoreError = null;
        } else {
          state.isLoading = true;
          state.error = null;
        }
      })

      .addCase(fetchAllProjectEpics.fulfilled, (state, action) => {
        const mode = action.meta.arg.mode ?? "replace";

        state.isLoading = false;
        state.isLoadingMore = false;
        state.error = null;
        state.loadMoreError = null;
        state.hasFetched = true;
        state.totalCount = action.payload.totalCount;

        if (mode === "append") {
          state.projectEpics = [...state.projectEpics, ...action.payload.projectEpics];
        } else {
          state.projectEpics = action.payload.projectEpics;
        }
      })

      .addCase(fetchAllProjectEpics.rejected, (state, action) => {
        const mode = action.meta.arg.mode ?? "replace";

        if (mode === "append") {
          state.isLoadingMore = false;
          state.loadMoreError = action.payload ?? "Failed to load more epics";
        } else {
          state.isLoading = false;
          state.projectEpics = [];
          state.totalCount = 0;
          state.error = action.payload ?? "Failed to load epics";
          state.hasFetched = true;
        }
      });
  },
});

export default projectEpicsSlice.reducer;
