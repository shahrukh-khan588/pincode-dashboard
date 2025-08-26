import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { transformErrorResponse } from "@/utils/errorHandler";
import { api } from "..";
import { Supplier, SupplierLedgerEntry } from "../types";


export const supplierLedgerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierLedger: builder.query<
      { ledger: SupplierLedgerEntry[] },
      { page?: number; limit?: number; search?: string; supplierId: string }
    >({
      query: ({ supplierId, page = 1, limit = 10, search = "" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) params.append("search", search);

        return {
          url: `/api/supplier-ledger/${supplierId}?${params.toString()}`,
        };
      },
      providesTags: (result, error, { supplierId }) => [
        { type: "SupplierLedger", id: supplierId },
      ],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
            "Failed to fetch supplier ledger"
        ),
    }),
    getSupplierBalance: builder.query<{ supplier: Supplier }, string>({
      query: (id) => ({
        url: `/api/supplier-ledger/balance/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Suppliers", id }],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
            "Failed to fetch supplier balance"
        ),
    }),
    paySupplier: builder.mutation<{ supplier: Supplier }, SupplierLedgerEntry>({
      query: (supplier) => ({
        url: `/api/supplier-ledger/pay`,
        method: "POST",
        body: supplier,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Suppliers", id }],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
            "Failed to update supplier payment"
        ),
    }),
    deletePaySupplier: builder.mutation<void, string>({
      query: (supplierLedgerId) => ({
        url: `/api/supplier-ledger/delete`,
        method: "POST",
        body: { supplierLedgerId },
      }),
      invalidatesTags: ["SupplierLedger"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
            "Failed to delete supplier payment"
        ),
    }),
  }),
});

export const {
  useGetSupplierLedgerQuery,
  useGetSupplierBalanceQuery,
  usePaySupplierMutation,
  useDeletePaySupplierMutation,
} = supplierLedgerApi;
