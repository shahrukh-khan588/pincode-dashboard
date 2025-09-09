import { useState, useCallback } from 'react';
import {
  useCreatePayoutRequestMutation,
  useGetPayoutRequestsQuery,
  useCancelPayoutRequestMutation
} from 'src/store/api/v1/endpoints/payout';
import { PayoutRequest } from 'src/store/api/v1/types';

interface UsePayoutOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const usePayout = (options: UsePayoutOptions = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState({ page: 1, limit: 10, status: undefined as string | undefined });

  const [createPayoutRequest, { isLoading: isCreating }] = useCreatePayoutRequestMutation();
  const [cancelPayoutRequest, { isLoading: isCancelling }] = useCancelPayoutRequestMutation();
  const { data: payoutRequestsData, isLoading: isLoadingRequests, error: requestsError, refetch } = useGetPayoutRequestsQuery(queryParams);

  // Validation rules
  const validatePayoutRequest = useCallback((data: PayoutRequest): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Amount validation
    if (!data.amount || data.amount <= 0) {
      errors.amount = 'Amount is required and must be greater than 0';
    } else if (data.amount < 500) {
      errors.amount = 'Minimum payout amount is RS: 500';
    } else if (data.amount > 1000000) {
      errors.amount = 'Maximum payout amount is RS: 1,000,000';
    }

    // Bank account validation
    if (!data.bankAccountId) {
      errors.bankAccountId = 'Please select a bank account';
    }

    // Transaction PIN validation
    if (!data.transactionPin) {
      errors.transactionPin = 'Transaction PIN is required';
    } else if (data.transactionPin.length !== 4) {
      errors.transactionPin = 'Transaction PIN must be 4 digits';
    } else if (!/^\d{4}$/.test(data.transactionPin)) {
      errors.transactionPin = 'Transaction PIN must contain only numbers';
    }

    return errors;
  }, []);

  // Create payout request with validation
  const requestPayout = useCallback(async (data: PayoutRequest) => {
    setIsSubmitting(true);
    setValidationErrors({});

    try {
      // Validate input
      const errors = validatePayoutRequest(data);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setIsSubmitting(false);

        return { success: false, errors };
      }

      // Make API call
      const result = await createPayoutRequest(data).unwrap();

      options.onSuccess?.(result);
      setIsSubmitting(false);

      return { success: true, data: result };
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to process payout request';
      options.onError?.(error);
      setIsSubmitting(false);

      return { success: false, error: errorMessage };
    }
  }, [createPayoutRequest, validatePayoutRequest, options]);

  // Cancel payout request
  const cancelPayout = useCallback(async (payoutId: string, transactionPin: string) => {
    try {
      const result = await cancelPayoutRequest({ payoutId, transactionPin }).unwrap();
      options.onSuccess?.(result);

      return { success: true, data: result };
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to cancel payout request';
      options.onError?.(error);

      return { success: false, error: errorMessage };
    }
  }, [cancelPayoutRequest, options]);

  // Get payout requests with pagination
  const getPayoutRequests = useCallback((page = 1, limit = 10, status?: string) => {
    setQueryParams({ page, limit, status });

    return { data: payoutRequestsData, isLoading: isLoadingRequests, error: requestsError, refetch };
  }, [payoutRequestsData, isLoadingRequests, requestsError, refetch]);

  return {
    // Actions
    requestPayout,
    cancelPayout,
    getPayoutRequests,

    // State
    isSubmitting: isSubmitting || isCreating,
    isCancelling,
    validationErrors,
    payoutRequestsData,
    isLoadingRequests,
    requestsError,

    // Utilities
    validatePayoutRequest,
    clearValidationErrors: () => setValidationErrors({}),
  };
};

export default usePayout;
