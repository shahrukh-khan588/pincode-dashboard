import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { transformErrorResponse } from "@/utils/errorHandler";
import { MenuOrder } from "../types";
import { api } from "..";

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<
      { tables: MenuOrder[] },
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search = "" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) params.append("search", search);
        return { url: `/api/menu-order?${params.toString()}` };
      },
      providesTags: ["MenuOrders"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error || "Failed to fetch orders"
        ),
    }),

    getOrderById: builder.query<MenuOrder, string>({
      query: (orderCode) => ({ url: `/api/menu-order/${orderCode}` }),
      providesTags: (result, error, orderCode) => [
        { type: "MenuOrders", orderCode },
      ],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error || "Failed to fetch order"
        ),
    }),

    // createTable: builder.mutation<MenuOrderTable, Omit<MenuOrderTable, "id" | "status">>({
    //   query: (table) => ({
    //     url: `/api/menu-order-table/add`,
    //     method: "POST",
    //     body: table,
    //   }),
    //   invalidatesTags: ["MenuOrderTables"],
    //   transformErrorResponse: (error: FetchBaseQueryError) =>
    //     transformErrorResponse(error, (error.data as {error?: string})?.error || "Failed to create table"),
    // }),

    // updateTable: builder.mutation<MenuOrderTable, Partial<MenuOrderTable> & { id: string }>({
    //   query: (table) => ({
    //     url: `/api/menu-order-table/update`,
    //     method: "POST",
    //     body: table,
    //   }),
    //   invalidatesTags: (result, error, { id }) => [{ type: "MenuOrderTables", id }],
    //   transformErrorResponse: (error: FetchBaseQueryError) =>
    //     transformErrorResponse(error, error?.data?.error || "Failed to update table"),
    // }),

    // deleteTable: builder.mutation<void, string>({
    //   query: (id) => ({
    //     url: `/api/menu-order-table/delete`,
    //     method: "POST",
    //     body: { id },
    //   }),
    //   invalidatesTags: ["MenuOrderTables"],
    //   transformErrorResponse: (error: FetchBaseQueryError) =>
    //     transformErrorResponse(error, error?.data?.error || "Failed to delete table"),
    // }),
  }),
});

export const { useGetOrdersQuery, useGetOrderByIdQuery } = ordersApi;
