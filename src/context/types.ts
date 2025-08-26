export type ErrCallbackType = (err: any) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
  userType?: 'admin' | 'merchant'
}

export type UserDataType = {
  id: number
  role: string
  email: string
  fullName: string
  username: string
  password: string
  avatar?: string | null
}

// Merchant specific types
export type WalletBalance = {
  availableBalance: number
  pendingBalance: number
  totalEarnings: number
  lastUpdated: string
}

export type BankAccountDetails = {
  accountNumber: string
  accountTitle: string
  bankName: string
  branchCode: string
  iban: string
}

export type MerchantDataType = {
  merchantId: string
  email: string
  firstName: string
  lastName: string
  businessName: string
  businessAddress: string
  taxId: string
  phoneNumber: string
  verificationStatus: string
  isActive: boolean
  walletBalance: WalletBalance
  bankAccountDetails: BankAccountDetails
  createdAt: string
  updatedAt: string
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | MerchantDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | MerchantDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}
