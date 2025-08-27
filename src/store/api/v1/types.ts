
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
