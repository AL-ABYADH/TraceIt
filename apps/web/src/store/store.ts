import authReducer from "@/modules/core/auth/store/auth-slice";
import flowReducer, { flowListenerMiddleware } from "@/modules/core/flow/store/flow-slice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flow: flowReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(flowListenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
