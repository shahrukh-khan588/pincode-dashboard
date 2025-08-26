import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { transformErrorResponse } from "@/utils/errorHandler";
import { api } from "..";
import { Supplier } from "../types";

export const suppliersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSuppliers: builder.query<
      { suppliers: Supplier[] },
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search = "" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) params.append("search", search);

        return {
          url: `/api/supplier?${params.toString()}`,
        };
      },
      providesTags: ["Suppliers"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
            "Failed to fetch suppliers"
        ),
    }),

    getSupplierById: builder.query<Supplier, string>({
      query: (id) => ({
        url: `/api/supplier/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Suppliers", id }],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
            "Failed to fetch supplier details"
        ),
    }),

    createSupplier: builder.mutation<Supplier, Omit<Supplier, "id">>({
      query: (supplier) => ({
        url: "/api/supplier/add",
        method: "POST",
        body: supplier,
      }),
      invalidatesTags: ["Suppliers"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
            "Failed to create supplier"
        ),
    }),

    updateSupplier: builder.mutation<Supplier, Supplier>({
      query: (supplier) => ({
        url: `/api/supplier/update`,
        method: "POST",
        body: supplier,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Suppliers", id }],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
            "Failed to update supplier"
        ),
    }),

    deleteSupplier: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/supplier/delete`,
        method: "POST",
        body: id,
      }),
      invalidatesTags: ["Suppliers"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
            "Failed to delete supplier"
        ),
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useGetSupplierByIdQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = suppliersApi;
