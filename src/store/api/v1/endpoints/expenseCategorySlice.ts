import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { transformErrorResponse } from "@/utils/errorHandler";
import { Category } from "../types";
import { api } from "..";

export const expenseCategoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExpenseCategories: builder.query<{ categories: Category[] }, void>({
      query: () => `/api/expense/category`,
      providesTags: ["Categories"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
            "Failed to fetch categories"
        ),
    }),

    getExpenseCategoryById: builder.query<Category, string>({
      query: (id) => `/api/expense/category/${id}`,
      providesTags: (result, error, id) => [{ type: "Categories", id }],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
            "Failed to fetch category details"
        ),
    }),

    createExpenseCategory: builder.mutation<Category, Omit<Category, "id">>({
      query: (category) => ({
        url: `/api/expense/add-category`,
        method: "POST",
        body: category,
      }),
      invalidatesTags: ["Categories"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
            "Failed to create category"
        ),
    }),

    updateExpenseCategory: builder.mutation<Category, Category>({
      query: (category) => ({
        url: `/api/expense/update-category`,
        method: "POST",
        body: category,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Categories", id }],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
            "Failed to update category"
        ),
    }),

    deleteExpenseCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/expense/delete-category`,
        method: "POST",
        body: id,
      }),
      invalidatesTags: ["Categories"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
            "Failed to delete category"
        ),
    }),
  }),
});

export const {
  useGetExpenseCategoriesQuery,
  useGetExpenseCategoryByIdQuery,
  useCreateExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
  useDeleteExpenseCategoryMutation,
} = expenseCategoryApi;
