import { getCurrentUser } from "@/actions/auth";
import { LoginResponse } from "@/types/auth";
import { getErrorMessage } from "@/utils/helpers";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

type User = LoginResponse["user"];

type UserState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk<User, void, { rejectValue: string }>(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await getCurrentUser();

      return user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })

      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.payload || "Failed to fetch user.";
      });
  },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
