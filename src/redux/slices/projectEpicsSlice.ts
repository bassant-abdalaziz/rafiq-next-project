import { getProjectEpicByID, updateEpic } from "@/actions/project";
import { ProjectEpic, UpdateEpicPayload } from "@/types/project";
import { getErrorMessage } from "@/utils/helpers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
  selectedEpic: ProjectEpic | null;
  selectedEpicLoading: boolean;
  selectedEpicError: string | null;

  isUpdatingEpic: boolean;
  updateEpicError: string | null;
};

const initialState: ProjectEpicsState = {
  selectedEpic: null,
  selectedEpicLoading: false,
  selectedEpicError: null,

  isUpdatingEpic: false,
  updateEpicError: null,
};

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
      state.isUpdatingEpic = false;
      state.updateEpicError = null;
    },
  },

  extraReducers: (builder) => {
    builder
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

      .addCase(updateProjectEpic.pending, (state) => {
        state.isUpdatingEpic = true;
        state.updateEpicError = null;
      })

      .addCase(updateProjectEpic.fulfilled, (state, action) => {
        state.isUpdatingEpic = false;
        state.updateEpicError = null;
        state.selectedEpic = action.payload;
      })

      .addCase(updateProjectEpic.rejected, (state, action) => {
        state.isUpdatingEpic = false;
        state.updateEpicError = action.payload ?? "Failed to update epic";
      });
  },
});

export const { clearSelectedEpic } = projectEpicsSlice.actions;

export default projectEpicsSlice.reducer;