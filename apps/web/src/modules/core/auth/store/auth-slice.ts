import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tokenService } from "../services/token-service";

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: tokenService.getToken(),
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setToken, setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;

/**
 * Wiring: subscribe tokenService changes to update redux store.
 * Call this once on app init (see providers).
 */
export function wireTokenServiceToStore(store: any) {
  // subscribe to token changes
  tokenService.subscribe((token) => {
    store.dispatch(setToken(token));
  });
  // subscribe to unauthorized events
  tokenService.onUnauthorized(() => {
    store.dispatch(logout());
  });
}
