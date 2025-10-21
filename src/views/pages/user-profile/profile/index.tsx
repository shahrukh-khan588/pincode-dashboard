// ** React
import { useMemo, useState } from 'react'

// ** MUI Components
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

// ** Store/Context
import { useAuth } from 'src/hooks/useAuth'

// ** Types
// import type { ProfileTabType } from 'src/@fake-db/types'
import type { MerchantDataType } from 'src/context/types'

// ** Icons
import Icon from 'src/@core/components/icon'


// ** Charts

// ** Stats Cards
import router from 'next/router'

const ProfileTab = ({ data }: { data: any }) => {
  const { user } = useAuth()
  const [copySuccess, setCopySuccess] = useState(false)

  // Touch incoming prop to avoid unused-var while this tab uses merchant UI
  void data

  const merchant = useMemo(() => user as MerchantDataType | null, [user])

  const handleCopyMerchantId = async () => {
    try {
      await navigator.clipboard.writeText(merchant?.merchantId || '')
      setCopySuccess(true)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <Grid container spacing={6} sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
      {/* Left column: Account card + Quick transfer */}

      {/* Right column: Summary, yearly cards, chart, invite */}
      <Grid item lg={12} md={12} xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title='Merchant Details' titleTypographyProps={{ variant: 'h6', fontSize: '1.1rem' }} action={<Button onClick={() => router.push('/pages/account-settings/account/')} variant='contained' startIcon={<Icon icon='mdi:cash-plus' />}>Edit profile</Button>} />
              <Divider />
              <CardContent>
                <Grid container spacing={4}>
                  {/* Merchant ID */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Icon icon='mdi:identifier' color='primary.main' />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant='subtitle2' color='text.secondary'>
                          Merchant ID
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant='body2' sx={{ fontFamily: 'monospace' }}>
                            {merchant?.merchantId}
                          </Typography>
                          <Tooltip title='Copy Merchant ID'>
                            <IconButton size='small' onClick={handleCopyMerchantId}>
                              <Icon icon='mdi:content-copy' />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Icon icon='mdi:email-outline' color='primary.main' />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant='subtitle2' color='text.secondary'>
                          Email
                        </Typography>
                        <Typography variant='body2'>
                          {merchant?.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Phone Number */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Icon icon='mdi:phone-outline' color='primary.main' />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant='subtitle2' color='text.secondary'>
                          Phone Number
                        </Typography>
                        <Typography variant='body2'>
                          {merchant?.phoneNumber}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Business Address */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ mt: 0.5 }}>
                        <Icon icon='mdi:map-marker-outline' color='primary.main' />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant='subtitle2' color='text.secondary'>
                          Business Address
                        </Typography>
                        <Typography variant='body2'>
                          {merchant?.businessAddress}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Verification Status */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Icon
                        icon={merchant?.verificationStatus === 'verified' ? 'mdi:check-circle' : 'mdi:clock-outline'}
                        color={merchant?.verificationStatus === 'verified' ? 'success.main' : 'warning.main'}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant='subtitle2' color='text.secondary'>
                          Verification Status
                        </Typography>
                        <Chip
                          label={merchant?.verificationStatus ? merchant.verificationStatus.charAt(0).toUpperCase() + merchant.verificationStatus.slice(1) : 'Unknown'}
                          color={merchant?.verificationStatus === 'verified' ? 'success' : 'warning'}
                          size='small'
                          variant='outlined'
                        />
                      </Box>
                    </Box>
                  </Grid>

                  {/* Account Status */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Icon
                        icon={merchant?.isActive ? 'mdi:check-circle' : 'mdi:close-circle'}
                        color={merchant?.isActive ? 'success.main' : 'error.main'}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant='subtitle2' color='text.secondary'>
                          Account Status
                        </Typography>
                        <Chip
                          label={merchant?.isActive ? 'Active' : 'Inactive'}
                          color={merchant?.isActive ? 'success' : 'error'}
                          size='small'
                          variant='outlined'
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setCopySuccess(false)} severity='success' sx={{ width: '100%' }}>
          Merchant ID copied to clipboard!
        </Alert>
      </Snackbar>
    </Grid>
  )
}

export default ProfileTab
