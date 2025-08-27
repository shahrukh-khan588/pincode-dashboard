// ** React Imports
import { useMemo, useState } from 'react'

// ** Next Imports
import type { NextPage } from 'next'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Slider from '@mui/material/Slider'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'


//
import IconButton from '@mui/material/IconButton'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Types
import type { MerchantDataType } from 'src/context/types'

// ** Icon
import Icon from 'src/@core/components/icon'

// ** Animation
import { motion } from 'framer-motion'

// ** Data Grid
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Recharts
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts'

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

//

//

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

const mockPayouts: Array<{ id: string; date: string; amount: number; status: 'paid' | 'pending' | 'failed'; reference: string; type?: 'credit' | 'debit' }> = [
  { id: 'P001', date: '2025-08-16', amount: 12500, status: 'paid', reference: 'Sale POS #221', type: 'credit' },
  { id: 'P002', date: '2025-08-13', amount: -4200, status: 'paid', reference: 'Refund TRX-8L1A71', type: 'debit' },
  { id: 'P003', date: '2025-08-10', amount: 23100, status: 'pending', reference: 'Payout to Bank', type: 'debit' },
  { id: 'P004', date: '2025-08-07', amount: 9900, status: 'failed', reference: 'Wallet Top-up', type: 'credit' },
  { id: 'P005', date: '2025-08-05', amount: 15600, status: 'paid', reference: 'Online Order #5541', type: 'credit' },
  { id: 'P006', date: '2025-08-03', amount: -3600, status: 'paid', reference: 'Chargeback #9912', type: 'debit' },
  { id: 'P007', date: '2025-08-01', amount: 8200, status: 'paid', reference: 'Shop Sale #991', type: 'credit' }
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(value)

const maskAccount = (value?: string) => {
  if (!value) {
    return '-'
  }

  const last4 = value.slice(-4)

  return `•••• •••• •••• ${last4}`
}

const MerchantProfilePage: NextPage & { authGuard?: boolean } = () => {
  const { user } = useAuth()
  const [yearMode, setYearMode] = useState<'income' | 'expenses'>('income')
  const [showAccountInfo, setShowAccountInfo] = useState(false)
  const [showBankInfo, setShowBankInfo] = useState(false)
  const [transferAmount, setTransferAmount] = useState(10000)
  const [selectedBank, setSelectedBank] = useState('')
  const [activeTab, setActiveTab] = useState<'personal' | 'bank' | 'transactions'>('personal')

  const merchant = useMemo(() => (user as MerchantDataType | null) || mockMerchant, [user])

  const maskBalance = (value: number) => showAccountInfo ? formatCurrency(value) : '••••••'

  return (
    <Grid container spacing={6}>
      {/* Tabs */}
      <Grid item xs={12} sx={{ order: { xs: 0, md: 0 } }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          variant='scrollable'
          allowScrollButtonsMobile
        >
          <Tab label='Personal Data' value='personal' />
          <Tab label='Bank Details' value='bank' />
          <Tab label='Transactions' value='transactions' />
        </Tabs>
      </Grid>
      {/* Left Column (Personal Data tab) */}
      {activeTab === 'personal' && (
        <Grid item xs={12} md={8} sx={{ order: { xs: 1, md: 1 } }}>
          <Card>
            <CardHeader
              title='Balance Summary'
              titleTypographyProps={{ variant: 'h6', fontSize: '1.1rem' }}
              action={<Button variant='contained' startIcon={<Icon icon='mdi:cash-plus' />}>Request</Button>}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ color: 'text.secondary' }}>Available</Typography>
                  <Typography variant='h5' sx={{ mt: 1 }}>{formatCurrency(merchant?.walletBalance?.availableBalance || 0)}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ color: 'text.secondary' }}>Pending</Typography>
                  <Typography variant='h5' sx={{ mt: 1 }}>{formatCurrency(merchant?.walletBalance?.pendingBalance || 0)}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ color: 'text.secondary' }}>Total Earnings</Typography>
                  <Typography variant='h5' sx={{ mt: 1 }}>{formatCurrency(merchant?.walletBalance?.totalEarnings || 0)}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={6} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <motion.div animate={{ scale: yearMode === 'income' ? 1.02 : 1 }}>
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
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div animate={{ scale: yearMode === 'expenses' ? 1.02 : 1 }}>
                <Card onClick={() => setYearMode('expenses')} sx={{ cursor: 'pointer', border: theme => yearMode === 'expenses' ? `2px solid ${theme.palette.error.main}` : undefined }}>
                  <CardContent>
                    <Stack direction='row' spacing={2} alignItems='center'>
                      <Avatar sx={{ bgcolor: 'error.light', color: 'error.dark' }}>
                        <Icon icon='mdi:trending-down' />
                      </Avatar>
                      <Box>
                        <Typography variant='subtitle2'>Yearly Expenses</Typography>
                        <Typography variant='h5'>{formatCurrency(450000)}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          <Card sx={{ mt: 6 }}>
            <CardHeader
              title='Balance Statistics'
              titleTypographyProps={{ variant: 'h6', fontSize: '1.1rem' }}
              subheader='Monthly balances'
            />
            <Divider />
            <CardContent>
              <BalanceAreaChart />
            </CardContent>
          </Card>

          {/* Invite friends card (left column) */}
          <Card sx={{ mt: 6 }}>
            <CardContent>
              <Stack spacing={3}>
                {/* Header Section */}
                <Box>
                  <Typography variant='h5' sx={{ fontWeight: 700, mb: 1 }}>
                    Invite friends
                  </Typography>
                  <Typography variant='h6' sx={{ color: 'text.secondary', mb: 2 }}>
                    and earn
                  </Typography>
                  <Typography variant='h4' sx={{ fontWeight: 800, color: 'primary.main' }}>
                    Rs: 500
                  </Typography>
                </Box>

                {/* Description */}
                <Typography variant='body2' sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  Share Pincode with your friends and earn Rs. 500 for each successful referral. Help them discover seamless digital payments while earning rewards for yourself.
                </Typography>

                {/* 3D Icon and Action Section */}
                <Stack direction='row' spacing={3} alignItems='center' justifyContent='space-between'>
                  {/* 3D Icon */}
                  <Box sx={{
                    width: 80,
                    height: 80,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    transform: 'rotateY(15deg) rotateX(10deg)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'rotateY(20deg) rotateX(15deg) scale(1.05)'
                    }
                  }}>
                    <Icon icon='mdi:gift-outline' fontSize={40} color="white" />
                  </Box>

                  {/* Social Share Buttons */}
                  <Stack direction='row' spacing={1}>
                    <IconButton
                      sx={{
                        bgcolor: '#25D366',
                        color: 'white',
                        '&:hover': { bgcolor: '#128C7E' }
                      }}
                    >
                      <Icon icon='mdi:whatsapp' />
                    </IconButton>
                    <IconButton
                      sx={{
                        bgcolor: '#1877F2',
                        color: 'white',
                        '&:hover': { bgcolor: '#0d6efd' }
                      }}
                    >
                      <Icon icon='mdi:facebook' />
                    </IconButton>
                    <IconButton
                      sx={{
                        bgcolor: '#1DA1F2',
                        color: 'white',
                        '&:hover': { bgcolor: '#0d8bd9' }
                      }}
                    >
                      <Icon icon='mdi:twitter' />
                    </IconButton>
                    <IconButton
                      sx={{
                        bgcolor: '#EA4335',
                        color: 'white',
                        '&:hover': { bgcolor: '#d32f2f' }
                      }}
                    >
                      <Icon icon='mdi:email' />
                    </IconButton>
                  </Stack>
                </Stack>

                {/* Invite Button */}
                <Button
                  variant='contained'
                  fullWidth
                  size="large"
                  startIcon={<Icon icon='mdi:share-variant' />}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                    }
                  }}
                >
                  Invite Friends Now
                </Button>
              </Stack>
            </CardContent>
          </Card>

        </Grid>
      )}

      {/* Right Column */}
      <Grid item xs={12} md={4} sx={{ order: { xs: 2, md: 2 } }}>
        {activeTab === 'personal' && (
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
                background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%239C92AC\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                backgroundSize: '30px 30px',
                opacity: 0.1
              }
            }}
          >
            <CardContent sx={{ position: 'relative', height: '100%', p: theme => theme.spacing(4, 5) }}>
              {/* Chip and Logo Section */}
              <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4, mt: 2 }}>
                {/* Chip SVG */}

                {/* Logo */}
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

              {/* Balance Section - Top Left */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 100,
                  left: 25,
                  zIndex: 2  // Ensure it's above other elements
                }}
              >
                <Typography
                  sx={{
                    color: 'grey.400',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    mb: 1
                  }}
                >
                  CURRENT BALANCE
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <motion.div
                    key={showAccountInfo ? 'visible' : 'hidden'}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <Typography
                      variant='h4'
                      sx={{
                        color: 'common.white',
                        fontWeight: 700,
                        fontSize: '2rem',
                        letterSpacing: showAccountInfo ? 'normal' : '4px'
                      }}
                    >
                      {maskBalance(merchant?.walletBalance?.availableBalance || 0)}
                    </Typography>
                  </motion.div>
                  <IconButton
                    size='small'
                    onClick={() => setShowAccountInfo(!showAccountInfo)}
                    sx={{
                      color: 'grey.400',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      width: 28,
                      height: 28,
                      minHeight: 28,
                      '&:hover': {
                        color: 'common.white',
                        bgcolor: 'rgba(255,255,255,0.2)'
                      },
                      cursor: 'pointer',
                      zIndex: 3  // Ensure button is clickable
                    }}
                  >
                    <Icon icon={showAccountInfo ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} fontSize={16} />
                  </IconButton>
                </Stack>
              </Box>

              {/* Account Type and Number - Middle Right */}
              <Box sx={{ mt: 12, mb: 6, position: 'absolute', right: 25 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1, justifyContent: 'flex-end' }}>
                  <Typography sx={{ color: 'grey.400', fontWeight: 600, fontSize: '0.75rem' }}>
                    PINCODE ACCOUNT
                  </Typography>
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.1)',
                      width: 34,
                      height: 34
                    }}
                  >
                    <Icon icon='mdi:credit-card-chip-outline' fontSize={20} color="success.light" />
                  </Avatar>
                </Stack>
                <motion.div
                  key={showAccountInfo ? 'visible' : 'hidden'}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <Typography
                    sx={{
                      letterSpacing: showAccountInfo ? '3px' : '4px',
                      fontFamily: 'monospace',
                      fontSize: '1rem',
                      color: 'common.white',
                      textAlign: 'right'
                    }}
                  >
                    {showAccountInfo ? merchant.bankAccountDetails.accountNumber : maskAccount(merchant.bankAccountDetails.accountNumber)}
                  </Typography>
                </motion.div>
              </Box>

              {/* Account Holder Details - Bottom Right */}
              <Box sx={{ position: 'absolute', bottom: 25, right: 25, textAlign: 'right' }}>
                <Typography
                  sx={{
                    color: 'grey.400',
                    fontSize: '0.65rem',
                    mb: 0.5
                  }}
                >
                  ACCOUNT HOLDER
                </Typography>
                <Typography
                  sx={{
                    color: 'common.white',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    mb: 2
                  }}
                >
                  {merchant?.bankAccountDetails?.accountTitle}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} justifyContent="flex-end">
                  <Icon
                    icon={merchant.verificationStatus === 'pending' ? 'mdi:clock-outline' : 'mdi:check-circle'}
                    fontSize={16}
                    color={merchant.verificationStatus === 'pending' ? '#ffa726' : '#66bb6a'}
                  />
                  <Typography
                    sx={{
                      color: 'grey.400',
                      fontSize: '0.65rem',
                      textTransform: 'uppercase'
                    }}
                  >
                    {merchant.verificationStatus} Account
                  </Typography>
                </Stack>
              </Box>

            </CardContent>
          </Card>
        )}

        {activeTab === 'bank' && (
          <Card
            sx={{
              mt: 6,
              overflow: 'hidden',
              position: 'relative',
              minHeight: 250,
              background: theme => `linear-gradient(135deg, ${theme.palette.grey[900]}, ${theme.palette.primary.dark})`,
              color: theme => theme.palette.success.light,
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), 0 6px 20px rgba(0, 0, 0, 0.3)',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease-in-out'
              },
              transition: 'all 0.3s ease-in-out',
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
              {/* Chip and Logo Section */}
              <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4, mt: 2 }}>
                {/* Chip SVG */}
                <Box
                  sx={{
                    width: 55,
                    height: 45,
                    background: theme => `linear-gradient(135deg, ${theme.palette.warning.light}, ${theme.palette.warning.main})`,
                    borderRadius: '6px',
                    position: 'relative',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    flexShrink: 0,
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: 6,
                      right: 6,
                      height: '45%',
                      transform: 'translateY(-50%)',
                      background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)',
                    }
                  }}
                />
                {/* Bank Logo */}
                <Avatar
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.1)',
                    width: 40,
                    height: 40
                  }}
                >
                  <Icon icon='mdi:bank' fontSize={24} />
                </Avatar>
              </Stack>

              {/* Bank Name Section - Top Right */}
              <Box sx={{ position: 'absolute', top: 25, right: 25 }}>
                <Typography
                  sx={{
                    color: 'grey.400',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    mb: 1
                  }}
                >
                  BANK NAME
                </Typography>
                <Typography
                  sx={{
                    color: 'common.white',
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}
                >
                  {merchant.bankAccountDetails.bankName}
                </Typography>
              </Box>

              {/* Account Number Section - Middle Right */}
              <Box sx={{ mt: 12, mb: 6, position: 'absolute', right: 25 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1, justifyContent: 'flex-end' }}>
                  <Typography sx={{ color: 'grey.400', fontWeight: 600, fontSize: '0.65rem' }}>
                    ACCOUNT NUMBER
                  </Typography>
                  <IconButton
                    size='small'
                    onClick={() => setShowBankInfo(!showBankInfo)}
                    sx={{
                      color: 'grey.400',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      width: 24,
                      height: 24,
                      '&:hover': {
                        color: 'common.white',
                        bgcolor: 'rgba(255,255,255,0.2)'
                      }
                    }}
                  >
                    <Icon icon={showBankInfo ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} fontSize={14} />
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={() => navigator.clipboard.writeText(merchant.bankAccountDetails.accountNumber)}
                    sx={{
                      color: 'grey.400',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      width: 24,
                      height: 24,
                      '&:hover': {
                        color: 'common.white',
                        bgcolor: 'rgba(255,255,255,0.2)'
                      }
                    }}
                  >
                    <Icon icon='mdi:content-copy' fontSize={14} />
                  </IconButton>
                </Stack>
                <motion.div
                  key={showBankInfo ? 'visible' : 'hidden'}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <Typography
                    sx={{
                      letterSpacing: showBankInfo ? '3px' : '4px',
                      fontFamily: 'monospace',
                      fontSize: '1rem',
                      color: 'common.white',
                      textAlign: 'right'
                    }}
                  >
                    {showBankInfo ? merchant.bankAccountDetails.accountNumber : maskAccount(merchant.bankAccountDetails.accountNumber)}
                  </Typography>
                </motion.div>
              </Box>

              {/* IBAN Section - Bottom Left */}
              <Box sx={{ position: 'absolute', bottom: -10, left: 25 }}>
                <Typography
                  sx={{
                    color: 'grey.400',
                    fontSize: '0.65rem',
                    mb: 0.5
                  }}
                >
                  IBAN
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <motion.div
                    key={showBankInfo ? 'visible' : 'hidden'}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <Typography
                      sx={{
                        color: 'common.white',
                        fontSize: '0.8rem',
                        fontFamily: 'monospace',
                        letterSpacing: showBankInfo ? '1px' : '2px'
                      }}
                    >
                      {showBankInfo ? merchant.bankAccountDetails.iban : maskAccount(merchant.bankAccountDetails.iban)}
                    </Typography>
                  </motion.div>
                  <IconButton
                    size='small'
                    onClick={() => navigator.clipboard.writeText(merchant.bankAccountDetails.iban)}
                    sx={{
                      color: 'grey.400',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      width: 20,
                      height: 20,
                      '&:hover': {
                        color: 'common.white',
                        bgcolor: 'rgba(255,255,255,0.2)'
                      }
                    }}
                  >
                    <Icon icon='mdi:content-copy' fontSize={12} />
                  </IconButton>
                </Stack>
              </Box>

              {/* Branch Code - Bottom Right */}
              <Box sx={{ position: 'absolute', bottom: -80, left: 25, textAlign: 'left' }}>
                <Typography
                  sx={{
                    color: 'grey.400',
                    fontSize: '0.65rem',
                    mb: 0.5
                  }}
                >
                  BRANCH CODE
                </Typography>
                <Typography
                  sx={{
                    color: 'common.white',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    letterSpacing: '0.5px'
                  }}
                >
                  {merchant.bankAccountDetails.branchCode}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {activeTab === 'bank' && (
          <Card sx={{ mt: 6 }}>
            <CardHeader
              title='Quick Transfer'
              titleTypographyProps={{ variant: 'h6', fontSize: '1.1rem' }}
              subheader='Transfer to your bank account'
            />
            <Divider />
            <CardContent>
              <Stack spacing={4}>
                {/* Bank Selection */}
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontWeight: 600 }}>
                    Select Bank Account
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      displayEmpty
                      sx={{ minHeight: 50 }}
                    >
                      <MenuItem value="">
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: 'primary.main', width: 28, height: 28 }}>
                            <Icon icon='mdi:bank' fontSize={18} />
                          </Avatar>
                          <Typography>Select your bank account</Typography>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="mcb">
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: 'success.main', width: 28, height: 28 }}>
                            <Icon icon='mdi:bank' fontSize={18} />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {merchant.bankAccountDetails.bankName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {maskAccount(merchant.bankAccountDetails.accountNumber)}
                            </Typography>
                          </Box>
                        </Stack>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Amount Slider */}
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontWeight: 600, textTransform: 'uppercase' }}>
                    INSERT AMOUNT
                  </Typography>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 800,
                        fontSize: '1.5rem',
                        lineHeight: 1.2,
                        letterSpacing: '0.02em'
                      }}
                    >
                      {transferAmount.toLocaleString()}
                    </Typography>
                  </Box>
                  <Slider
                    value={transferAmount}
                    onChange={(_, value) => setTransferAmount(value as number)}
                    min={1000}
                    max={100000}
                    step={1000}
                    marks={[
                      { value: 1000 },
                      { value: 10000 },
                      { value: 15000 },
                      { value: 20000 },
                      { value: 25000 },
                      { value: 30000 },
                      { value: 35000 },
                      { value: 40000 },
                      { value: 45000 },
                      { value: 50000 },
                      { value: 55000 },
                      { value: 60000 },
                      { value: 65000 },
                      { value: 70000 },
                      { value: 75000 },
                      { value: 80000 },
                      { value: 85000 },
                      { value: 90000 },
                      { value: 95000 },
                      { value: 100000 }
                    ]}
                    sx={{
                      '& .MuiSlider-thumb': {
                        backgroundColor: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.dark'
                        }
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: 'primary.main'
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: 'grey.300'
                      }
                    }}
                  />
                </Box>

                {/* Remaining Balance */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" py={4}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    AVAILABLE BALANCE
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                    {formatCurrency(merchant?.walletBalance?.availableBalance || 0 - transferAmount)}
                  </Typography>
                </Stack>

                {/* Transfer Notification */}
                <Alert
                  severity="info"
                  icon={<Icon icon='mdi:clock-outline' />}
                  sx={{
                    '& .MuiAlert-message': {
                      width: '100%'
                    }
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Transfer Time Estimate
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      {transferAmount <= 50000 ? 'Instant transfer (within 30 seconds)' : 'Standard transfer (2-4 business hours)'}
                    </Typography>
                  </Box>
                </Alert>

                {/* Transfer Button */}
                <Button
                  variant='contained'
                  fullWidth
                  size="large"
                  startIcon={<Icon icon='mdi:bank-transfer' />}
                  disabled={!selectedBank || transferAmount > (merchant?.walletBalance?.availableBalance || 0)}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                >
                  Transfer {formatCurrency(transferAmount)}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

      </Grid>


      {/* Full transactions DataGrid */}
      {activeTab === 'transactions' && (
        <Grid item xs={12} sx={{ order: 3 }}>
          <Card>
            <CardHeader
              title='All Transactions'
              titleTypographyProps={{ variant: 'h6', fontSize: '1.1rem' }}
            />
            <Divider />
            <CardContent>
              <div style={{ width: '100%' }}>
                <DataGrid
                  autoHeight
                  rows={mockPayouts.map((t, idx) => ({ id: idx + 1, date: t.date, reference: t.reference, amount: t.amount, status: t.status, type: t.type }))}
                  columns={transactionColumns}
                  rowsPerPageOptions={[5, 10]}
                  pageSize={5}
                />
              </div>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

MerchantProfilePage.authGuard = true

export default MerchantProfilePage

// --- Helpers below: lightweight chart + DataGrid columns
const balanceSeries = monthLabels.map((m, idx) => ({ month: m, balance: 50 + idx * 5 + (idx % 3) * 7 }))

const BalanceAreaChart = () => (
  <Box sx={{ width: '100%', height: 260, textAlign: 'center' }}>
    <ResponsiveContainer width='100%' height='100%'>
      <AreaChart data={balanceSeries} margin={{ left: -20, right: 10 }}>
        <defs>
          <linearGradient id='balanceGradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#9155FD' stopOpacity={0.6} />
            <stop offset='95%' stopColor='#9155FD' stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray='3 3' vertical={false} />
        <XAxis dataKey='month' axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <RechartsTooltip />
        <Area type='monotone' dataKey='balance' stroke='#9155FD' fill='url(#balanceGradient)' strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  </Box>
)

const transactionColumns: GridColDef[] = [
  { field: 'date', headerName: 'Date', flex: 0.8, valueGetter: params => new Date(params.value as string).toLocaleDateString() },
  { field: 'reference', headerName: 'Description', flex: 1.4 },
  {
    field: 'amount',
    headerName: 'Amount',
    flex: 0.8,
    align: 'right',
    headerAlign: 'right',
    renderCell: params => {
      const v = params.value as number

      return <Typography sx={{ color: v >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>{formatCurrency(Math.abs(v))}</Typography>
    }
  },
  { field: 'status', headerName: 'Status', flex: 0.6 },
  { field: 'type', headerName: 'Type', flex: 0.6 }
]
