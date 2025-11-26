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
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

// import Avatar from '@mui/material/Avatar'

import IconButton from '@mui/material/IconButton'

// ** Store/Context
import { useAuth } from 'src/hooks/useAuth'

// ** Types
// import type { ProfileTabType } from 'src/@fake-db/types'
import type { MerchantDataType } from 'src/context/types'

// ** Icons
import Icon from 'src/@core/components/icon'


// ** Charts

// ** Stats Cards
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'
import router from 'next/router'


const mockMerchant: MerchantDataType = {
  merchantId: 'MERCH_1755529411388_mr61qtivk',
  email: 'malik.electronics@gmail.com',
  firstName: 'Muhammad',
  lastName: 'Malik',
  businessName: 'Malik Electronics & Mobile Center',
  businessAddress: 'Shop No. 15, Main Bazaar, Saddar, Rawalpindi, Punjab, Pakistan',
  taxId: 'NTN-9876543-2',
  phoneNumber: '+92-51-5551234',
  verificationStatus: 'pending',
  isActive: true,
  walletBalance: {
    availableBalance: 0,
    pendingBalance: 0,
    totalEarnings: 0,
    lastUpdated: new Date().toISOString()
  },
  bankAccountDetails: {
    accountNumber: '0987654321098',
    accountTitle: 'Malik Electronics & Mobile Center',
    bankName: 'MCB Bank Limited',
    branchCode: '0456',
    iban: 'PK24MUCB0004560987654321098'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}


const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(value)






const ProfileTab = ({ data }: { data: any }) => {
  const { user } = useAuth()

  // const [yearMode, setYearMode] = useState<'income' | 'expenses'>('income')
  const [showAccountInfo, setShowAccountInfo] = useState(false)

  // Touch incoming prop to avoid unused-var while this tab uses merchant UI
  void data

  const merchant = useMemo(() => (user as MerchantDataType | null) || mockMerchant, [user])
  const maskBalance = (value: number) => (showAccountInfo ? formatCurrency(value) : '••••••')

  return (
    <Grid container spacing={6} sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
      {/* Left column: Account card + Quick transfer */}
      <Grid item lg={4} md={5} xs={12}>
        <Card
          sx={{
            overflow: 'hidden',
            position: 'relative',
            minHeight: 250,
            background: theme => `linear-gradient(135deg, ${theme.palette.grey[900]}, ${theme.palette.primary.dark})`,
            color: theme => theme.palette.success.light,
            borderRadius: '16px',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z\' fill=\'%239C92AC\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
              backgroundSize: '30px 30px',
              opacity: 0.1
            }
          }}
        >
          <CardContent sx={{ position: 'relative', height: '100%', p: theme => theme.spacing(4, 5) }}>
            <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4, mt: 2 }}>
              <Box
                component='img'
                src='/Pincode-logo.svg'
                alt='Pincode'
                sx={{
                  height: 50,
                  filter: 'brightness(0) invert(1)',
                  opacity: 0.9,
                  ml: 2
                }}
              />
            </Stack>

            <Box sx={{ position: 'absolute', top: 100, left: 25, zIndex: 2 }}>
              <Typography sx={{ color: 'grey.400', fontWeight: 700, fontSize: '0.75rem', mb: 1 }}>
                CURRENT BALANCE
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  variant='h4'
                  sx={{ color: 'common.white', fontWeight: 700, fontSize: '2rem', letterSpacing: showAccountInfo ? 'normal' : '4px' }}
                >
                  {maskBalance(merchant?.walletBalance?.availableBalance || 0)}
                </Typography>
                <IconButton
                  size='small'
                  onClick={() => setShowAccountInfo(!showAccountInfo)}
                  sx={{
                    color: 'grey.400',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    width: 28,
                    height: 28,
                    minHeight: 28,
                    '&:hover': { color: 'common.white', bgcolor: 'rgba(255,255,255,0.2)' },
                    cursor: 'pointer',
                    zIndex: 3
                  }}
                >
                  <Icon icon={showAccountInfo ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} fontSize={16} />
                </IconButton>
              </Stack>
            </Box>

            <Box sx={{ position: 'absolute', bottom: 25, right: 25, textAlign: 'right' }}>
              <Typography sx={{ color: 'grey.400', fontSize: '0.65rem', mb: 0.5 }}>
                ACCOUNT HOLDER
              </Typography>
              <Typography sx={{ color: 'common.white', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.5px', mb: 2 }}>
                {merchant?.bankAccountDetails?.accountTitle}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1} justifyContent="flex-end">
                <Icon icon={merchant.verificationStatus === 'pending' ? 'mdi:clock-outline' : 'mdi:check-circle'} fontSize={16} color={merchant.verificationStatus === 'pending' ? '#ffa726' : '#66bb6a'} />
                <Typography sx={{ color: 'grey.400', fontSize: '0.65rem', textTransform: 'uppercase' }}>
                  {merchant.verificationStatus} Account
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>


      </Grid>

      {/* Right column: Summary, yearly cards, chart, invite */}
      <Grid item lg={8} md={7} xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title='Balance Summary' titleTypographyProps={{ variant: 'h6', fontSize: '1.1rem' }} action={<Button onClick={() => router.push('/pages/account-settings/account/')} variant='contained' startIcon={<Icon icon='mdi:cash-plus' />}>Edit profile</Button>} />
              <Divider />
              <CardContent>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={4}>
                    <CardStatisticsVerticalComponent
                      stats={formatCurrency(merchant?.walletBalance?.availableBalance || 0)}
                      title='Available'
                      subtitle='Current balance'
                      icon={<Icon icon='mdi:wallet-outline' />}
                      trend='positive'
                      trendNumber='+0%'
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <CardStatisticsVerticalComponent
                      stats={formatCurrency(merchant?.walletBalance?.pendingBalance || 0)}
                      title='Pending'
                      subtitle='Processing'
                      icon={<Icon icon='mdi:timer-sand' />}
                      trend='positive'
                      trendNumber='+0%'
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <CardStatisticsVerticalComponent
                      stats={formatCurrency(merchant?.walletBalance?.totalEarnings || 0)}
                      title='Total Earnings'
                      subtitle='All-time'
                      icon={<Icon icon='mdi:cash-multiple' />}
                      trend='positive'
                      trendNumber='+0%'
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* <Grid item xs={12} md={6}>
            <Card onClick={() => setYearMode('income')} sx={{ cursor: 'pointer', border: theme => yearMode === 'income' ? `2px solid ${theme.palette.success.main}` : undefined }}>
              <CardContent>
                <Stack direction='row' spacing={2} alignItems='center'>
                  <Avatar sx={{ bgcolor: 'success.light', color: 'success.dark' }}>
                    <Icon icon='mdi:trending-up' />
                  </Avatar>
                  <Box>
                    <Typography variant='subtitle2'>Yearly Income</Typography>
                    <Typography variant='h5'>{formatCurrency(1250000)}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid> */}
          {/* <Grid item xs={12} md={6}>
            <Card onClick={() => setYearMode('expenses')} sx={{ cursor: 'pointer', border: theme => yearMode === 'expenses' ? `2px solid ${theme.palette.error.main}` : undefined }}>
              <CardContent>
                <Stack direction='row' spacing={2} alignItems='center'>
                  <Avatar sx={{ bgcolor: 'error.light', color: 'error.dark' }}>
                    <Icon icon='mdi:trending-down' />
                  </Avatar>
                  <Box>
                    <Typography variant='subtitle2'>Total Payouts</Typography>
                    <Typography variant='h5'>{formatCurrency(450000)}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid> */}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ProfileTab
