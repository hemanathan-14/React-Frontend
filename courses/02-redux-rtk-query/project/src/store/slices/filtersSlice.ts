import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SortBy = 'newest' | 'oldest';

export interface FiltersState {
  sortBy: SortBy;
  filterUserId: string | null;
}

const initialState: FiltersState = {
  sortBy: 'newest',
  filterUserId: null,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSortBy(state, action: PayloadAction<SortBy>) {
      state.sortBy = action.payload;
    },
    setFilterUserId(state, action: PayloadAction<string | null>) {
      state.filterUserId = action.payload;
    },
  },
});

export const { setSortBy, setFilterUserId } = filtersSlice.actions;
export default filtersSlice.reducer;
