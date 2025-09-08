// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

// ** Types
import { MerchantDataType } from 'src/context/types'

interface MerchantApprovalGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const MerchantApprovalGuard = (props: MerchantApprovalGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(
    () => {
      if (!router.isReady || auth.loading) {
        return
      }

      // Check if user is a merchant
      if (auth.user && 'merchantId' in auth.user) {
        const merchant = auth.user as MerchantDataType

        // If merchant is not verified, redirect to account status page
        if (merchant.verificationStatus !== 'verified') {
          // Only redirect if not already on account status page to avoid infinite loop
          if (router.asPath !== '/merchant/account-status') {
            router.replace('/merchant/account-status')
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route, auth.user, auth.loading, router.isReady]
  )

  // Show fallback while loading
  if (auth.loading) {
    return fallback
  }

  // If user is a merchant and not verified, show fallback (will be redirected)
  if (auth.user && 'merchantId' in auth.user) {
    const merchant = auth.user as MerchantDataType
    if (merchant.verificationStatus !== 'verified') {
      return fallback
    }
  }

  return <>{children}</>
}

export default MerchantApprovalGuard
