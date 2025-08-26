import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { transformErrorResponse } from "@/utils/errorHandler";
import { api } from "..";
import { MenuOrderTable, MenuOrderTableResponse } from "../types";

// Type definitions for better type safety
interface GetTablesParams {
  page?: number;
  limit?: number;
  search?: string;
  getTableOrders?: boolean;
}

interface CreateTableParams {
  name: string;
  capacity: number;
}

interface UpdateTableParams {
  id: string;
  name: string;
  capacity: number;
}

export const menuOrderTablesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTables: builder.query<MenuOrderTableResponse, GetTablesParams>({
      query: ({ page = 1, limit = 10, search = "", getTableOrders = false }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) params.append("search", search);
        if (getTableOrders) params.append("getTableOrders", "true");
        return { url: `/api/menu-order-table?${params.toString()}` };
      },
      providesTags: ["MenuOrderTables"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error as FetchBaseQueryError & { data?: { error?: string } })?.data
            ?.error || "Failed to fetch tables"
        ),
    }),

    getTableById: builder.query<MenuOrderTable, string>({
      query: (id) => ({ url: `/api/menu-order-table/${id}` }),
      providesTags: (result, error, id) => [{ type: "MenuOrderTables", id }],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error as FetchBaseQueryError & { data?: { error?: string } })?.data
            ?.error || "Failed to fetch table"
        ),
    }),

    createTable: builder.mutation<MenuOrderTable, CreateTableParams>({
      query: (table) => ({
        url: `/api/menu-order-table/add`,
        method: "POST",
        body: table,
      }),
      invalidatesTags: ["MenuOrderTables"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error as FetchBaseQueryError & { data?: { error?: string } })?.data
            ?.error || "Failed to create table"
        ),
    }),

    updateTable: builder.mutation<MenuOrderTable, UpdateTableParams>({
      query: (table) => ({
        url: `/api/menu-order-table/update`,
        method: "POST",
        body: table,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "MenuOrderTables", id }],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error as FetchBaseQueryError & { data?: { error?: string } })?.data
            ?.error || "Failed to update table"
        ),
    }),

    deleteTable: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/menu-order-table/delete`,
        method: "POST",
        body: { id },
      }),
      invalidatesTags: ["MenuOrderTables"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error as FetchBaseQueryError & { data?: { error?: string } })?.data
            ?.error || "Failed to delete table"
        ),
    }),
  }),
});

export const {
  useGetTablesQuery,
  useGetTableByIdQuery,
  useCreateTableMutation,
  useUpdateTableMutation,
  useDeleteTableMutation,
} = menuOrderTablesApi;
