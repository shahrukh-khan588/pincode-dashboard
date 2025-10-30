import { api } from "..";
import { MerchantProfile, UpdateMerchantProfileRequest } from "../types";

export const merchantApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMerchantProfile: builder.query<MerchantProfile, void>({
      query: () => ({
        url: "/merchants/profile",
      }),
      providesTags: ["MerchantProfile"],
    }),

    updateMerchantProfile: builder.mutation<MerchantProfile, UpdateMerchantProfileRequest>({
      query: (body) => ({
        url: "/merchants/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["MerchantProfile"],
    }),
  }),
});

export const { useGetMerchantProfileQuery, useUpdateMerchantProfileMutation } = merchantApi;
