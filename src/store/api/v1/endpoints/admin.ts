import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { transformErrorResponse } from '@/utils/errorHandler';
import { AdminMerchantsResponse, PaymentsListResponse, AdminPayoutRequestsResponse, MerchantDetailResponse } from '../types';
import { api } from '..';

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMerchants: builder.query<AdminMerchantsResponse, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 10, search = "" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) params.append("search", search);

        return {
          url: `/admin/merchants?${params.toString()}`,
        };
      },
      providesTags: ["Merchants"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error || "Failed to fetch merchants"
        ),
    }),

    getMerchantById: builder.query<MerchantDetailResponse, string>({
      query: (merchantId) => ({
        url: `/admin/merchants/${merchantId}`,
      }),
      providesTags: (result, error, merchantId) => [{ type: 'Merchants', id: merchantId }],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error || "Failed to fetch merchant details"
        ),
    }),

    handelChangeUserStatus: builder.mutation<void, { merchantId: string; status: 'rejected' | 'verified' | 'suspended' }>({
      query: ({ merchantId, status }) => ({
        url: `/admin/merchants/${merchantId}/status`,
        method: 'PATCH',
        body: { verificationStatus: status },
      }),
      invalidatesTags: ["Merchants"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error || "Failed to update merchant status"
        ),
    }),

    // Get admin payments list
    getAdminPayments: builder.query<PaymentsListResponse, { page?: number; limit?: number; status?: string; merchantId?: string }>({
      query: ({ page = 1, limit = 20, status, merchantId } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (status) params.append("status", status);
        if (merchantId) params.append("merchantId", merchantId);

        return {
          url: `/admin/payments?${params.toString()}`,
        };
      },
      providesTags: ["AdminPayments"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error || "Failed to fetch admin payments"
        ),
    }),

    // Get admin payout requests
    getAdminPayoutRequests: builder.query<AdminPayoutRequestsResponse, { page?: number; limit?: number; status?: string; search?: string }>({
      query: ({ page = 1, limit = 20, status, search } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (status) params.append("status", status);
        if (search) params.append("search", search);

        return {
          url: `/admin/payout-requests?${params.toString()}`,
        };
      },
      providesTags: ["PayoutRequests"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error || "Failed to fetch payout requests"
        ),
    }),

    // Approve payout request
    approvePayoutRequest: builder.mutation<void, { payoutRequestId: string }>({
      query: ({ payoutRequestId }) => ({
        url: `/admin/payout-requests/${payoutRequestId}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ["PayoutRequests"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error || "Failed to approve payout request"
        ),
    }),

    // Reject payout request
    rejectPayoutRequest: builder.mutation<void, { payoutRequestId: string; reason?: string }>({
      query: ({ payoutRequestId, reason }) => ({
        url: `/admin/payout-requests/${payoutRequestId}/reject`,
        method: 'POST',
        body: reason ? { reason } : undefined,
      }),
      invalidatesTags: ["PayoutRequests"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error || "Failed to reject payout request"
        ),
    }),

  })
})

export const {
  useGetMerchantsQuery,
  useGetMerchantByIdQuery,
  useHandelChangeUserStatusMutation,
  useGetAdminPaymentsQuery,
  useGetAdminPayoutRequestsQuery,
  useApprovePayoutRequestMutation,
  useRejectPayoutRequestMutation
} = adminApi;
