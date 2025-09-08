import { useAuth } from './useAuth'
import { useEffect, useState } from 'react'

export const useMerchantVerification = () => {
  const { user, refreshMerchantProfile } = useAuth()
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Check if user is a merchant and get verification status
  const checkVerificationStatus = () => {
    if (user && (user as any).merchantId) {
      const merchant = user as any

      return merchant.verificationStatus === 'verified'
    }

    return true // Admin users are always considered verified
  }

  // Refresh merchant profile and update verification status
  const refreshVerificationStatus = async () => {
    if (user && (user as any).merchantId) {
      setIsLoading(true)
      try {
        const updatedUser = await refreshMerchantProfile()
        if (updatedUser) {
          setIsVerified((updatedUser as any).verificationStatus === 'verified')
        }
      } catch (error) {
        console.error('Error refreshing verification status:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Update verification status when user changes
  useEffect(() => {
    setIsVerified(checkVerificationStatus())
  }, [user])

  return {
    isVerified,
    isLoading,
    refreshVerificationStatus,
    isMerchant: user && (user as any).merchantId
  }
}
