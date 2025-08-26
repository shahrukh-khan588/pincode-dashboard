import { api } from "..";
import { MerchantProfile } from "../types";

export const merchantApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMerchantProfile: builder.query<MerchantProfile, void>({
      query: () => ({
        url: "/merchants/profile",
      }),
    }),
  }),
});

export const { useGetMerchantProfileQuery } = merchantApi;
