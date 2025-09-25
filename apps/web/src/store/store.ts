import authReducer from "@/modules/core/auth/store/auth-slice";
import flowReducer from "@/modules/core/flow/store/flow-slice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flow: flowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
