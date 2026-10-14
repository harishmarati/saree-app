import { configureStore } from '@reduxjs/toolkit';
import sareesReducer from '../features/sarees/sareesSlice';

export const store = configureStore({
  reducer: {
    sarees: sareesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
