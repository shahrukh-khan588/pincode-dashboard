import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { transformErrorResponse } from '@/utils/errorHandler';
import { Customer, CustomerResponse } from '../types';
import { api } from '..';

export const customersApi = api.injectEndpoints({

  endpoints: (builder) => ({
    getCustomers: builder.query<
      CustomerResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search = "" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) params.append("search", search);

        return {
          url: `/api/customer?${params.toString()}`,
        };
      },
      providesTags: ["Customers"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(error, (error.data as { error?: string })?.error || "Failed to fetch customers"),
    }),

    getCustomerById: builder.query<Customer, string>({
      query: (id) => ({
        url: `/api/customer/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Customers", id }],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(error, (error.data as { error?: string })?.error || "Failed to fetch customer details"),
    }),

    createCustomer: builder.mutation<Customer, Omit<Customer, "id">>({
      query: (customer) => ({
        url: "/api/customer/add",
        method: "POST",
        body: customer,
      }),
      invalidatesTags: ["Customers"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(error, (error.data as { error?: string })?.error || "Failed to create customer"),
    }),

    updateCustomer: builder.mutation<Customer, Customer>({
      query: (customer) => ({
        url: `/api/customer/update`,
        method: "POST",
        body: customer,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Customers", id }],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(error, (error.data as { error?: string })?.error || "Failed to update customer"),
    }),

    deleteCustomer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/customer/delete`,
        method: "POST",
        body: { id: id },
      }),
      invalidatesTags: ["Customers"],
      transformErrorResponse: (error: FetchBaseQueryError) =>
        transformErrorResponse(error, (error.data as { error?: string })?.error || "Failed to delete customer"),
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApi; 