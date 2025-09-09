import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { transformErrorResponse } from '@/utils/errorHandler';
import { AdminMerchantsResponse, PaymentsListResponse } from '../types';
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

  })
})

export const { useGetMerchantsQuery, useHandelChangeUserStatusMutation, useGetAdminPaymentsQuery } = adminApi;
