import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from './api';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  loginPending: boolean;
  loginError: string | null;
}

const initialState: AuthState = {
  status: 'checking',
  loginPending: false,
  loginError: null,
};

export const checkSession = createAsyncThunk('auth/checkSession', () => api.checkSession());

export const login = createAsyncThunk('auth/login', async (password: string, { rejectWithValue }) => {
  try {
    await api.login(password);
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Login failed');
  }
});

export const logout = createAsyncThunk('auth/logout', () => api.logout());

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionExpired(state) {
      state.status = 'unauthenticated';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkSession.fulfilled, (state, action) => {
        state.status = action.payload.authenticated ? 'authenticated' : 'unauthenticated';
      })
      .addCase(checkSession.rejected, (state) => {
        state.status = 'unauthenticated';
      })
      .addCase(login.pending, (state) => {
        state.loginPending = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.loginPending = false;
        state.status = 'authenticated';
      })
      .addCase(login.rejected, (state, action) => {
        state.loginPending = false;
        state.loginError = (action.payload as string) ?? 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'unauthenticated';
      });
  },
});

export const { sessionExpired } = authSlice.actions;
export default authSlice.reducer;
