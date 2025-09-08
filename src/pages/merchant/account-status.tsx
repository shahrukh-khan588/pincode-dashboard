// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Grid
} from '@mui/material'

// ** Icon
import { Icon } from '@iconify/react'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Types
import { MerchantDataType } from 'src/context/types'

const MerchantAccountStatus = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const merchant = user as MerchantDataType

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'verified':
        return {
          color: 'success' as const,
          icon: <Icon icon='mdi:check-circle' />,
          title: 'Account Approved',
          description: 'Your merchant account has been verified and approved. You can now access all features.',
          bgColor: '#f3f9f3'
        }
      case 'pending':
        return {
          color: 'warning' as const,
          icon: <Icon icon='mdi:clock-outline' />,
          title: 'Account Pending',
          description: 'Your account is currently under review. We will notify you once the verification is complete.',
          bgColor: '#fff8e1'
        }
      case 'rejected':
        return {
          color: 'error' as const,
          icon: <Icon icon='mdi:close-circle' />,
          title: 'Account Rejected',
          description: 'Your account verification was not successful. Please contact support for more information.',
          bgColor: '#ffebee'
        }
      case 'suspended':
        return {
          color: 'error' as const,
          icon: <Icon icon='mdi:alert-circle' />,
          title: 'Account Suspended',
          description: 'Your account has been temporarily suspended. Please contact support for assistance.',
          bgColor: '#ffebee'
        }
      default:
        return {
          color: 'default' as const,
          icon: <Icon icon='mdi:clock-outline' />,
          title: 'Unknown Status',
          description: 'Unable to determine account status. Please contact support.',
          bgColor: '#f5f5f5'
        }
    }
  }

  const handleRefresh = () => {
    setLoading(true)

    // Simulate API call to refresh merchant data
    setTimeout(() => {
      setLoading(false)

      // In real implementation, you would call an API to refresh user data
      window.location.reload()
    }, 1000)
  }

  const handleContactSupport = () => {
    // In real implementation, this could open a support ticket or redirect to contact page
    alert('Contact support functionality would be implemented here')
  }

  if (!merchant) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  const statusConfig = getStatusConfig(merchant.verificationStatus)

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Account Status
      </Typography>

      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Box
            sx={{
              backgroundColor: statusConfig.bgColor,
              padding: 3,
              borderRadius: 2,
              marginBottom: 3
            }}
          >
            <Box display="flex" alignItems="center" marginBottom={2}>
              {statusConfig.icon}
              <Typography variant="h5" sx={{ marginLeft: 2 }}>
                {statusConfig.title}
              </Typography>
            </Box>

            <Chip
              label={merchant.verificationStatus.toUpperCase()}
              color={statusConfig.color}
              sx={{ marginBottom: 2 }}
            />

            <Typography variant="body1" color="text.secondary">
              {statusConfig.description}
            </Typography>
          </Box>

          <Divider sx={{ marginY: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Business Information
              </Typography>
              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Business Name
                </Typography>
                <Typography variant="body1">
                  {merchant.businessName}
                </Typography>
              </Box>
              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {merchant.email}
                </Typography>
              </Box>
              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Phone Number
                </Typography>
                <Typography variant="body1">
                  {merchant.phoneNumber || 'Not provided'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Account Details
              </Typography>
              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Merchant ID
                </Typography>
                <Typography variant="body1">
                  {merchant.merchantId}
                </Typography>
              </Box>
              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Account Created
                </Typography>
                <Typography variant="body1">
                  {merchant.createdAt ? new Date(merchant.createdAt).toLocaleDateString() : 'Not available'}
                </Typography>
              </Box>
              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body1">
                  {merchant.updatedAt ? new Date(merchant.updatedAt).toLocaleDateString() : 'Not available'}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {merchant.verificationStatus === 'rejected' && (
            <Alert severity="error" sx={{ marginTop: 3 }}>
              <Typography variant="h6" gutterBottom>
                Account Rejection Details
              </Typography>
              <Typography variant="body2">
                Your account verification was not successful. This could be due to:
              </Typography>
              <ul>
                <li>Incomplete or incorrect business information</li>
                <li>Invalid documents provided</li>
                <li>Business not meeting our requirements</li>
              </ul>
              <Typography variant="body2" sx={{ marginTop: 2 }}>
                Please contact our support team for specific details about the rejection and next steps.
              </Typography>
            </Alert>
          )}

          {merchant.verificationStatus === 'suspended' && (
            <Alert severity="warning" sx={{ marginTop: 3 }}>
              <Typography variant="h6" gutterBottom>
                Account Suspension Notice
              </Typography>
              <Typography variant="body2">
                Your account has been temporarily suspended. This may be due to:
              </Typography>
              <ul>
                <li>Policy violations</li>
                <li>Security concerns</li>
                <li>Payment issues</li>
              </ul>
              <Typography variant="body2" sx={{ marginTop: 2 }}>
                Please contact our support team immediately to resolve this issue.
              </Typography>
            </Alert>
          )}

          <Box sx={{ marginTop: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<Icon icon='mdi:refresh' />}
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh Status'}
            </Button>

            {(merchant.verificationStatus === 'rejected' || merchant.verificationStatus === 'suspended') && (
              <Button
                variant="contained"
                onClick={handleContactSupport}
              >
                Contact Support
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

// Set page properties
MerchantAccountStatus.authGuard = true
MerchantAccountStatus.guestGuard = false
MerchantAccountStatus.merchantApprovalGuard = false // Don't apply merchant approval guard to this page

export default MerchantAccountStatus
