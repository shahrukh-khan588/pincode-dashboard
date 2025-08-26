import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { transformErrorResponse } from "@/utils/errorHandler";
import { Expense } from "../types";
import { api } from "..";

export const expenseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<
      { expenses: Expense[] },
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search = "" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) params.append("search", search);

        return {
          url: `/api/expense?${params.toString()}`,
        };
      },
      providesTags: ["Expenses"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(error, "Failed to fetch expenses"),
    }),

    getExpenseById: builder.query<Expense, string>({
      query: (id) => `/api/expense/${id}`,
      providesTags: (result, error, id) => [{ type: "Expenses", id }],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(error, "Failed to fetch expense details"),
    }),

    createExpense: builder.mutation<Expense, Omit<Expense, "id">>({
      query: (expense) => ({
        url: `/api/expense/add`,
        method: "POST",
        body: expense,
      }),
      invalidatesTags: ["Expenses"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(error, "Failed to create expense"),
    }),

    updateExpense: builder.mutation<Expense, Expense>({
      query: (expense) => ({
        url: `/api/expense/update`,
        method: "POST",
        body: expense,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Expenses", id }],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(error, "Failed to update expense"),
    }),

    deleteExpense: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/expense/delete`,
        method: "POST",
        body: { id },
      }),
      invalidatesTags: ["Expenses"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(error, "Failed to delete expense"),
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useGetExpenseByIdQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApi;
