import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
    prepareHeaders: async (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "Banks",
    "MenuCategory",
    "MenuItem",
    "RoomTypes",
    "Suppliers",
    "SupplierLedger",
    "RoomFacilities",
    "Order",
    "Bookings",
    "Menus",
    "MenuCategories",
    "BookingDetails",
    "MenuOrderTables",
    "MenuOrders",
    "Rooms",
    "Product",
    "Expenses",
    "Customers",
    "Categories",
    "Speaker",
    "S3File",
    "Analytics",
    "Material",
    "Waitlist",
    "MerchantProfile",
  ],
  endpoints: () => ({}),
  keepUnusedDataFor: 0, // Don't cache data
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
});
