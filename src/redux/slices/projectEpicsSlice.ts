import { getProjectEpicByID, getProjectEpics, updateEpic } from "@/actions/project";
import { ProjectEpic, UpdateEpicPayload } from "@/types/project";
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

type FetchProjectEpicByIDArgs = {
  projectId: string;
  epicId: string;
};

type UpdateProjectEpicArgs = {
  projectId: string;
  epicId: string;
  payload: UpdateEpicPayload;
};

type ProjectEpicsState = {
  projectEpics: ProjectEpic[];
  totalCount: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  loadMoreError: string | null;
  hasFetched: boolean;
  fetchedProjectId: string | null;

  selectedEpic: ProjectEpic | null;
  selectedEpicLoading: boolean;
  selectedEpicError: string | null;
};

const initialState: ProjectEpicsState = {
  projectEpics: [],
  totalCount: 0,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  loadMoreError: null,
  hasFetched: false,
  fetchedProjectId: null,

  selectedEpic: null,
  selectedEpicLoading: false,
  selectedEpicError: null,
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

export const fetchProjectEpicByID = createAsyncThunk<
  ProjectEpic,
  FetchProjectEpicByIDArgs,
  { rejectValue: string }
>("projectEpics/fetchProjectEpicByID", async ({ projectId, epicId }, { rejectWithValue }) => {
  try {
    return await getProjectEpicByID(projectId, epicId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateProjectEpic = createAsyncThunk<
  ProjectEpic,
  UpdateProjectEpicArgs,
  { rejectValue: string }
>("projectEpics/updateProjectEpic", async ({ projectId, epicId, payload }, { rejectWithValue }) => {
  try {
    return await updateEpic(projectId, epicId, payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const projectEpicsSlice = createSlice({
  name: "projectEpics",
  initialState,

  reducers: {
    clearSelectedEpic: (state) => {
      state.selectedEpic = null;
      state.selectedEpicLoading = false;
      state.selectedEpicError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProjectEpics.pending, (state, action) => {
        const mode = action.meta.arg.mode ?? "replace";
        const projectId = action.meta.arg.projectId;

        if (mode === "append") {
          state.isLoadingMore = true;
          state.loadMoreError = null;
        } else {
          state.isLoading = true;
          state.error = null;

          /**
           * Clear stale epics when loading a different project,
           * so the UI does not briefly display epics from the previous project.
           */
          if (state.fetchedProjectId !== projectId) {
            state.projectEpics = [];
            state.totalCount = 0;
            state.hasFetched = false;
          }
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
        state.fetchedProjectId = action.payload.projectId;

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
          state.fetchedProjectId = action.meta.arg.projectId;
        }
      })

      .addCase(fetchProjectEpicByID.pending, (state) => {
        state.selectedEpicLoading = true;
        state.selectedEpicError = null;
        state.selectedEpic = null;
      })

      .addCase(fetchProjectEpicByID.fulfilled, (state, action) => {
        state.selectedEpicLoading = false;
        state.selectedEpicError = null;
        state.selectedEpic = action.payload;
      })

      .addCase(fetchProjectEpicByID.rejected, (state, action) => {
        state.selectedEpicLoading = false;
        state.selectedEpic = null;
        state.selectedEpicError = action.payload ?? "Failed to load epic details";
      })

      .addCase(updateProjectEpic.fulfilled, (state, action) => {
        state.selectedEpic = action.payload;

        const epicIndex = state.projectEpics.findIndex((epic) => epic.id === action.payload.id);

        if (epicIndex !== -1) {
          state.projectEpics[epicIndex] = action.payload;
        }
      });
  },
});

export const { clearSelectedEpic } = projectEpicsSlice.actions;

export default projectEpicsSlice.reducer;
