import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { transformErrorResponse } from "@/utils/errorHandler";
import { Category, CategoryResponse } from "../types";
import { api } from "..";

export const menuCategoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMenuCategories: builder.query<CategoryResponse,{ page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 10, search = "" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) params.append("search", search);

        return {
          url: `/api/menu/category?${params.toString()}`,
        };
      },
      providesTags: ["MenuCategories"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
          "Failed to fetch menu categories"
        ),
    }),

    getMenuCategoryById: builder.query<Category, string>({
      query: (id) => ({
        url: `/api/menu/category/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "MenuCategories", id }],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
          "Failed to fetch menu category"
        ),
    }),

    createMenuCategory: builder.mutation<
      Category,
      Omit<Category, "id" | "status">
    >({
      query: (category) => ({
        url: `/api/menu/category/add`,
        method: "POST",
        body: category,
      }),
      invalidatesTags: ["MenuCategories"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
          "Failed to create menu category"
        ),
    }),

    updateMenuCategory: builder.mutation<
      Category,
      Partial<Category> & { id: string }
    >({
      query: (category) => ({
        url: `/api/menu/category/update`,
        method: "POST",
        body: category,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "MenuCategories", id },
      ],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
          "Failed to update menu category"
        ),
    }),

    deleteMenuCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/menu/category/delete`,
        method: "POST",
        body: { id: id },
      }),
      invalidatesTags: ["MenuCategories"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
          "Failed to delete menu category"
        ),
    }),
  }),
});

export const {
  useGetMenuCategoriesQuery,
  useGetMenuCategoryByIdQuery,
  useCreateMenuCategoryMutation,
  useUpdateMenuCategoryMutation,
  useDeleteMenuCategoryMutation,
} = menuCategoriesApi;
