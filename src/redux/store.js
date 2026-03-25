import { configureStore } from "@reduxjs/toolkit";
import activeSectionReducer from "./sidebar/sidebarSlice";
import userReducer from "./userprofile/userprofileSlice";

export const store = configureStore({
  reducer: {
    activeSection: activeSectionReducer,
    user : userReducer,
  },
});
