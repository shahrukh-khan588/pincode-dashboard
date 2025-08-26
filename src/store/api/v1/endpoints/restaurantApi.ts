import { MenuCategory, MenuItem, OrderResponse } from "../types";
import { api } from "..";

export const restaurantApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<{categories: MenuCategory[]}, void>({
      query: () => '/api/menu/category?page=1&limit=100',
      providesTags: ['MenuCategory'],
    }),
    getMenuItems: builder.query<{items: MenuItem[]}, string>({
      query: (categoryId) => `/api/menu?menuCategoryId=${categoryId}`,
      providesTags: ['MenuItem'],
    }),
    getOrderDetails: builder.query<{order: OrderResponse}, string>({
      query: (orderCode) => `/api/menu-order/${orderCode}`,
      providesTags: ['Order'],
    }),
    placeOrder: builder.mutation<{order: OrderResponse}, {
      menuItems: { id: string; quantity: number }[];
      tableId: string;
      customerId?: string;
      bookingId?: string;
      walkInCustomerId?: string;
    }>({
      query: (body) => ({
        url: '/api/menu-order/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order'],
    }),
    
    updateOrder: builder.mutation<{order: OrderResponse}, {
      orderCode: string;
      menuItems: { id: string; quantity: number }[];
      tableId: string;
      customerId?: string;
      bookingId?: string;
      walkInCustomerId?: string;
    }>({
      query: (body) => ({
        url: '/api/menu-order/update',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order'],
    }),

    cancelOrder: builder.mutation<{order: OrderResponse}, { orderCode: string }>({
      query: (body) => ({
        url: '/api/menu-order/cancel',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetMenuItemsQuery,
  useGetOrderDetailsQuery,
  usePlaceOrderMutation,
  useUpdateOrderMutation,
  useCancelOrderMutation,
} = restaurantApi; 