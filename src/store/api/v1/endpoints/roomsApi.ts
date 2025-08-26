import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { transformErrorResponse } from "@/utils/errorHandler";
import { api } from "..";
import { PaginatedResponse, Room, RoomType } from "../types";

export const roomsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query<
      {
        totalRecords: number;
        totalPages: number; rooms: PaginatedResponse
      },
      {
        page?: number;
        limit?: number;
        search?: string;
        isAvailable?: boolean;
        sortByPrice?: "asc" | "desc";
        token?: string;
      }
    >({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        isAvailable,
        sortByPrice,
        token,
      }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        if (search) {
          params.append("search", search);
        }

        if (isAvailable) {
          params.append("isAvailable", isAvailable.toString());
        }

        if (sortByPrice) {
          params.append("sortByPrice", sortByPrice);
        }

        return {
          url: `/api/room?${params.toString()}`,
          headers: token ? { authorization: `Bearer ${token}` } : {},
        };
      },
      providesTags: ["Rooms"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(error, "Failed to fetch rooms"),
    }),

    getRoomById: builder.query<Room, string>({
      query: (id) => ({
        url: `/api/room/${id}`,
      }),

      providesTags: (result, error, id) => [{ type: "Rooms", id }],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(error, "Failed to fetch room details"),
    }),

    addRoom: builder.mutation({
      query: (room) => ({
        url: "/api/room/add",
        method: "POST",
        body: room,
      }),
      invalidatesTags: ["Rooms"],
      transformErrorResponse: (error: FetchBaseQueryError) => {
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error || "Failed to add room"
        );
      },
    }),

    updateRoom: builder.mutation<
      { room: Room },
      {
        id: string;
        number: string;
        roomTypeId: string;
        price: number;
        adultCapacity: number;
        kidsCapacity: number;
        noOfBeds: number;
        roomFacilities: string[];
      }
    >({
      query: (room) => ({
        url: "/api/room/update",
        method: "POST",
        body: room,
      }),
      invalidatesTags: ["Rooms"],
      transformErrorResponse: (error: FetchBaseQueryError) => {
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error || "Failed to update room"
        );
      },
    }),

    updateRoomPrice: builder.mutation<
      { room: Room },
      { roomId: string; price: number }
    >({
      query: ({ roomId, price }) => ({
        url: "/api/room/setprice",
        method: "POST",
        body: { roomId, price },
      }),
      invalidatesTags: (result, error, { roomId, price }) => [
        { type: "Rooms", id: roomId, price },
      ],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
          "Failed to update room price"
        ),
    }),

    deleteRoom: builder.mutation<void, string>({
      query: (id) => ({
        url: "/api/room/delete",
        method: "POST",
        body: { id },
      }),
      invalidatesTags: ["Rooms"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error || "Failed to delete room"
        ),
    }),

    getRoomTypes: builder.query<{ roomTypes: RoomType[] }, void>({
      query: () => ({
        url: "/api/room/type",
      }),
      providesTags: ["RoomTypes"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
          "Failed to fetch room types"
        ),
    }),

    getRoomFacilities: builder.query<{ roomFacilities: string[] }, void>({
      query: () => ({
        url: "/api/room/facilities",
      }),
      providesTags: ["RoomFacilities"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(
          error,
          (error.data as { error?: string })?.error ||
          "Failed to fetch room facilities"
        ),
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useAddRoomMutation,
  useUpdateRoomMutation,
  useUpdateRoomPriceMutation,
  useDeleteRoomMutation,
  useGetRoomTypesQuery,
  useGetRoomFacilitiesQuery,
} = roomsApi;
