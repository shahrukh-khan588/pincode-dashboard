import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
    prepareHeaders: async (headers) => {
      // Enforce session expiry before attaching headers
      if (typeof window !== 'undefined') {
        const expiryStr = window.localStorage.getItem('sessionExpiry');
        if (expiryStr) {
          const expiresAt = Number(expiryStr);
          if (Number.isFinite(expiresAt) && Date.now() >= expiresAt) {
            window.localStorage.removeItem('userData');
            window.localStorage.removeItem('refreshToken');
            window.localStorage.removeItem('accessToken');
            window.localStorage.removeItem('sessionExpiry');
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            throw new Error('Session expired');
          }
        }
      }
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
      // Enforce session expiry before performing fetch
      if (typeof window !== 'undefined') {
        const expiryStr = window.localStorage.getItem('sessionExpiry');
        if (expiryStr) {
          const expiresAt = Number(expiryStr);
          if (Number.isFinite(expiresAt) && Date.now() >= expiresAt) {
            window.localStorage.removeItem('userData');
            window.localStorage.removeItem('refreshToken');
            window.localStorage.removeItem('accessToken');
            window.localStorage.removeItem('sessionExpiry');
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            throw new Error('Session expired');
          }
        }
      }
      console.log('🚀 RTK Query Request:', {
        url: input,
        method: init?.method,
        headers: init?.headers,
        body: init?.body
      });

      const response = await fetch(input, {
        ...init,
        mode: 'cors',
        credentials: 'include',
      });

      console.log('📥 RTK Query Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      });

      return response;
    },
  }),
  tagTypes: [
    "MerchantProfile",
    "Merchants",
    "PayoutRequests",
    "PayoutRequest",
    "WalletDetails",
    "AdminPayments",
    "Banks",
    "Bank"
  ],
  endpoints: () => ({}),
  keepUnusedDataFor: 0, // Don't cache data
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
});
