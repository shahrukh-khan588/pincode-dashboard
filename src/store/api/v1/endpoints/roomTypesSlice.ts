import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { transformErrorResponse } from "@/utils/errorHandler";
import { api } from "..";
import { RoomType } from "../types";

export const roomTypesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRoomTypes: builder.query<{
      rooms: RoomType[];
      totalRecords: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
    },
      { page?: number; perPage?: number }
    >({
      query: ({ page = 1, perPage = 10 }) => ({
        url: `/api/room/type?page=${page}&perPage=${perPage}`,
      }),
      providesTags: ["RoomTypes"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
          "Failed to fetch room types"
        ),
    }),

    getRoomTypeById: builder.query<{ roomType: RoomType }, string>({
      query: (id) => ({
        url: `/api/room/type/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "RoomTypes", id }],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(error, "Failed to fetch room type details"),
    }),

    addRoomType: builder.mutation<
      { roomType: RoomType },
      { name: string; description: string; price: number }
    >({
      query: (roomType) => ({
        url: "/api/room/type/add",
        method: "POST",
        body: roomType,
      }),
      invalidatesTags: ["RoomTypes"],
      transformErrorResponse: (error: FetchBaseQueryError) => {
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error || "Failed to add room type"
        );
      },
    }),

    updateRoomType: builder.mutation<
      { roomType: RoomType },
      {
        id: string;
        name: string;
        description: string;
        price: number;
      }
    >({
      query: (roomType) => ({
        url: "/api/room/type/update",
        method: "POST",
        body: roomType,
      }),
      invalidatesTags: ["RoomTypes"],
      transformErrorResponse: (error: FetchBaseQueryError) => {
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error || "Failed to update room type"
        );
      },
    }),

    deleteRoomType: builder.mutation<void, string>({
      query: (id) => ({
        url: "/api/room/type/delete",
        method: "POST",
        body: { id },
      }),
      invalidatesTags: ["RoomTypes"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error || "Failed to delete room type"
        ),
    }),
  }),
});

export const {
  useGetRoomTypesQuery,
  useGetRoomTypeByIdQuery,
  useAddRoomTypeMutation,
  useUpdateRoomTypeMutation,
  useDeleteRoomTypeMutation,
} = roomTypesApi; 