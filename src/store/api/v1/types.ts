export interface MenuOrder {
  id: string;
  orderCode: string;
  date: string; // ISO date string,
  orderTableId: string;
  menuId: string;
  quantity: number;
  totalAmount: number;
  paidStatus: "pending" | "paid";
  customerId: string | null;
  bookingId: string | null;
  walkInCustomerId: string | null;
  status: "active" | "deleted";
}

export interface Expense {
  id: string;
  categoryId: string;
  bankId?: string;
  amount: number;
  description?: string;
  date: string;
  status: "active" | "deleted";
}

export interface Bank {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  status: "active" | "deleted";
}

export interface Booking {
  id: string;
  customerId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string | null;
  totalAmount: number | null;
  isPaid: boolean;
  Room: Room;
  Customer: Customer;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cnic?: string;
  passport?: string | null;
  passportValidity: string | null;
  address: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerResponse {
  customers: Customer[];
  totalPages: number;
  currentPage: number;
  totalRecords: number;
  perPage: number;
}

export interface CheckInRequest {
  customerId: string;
  roomId: string;
  checkInDate: string;
}

export interface Menu {
  id: string;
  menuCategoryId: string;
  name: string;
  price: number;
  status: "active" | "deleted";
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  orderCode?: string;
  customerId?: string;
  bookingId?: string;
  category?: string;
}

export interface OrderResponse {
  message: string;
  orderCode?: string;
  orders?: OrderItem[];
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Room {
  id: string;
  number: string;
  roomTypeId: string;
  adultCapacity: number;
  kidsCapacity: number;
  noOfBeds: number;
  price: number;
  roomFacilities: string[];
  isAvailable: boolean;
  checkedInBy: string | null;
  RoomType: RoomType;
}

export interface PaginatedResponse {
  rooms: Room[];
  totalPages: number;
  currentPage: number;
  totalRecords: number;
  perPage: number;
}

export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  status: "active" | "deleted";
  createdAt?: string;
  updatedAt?: string;
}

export interface SupplierLedgerEntry {
  id: string;
  supplierId: string;
  expenseId?: string;
  type: "purchase" | "payment";
  amount: number;
  paymentMethod?: "cash" | "bank" | null;
  date: string;
  itemsPurchase?: string;
  status: "active" | "deleted";
  createdAt: string;
  updatedAt: string;
  Supplier?: { name: string };
  Expense?: { description: string };
}

export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  status: "active" | "deleted";
}

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
