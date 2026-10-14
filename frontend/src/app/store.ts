import { configureStore } from '@reduxjs/toolkit';
import sareesReducer from '../features/sarees/sareesSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    sarees: sareesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
