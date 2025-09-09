import { api } from "..";

// ** Types
export interface WalletDetails {
  availableBalance: number;
  pendingBalance: number;
  totalEarnings: number;
  lastUpdated: string;
}

export const walletApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWalletDetails: builder.query<WalletDetails, void>({
      query: () => ({
        url: "/merchants/me/wallet",
        method: "GET",
      }),
      providesTags: ["WalletDetails"],
    }),
  }),
});

export const {
  useGetWalletDetailsQuery,
} = walletApi;
