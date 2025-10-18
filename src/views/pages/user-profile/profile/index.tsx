// ** React
import { useMemo } from 'react'

// ** MUI Components
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// import Box from '@mui/material/Box'
// import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

// import Avatar from '@mui/material/Avatar'

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

  // Touch incoming prop to avoid unused-var while this tab uses merchant UI
  void data

  const merchant = useMemo(() => (user as MerchantDataType | null) || mockMerchant, [user])

  return (
    <Grid container spacing={6} sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
      {/* Left column: Account card + Quick transfer */}

      {/* Right column: Summary, yearly cards, chart, invite */}
      <Grid item lg={12} md={12} xs={12}>
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
          </Grid>
          <Grid item xs={12} md={6}>
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
