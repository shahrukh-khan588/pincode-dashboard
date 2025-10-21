import { api } from "..";

// Bank types
export interface BankType {
  id: string;
  accountNumber: string;
  accountTitle: string;
  bankName: string;
  branchCode: string;
  iban: string;
}



export const banksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all banks
    getAllBanks: builder.query<BankType[], { page?: number; limit?: number; search?: string; isActive?: boolean }>({
      query: ({ page = 1, limit = 10, search, isActive } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (search) params.append("search", search);
        if (isActive !== undefined) params.append("isActive", isActive.toString());

        return {
          url: `/merchants/bank-accounts?${params.toString()}`,
        };
      },
      providesTags: ["Banks"],
    }),

    // Create bank account
    createBankAccount: builder.mutation<BankType, Omit<BankType, 'id'>>({
      query: (bankData) => ({
        url: '/merchants/bank-accounts',
        method: 'POST',
        body: bankData,
      }),
      invalidatesTags: ["Banks"],
    }),

    // Delete bank account
    deleteBankAccount: builder.mutation<void, string>({
      query: (bankId) => ({
        url: `/merchants/bank-accounts/${bankId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Banks"],
    }),

  }),
});

export const {
  useGetAllBanksQuery,
  useCreateBankAccountMutation,
  useDeleteBankAccountMutation,
} = banksApi;
