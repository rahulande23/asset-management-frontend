import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: null,
  userId: null,
};

const userInfoSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      ((state.userName = action.payload.userName),
        (state.userId = action.payload.userId));
    },

    updateUser: (state, action) => {
      state.userName = action.payload.userName;
      state.userId = action.payload.userId;
      // if (action.payload.userName !== undefined)
      //   state.userName = action.payload.userName;

      // if (action.payload.userId !== undefined)
      //   state.userId = action.payload.userId;
    },

    logoutUser: (state) => {
      ((state.userName = null), (state.userId = null));
    },
  },
});

export const { setUser, updateUser, logoutUser } = userInfoSlice.actions;
export default userInfoSlice.reducer;
