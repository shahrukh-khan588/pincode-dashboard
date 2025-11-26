
export interface MenuOrderTable {
  id: string;
  name: string;
  capacity: number | null;
  engageStatus: "available" | "occupied" | "reserve";
  status: "active" | "deleted";
}

export interface Category {
  id: string;
  name: string;
  status: "active" | "deleted";
}

export interface CategoryResponse {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  category: Category[];
}

// Merchant types
export interface MerchantWalletBalance {
  availableBalance: number;
  pendingBalance: number;
  totalEarnings: number;
  lastUpdated: string; // ISO date string
}

export interface MerchantBankAccountDetails {
  accountNumber: string;
  accountTitle: string;
  bankName: string;
  branchCode: string;
  iban: string;
}

export interface MerchantProfile {
  merchantId: string;
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  businessAddress: string;
  taxId: string;
  phoneNumber: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  isActive: boolean;
  walletBalance: MerchantWalletBalance;
  bankAccountDetails: MerchantBankAccountDetails;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Update payload for PATCH /merchants/profile
export interface UpdateMerchantProfileRequest {
  firstName?: string;
  lastName?: string;
  businessName?: string;
  businessAddress?: string;
  phoneNumber?: string;
}

// Admin merchants list types
export interface AdminMerchantItem {
  id: string;
  merchantId: string;
  email: string;
  businessName: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  firstName: string;
  lastName: string;
}

export interface AdminMerchantsResponse {
  items: AdminMerchantItem[];
  page: number;
  limit: number;
  hasNextPage: boolean;
  nextPage?: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  businessName: string;
  businessAddress: string;
  taxId: string;
  phoneNumber: string;
  bankAccountDetails: {
    accountNumber: string;
    accountTitle: string;
    bankName: string;
    branchCode: string;
    iban: string;
  };
}

// Payout Request types
export interface PayoutRequest {
  amount: number;
  bankAccountId: string;
  transactionPin?: string;
  description?: string;
}

// Payment/Payout Response from API (actual structure)
export interface PaymentResponse {
  id: string;
  amount: number;
  currency: string;
  provider: string;
  merchantId: string;
  transactionRef: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'PROCESSING' | 'CANCELLED';
  createdAt: string;
  metadata: Record<string, any>;
}

export interface PaymentsListResponse {
  items: PaymentResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Merchant payout-requests list (new GET /merchants/payout-requests)
export interface MerchantPayoutDestination {
  type: 'BANK' | 'WALLET' | string;
  bankName?: string;
  accountLast4?: string;
}

export interface MerchantPayoutRequestItem {
  id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'PROCESSING' | 'CANCELLED' | string;
  createdAt: string;
  destination: MerchantPayoutDestination;
}

export interface MerchantPayoutRequestsListResponse {
  items: MerchantPayoutRequestItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Admin payout requests types
export interface AdminPayoutDestination {
  type: 'BANK' | 'WALLET' | string;
  bankName?: string;
  accountLast4?: string;
}

export interface AdminPayoutRequestItem {
  id: string;
  merchantId: string;
  amount: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'REJECTED' | 'COMPLETED' | string;
  createdAt: string;
  merchantName: string;
  merchantEmail: string;
  availableAmount: number;
  destination: AdminPayoutDestination;
}

export interface AdminPayoutRequestsResponse {
  items: AdminPayoutRequestItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Legacy PayoutRequestResponse (for backward compatibility)
export interface PayoutRequestResponse {
  id: string;
  merchantId: string;
  amount: number;
  bankAccountDetails: {
    accountNumber: string;
    accountTitle: string;
    bankName: string;
    branchCode: string;
    iban: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  description?: string;
  processingFee: number;
  netAmount: number;
  estimatedProcessingTime: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  failureReason?: string;
}

export interface PayoutRequestError {
  message: string;
  code: string;
  details?: {
    field?: string;
    value?: any;
  };
}

// Payment Status Inquiry types
export interface PaymentStatusInquiryRequest {
  transactionRef: string;
  provider: string;
}

export interface PaymentStatusInquiryResponse {
  id: string;
  transactionRef: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'PROCESSING' | 'CANCELLED';
  merchantId: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  failureReason?: string;
  description?: string;
  fees?: number;
  netAmount?: number;
  metadata: Record<string, any>;
}
