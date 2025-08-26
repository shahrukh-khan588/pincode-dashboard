import { configureStore } from "@reduxjs/toolkit";
import { api as v1 } from "./api/v1";
import authReducer from "./slices/sessionSlice";
import restaurantReducer from "./slices/restaurantSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurant: restaurantReducer,
    [v1.reducerPath]: v1.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(v1.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
