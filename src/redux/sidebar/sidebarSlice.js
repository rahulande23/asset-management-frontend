import { createSlice } from "@reduxjs/toolkit";

const activeSectionSlice = createSlice({
  name: "activeSection",
  initialState: {
    value: "dashboard",
  },
  reducers: {
    setActiveSection: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setActiveSection } = activeSectionSlice.actions;
export default activeSectionSlice.reducer;