import { api } from '..';
import { RegisterRequest } from '../types';

export interface RegisterResponse {
  message?: string;
}

export const registerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: '/merchants/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ["Merchants"],
    }),
  }),
});

export const { useRegisterMutation } = registerApi;
