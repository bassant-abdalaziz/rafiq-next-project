import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import projectsReducer from "./slices/projectsSlice";
import projectMembersReducer from "./slices/projectMembersSlice";
import projectEpicsReducer from "./slices/projectEpicsSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      projects: projectsReducer,
      projectMembers: projectMembersReducer,
      projectEpics: projectEpicsReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
