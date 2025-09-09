import { api } from "..";
import { PayoutRequest, PayoutRequestResponse, PaymentsListResponse } from "../types";

export const payoutApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create a payout request - requires transaction PIN for security
    createPayoutRequest: builder.mutation<PayoutRequestResponse, PayoutRequest>({
      query: (payoutData) => ({
        url: "/merchants/me/payout-requests",
        method: "POST",
        body: payoutData,
      }),

      // Invalidate merchant profile and wallet details to update wallet balance
      invalidatesTags: ["MerchantProfile", "WalletDetails"],

      // Add extra security headers for transaction requests
      extraOptions: {
        headers: {
          "X-Transaction-Type": "payout-request",
          "X-Requires-PIN": "true",
        },
      },
    }),

    // Get payout request history
    getPayoutRequests: builder.query<PaymentsListResponse, { page?: number; limit?: number; status?: string }>({
      query: ({ page = 1, limit = 10, status } = {}) => ({
        url: "/merchants/payments",
        params: { page, limit, ...(status && { status }) },
      }),
      providesTags: ["PayoutRequests"],
    }),

    // Get specific payout request details
    getPayoutRequest: builder.query<PayoutRequestResponse, string>({
      query: (payoutId) => ({
        url: `/merchants/me/payout-requests/${payoutId}`,
      }),
      providesTags: (result, error, payoutId) => [
        { type: "PayoutRequest", id: payoutId },
      ],
    }),

    // Cancel a pending payout request
    cancelPayoutRequest: builder.mutation<{ success: boolean; message: string }, { payoutId: string; transactionPin: string }>({
      query: ({ payoutId, transactionPin }) => ({
        url: `/merchants/me/payout-requests/${payoutId}/cancel`,
        method: "POST",
        body: { transactionPin },
      }),
      invalidatesTags: (result, error, { payoutId }) => [
        "PayoutRequests",
        { type: "PayoutRequest", id: payoutId },
        "MerchantProfile",
        "WalletDetails",
      ],
      extraOptions: {
        headers: {
          "X-Transaction-Type": "payout-cancel",
          "X-Requires-PIN": "true",
        },
      },
    }),
  }),
});

export const {
  useCreatePayoutRequestMutation,
  useGetPayoutRequestsQuery,
  useGetPayoutRequestQuery,
  useCancelPayoutRequestMutation,
} = payoutApi;
