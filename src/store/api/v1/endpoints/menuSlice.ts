import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { transformErrorResponse } from "@/utils/errorHandler";
import { Menu } from "../types";
import { api } from "..";

export const menusApi = api.injectEndpoints({

  endpoints: (builder) => ({
    getMenus: builder.query<{ menus: Menu[] }, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 10, search = "" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) params.append("search", search);
        return { url: `/api/menu?${params.toString()}` };
      },
      providesTags: ["Menus"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(error, (error.data as {error?: string})?.error || "Failed to fetch menus"),
    }),

    getMenuById: builder.query<Menu, string>({
      query: (id) => ({ url: `/api/menu/${id}` }),
      providesTags: (result, error, id) => [{ type: "Menus", id }],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(error, (error.data as {error?: string})?.error || "Failed to fetch menu"),
    }),

    createMenu: builder.mutation<Menu, Omit<Menu, "id" | "status">>({
      query: (menu) => ({
        url: `/api/menu/add`,
        method: "POST",
        body: menu,
      }),
      invalidatesTags: ["Menus"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(error, (error.data as {error?: string})?.error || "Failed to create menu"),
    }),

    updateMenu: builder.mutation<Menu, Partial<Menu> & { id: string }>({
      query: (menu) => ({
        url: `/api/menu/update`,
        method: "POST",
        body: menu,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Menus", id }],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(error, (error.data as {error?: string})?.error || "Failed to update menu"),
    }),

    deleteMenu: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/menu/delete`,
        method: "POST",
        body: { id },
      }),
      invalidatesTags: ["Menus"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(error, (error.data as {error?: string})?.error || "Failed to delete menu"),
    }),
  }),
});

export const {
  useGetMenusQuery,
  useGetMenuByIdQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
} = menusApi;
