import { createSlice } from "@reduxjs/toolkit";

// Define the User interface
export interface User {
  token: string;
  user: User | null;
}

// Define the initial state type
export interface InitialStateType {
  token: string | null;
  user: User | null;
}

const initialState: InitialStateType = {
  token: null,
  user: null,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    saveUserInfo: (state: InitialStateType, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
    },
    removeUserInfo: (state: InitialStateType) => {
      state.token = "";
      state.user = null;
    },
  },
});

// Selector for token and user
export const token = (state: InitialStateType) => state.token;
export const user = (state: InitialStateType) => state.user;

export const { saveUserInfo, removeUserInfo } = sessionSlice.actions;
export default sessionSlice.reducer;
