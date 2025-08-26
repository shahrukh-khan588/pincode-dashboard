import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RestaurantState {
  selectedTable: { id: string; name: string };
  selectedBooking: { id: string; name: string };
  cartItems: Record<string, number>;
  isOrderSidebarOpen: { open: boolean; editMode: boolean };
}

const initialState: RestaurantState = {
  selectedTable: { id: "", name: "" },
  selectedBooking: { id: "", name: "" },
  cartItems: {},
  isOrderSidebarOpen: { open: false, editMode: false },
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setSelectedTable(state, action: PayloadAction<{ id: string; name: string }>) {
      state.selectedTable = action.payload;
    },
    setSelectedBooking(state, action: PayloadAction<{ id: string; name: string }>) {
      state.selectedBooking = action.payload;
    },
    addToCart(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.cartItems[id] = (state.cartItems[id] || 0) + 1;
    },
    removeFromCart(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.cartItems[id]) {
        state.cartItems[id] -= 1;
        if (state.cartItems[id] === 0) {
          delete state.cartItems[id];
        }
      }
    },
    clearCart(state) {
      state.cartItems = {};
    },
    setOrderSidebarOpen(state, action: PayloadAction<{ open: boolean; editMode: boolean }>) {
      state.isOrderSidebarOpen = action.payload;
    },
  },
});

// Selectors (assume state.restaurant in root reducer)
export const selectedTable = (state: { restaurant: RestaurantState }) => state.restaurant.selectedTable;
export const selectedBooking = (state: { restaurant: RestaurantState }) => state.restaurant.selectedBooking;

export const {
  setSelectedTable,
  setSelectedBooking,
  addToCart,
  removeFromCart,
  clearCart,
  setOrderSidebarOpen,
} = restaurantSlice.actions;
export default restaurantSlice.reducer;
