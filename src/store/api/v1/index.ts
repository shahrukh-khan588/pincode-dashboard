import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://pin-code.fly.dev",
    prepareHeaders: async (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      // Ensure Content-Type is set for all requests
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      // Set Accept header
      headers.set("Accept", "application/json");

      return headers;
    },
    fetchFn: async (input, init) => {
      const response = await fetch(input, {
        ...init,
        mode: 'cors',
        credentials: 'omit',
      });

      return response;
    },
  }),
  tagTypes: [
    "MerchantProfile",
    "Merchants",
  ],
  endpoints: () => ({}),
  keepUnusedDataFor: 0, // Don't cache data
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
});
