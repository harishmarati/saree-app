import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import * as api from './api';
import type { Saree, SareeInput } from './types';

interface SareesState {
  items: Saree[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SareesState = {
  items: [],
  status: 'idle',
  error: null,
};

export const loadSarees = createAsyncThunk('sarees/load', () => api.fetchSarees());

export const addSaree = createAsyncThunk('sarees/add', (input: SareeInput) => api.createSaree(input));

export const editSaree = createAsyncThunk(
  'sarees/edit',
  ({ id, input }: { id: number; input: SareeInput }) => api.updateSaree(id, input)
);

export const removeSaree = createAsyncThunk('sarees/remove', async (id: number) => {
  await api.deleteSaree(id);
  return id;
});

const sareesSlice = createSlice({
  name: 'sarees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSarees.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadSarees.fulfilled, (state, action: PayloadAction<Saree[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadSarees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load sarees';
      })
      .addCase(addSaree.fulfilled, (state, action: PayloadAction<Saree>) => {
        state.items.unshift(action.payload);
      })
      .addCase(editSaree.fulfilled, (state, action: PayloadAction<Saree>) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(removeSaree.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default sareesSlice.reducer;
