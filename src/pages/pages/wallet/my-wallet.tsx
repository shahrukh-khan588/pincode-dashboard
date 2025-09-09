// ** React Imports
import React, { useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import { styled, useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useGetWalletDetailsQuery } from 'src/store/api/v1/endpoints/my-wallet'

// ** Types
import type { MerchantDataType } from 'src/context/types'

// ** Components
import CardWelcomeBack from 'src/views/ui/cards/gamification/CardWelcomeBack'
import PincodeInput from 'src/@core/components/PincodeInput'
import PayoutRequestForm from '@/pages/components/PayoutRequestForm'

// ** Styled Components
const TransactionItem = styled(ListItem)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}))

// ** Mock Data
const mockTransactions = [
  {
    id: 1,
    type: 'credit',
    amount: 5000,
    description: 'Payment received from Customer A',
    date: '2024-01-15',
    status: 'completed',
    icon: 'mdi:arrow-down'
  },
  {
    id: 2,
    type: 'debit',
    amount: 1200,
    description: 'Payment to Supplier B',
    date: '2024-01-14',
    status: 'completed',
    icon: 'mdi:arrow-up'
  },
  {
    id: 3,
    type: 'credit',
    amount: 3000,
    description: 'Refund from cancelled order',
    date: '2024-01-13',
    status: 'pending',
    icon: 'mdi:refresh'
  },
  {
    id: 4,
    type: 'debit',
    amount: 800,
    description: 'Service fee',
    date: '2024-01-12',
    status: 'completed',
    icon: 'mdi:currency-usd'
  }
]


const Wallet = () => {
  // ** States
  const [selectedTab, setSelectedTab] = useState('transactions')
  const [showAddMoney, setShowAddMoney] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [amount, setAmount] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [transferAmount, setTransferAmount] = useState(10000)
  const [selectedBank, setSelectedBank] = useState('')
  const [showPincodeDialog, setShowPincodeDialog] = useState(false)
  const [pincodeAction, setPincodeAction] = useState<'transfer' | 'withdraw' | 'setup' | null>(null)
  const [userPincode, setUserPincode] = useState<string | null>(null)
  const [pincodeError, setPincodeError] = useState('')

  // ** Hooks
  const theme = useTheme()
  const router = useRouter()
  const auth = useAuth()

  // ** Fetch wallet details from API
  const { data: walletDetails, isLoading: isWalletLoading, error: walletError } = useGetWalletDetailsQuery()

  // ** Debug: Log wallet data
  React.useEffect(() => {
    if (walletDetails) {
      console.log('💰 Wallet Details:', walletDetails)
    }
    if (walletError) {
      console.error('❌ Wallet Error:', walletError)
    }
  }, [walletDetails, walletError])

  // ** Mock merchant data for transfer functionality (keeping for bank details)
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
      availableBalance: walletDetails?.availableBalance || 0,
      pendingBalance: walletDetails?.pendingBalance || 0,
      totalEarnings: walletDetails?.totalEarnings || 0,
      lastUpdated: walletDetails?.lastUpdated || new Date().toISOString()
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

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(value)
  const maskAccount = (value?: string) => {
    if (!value) return '-'
    const last4 = value.slice(-4)

    return `•••• •••• •••• ${last4}`
  }

  const handleLogout = () => {
    auth.logout()
    router.push('/login')
  }

  const handleAddMoney = () => {
    if (amount) {
      setSnackbar({
        open: true,
        message: `Successfully added RS: ${amount} to wallet`,
        severity: 'success'
      })
      setShowAddMoney(false)
      setAmount('')
    }
  }



  const handlePincodeComplete = (pincode: string) => {
    setPincodeError('')

    if (pincodeAction === 'setup') {
      // Setting up new pincode
      setUserPincode(pincode)
      setSnackbar({
        open: true,
        message: 'PIN set successfully! Your wallet is now secured.',
        severity: 'success'
      })
      setShowPincodeDialog(false)
      setPincodeAction(null)
    } else {
      // Verifying existing pincode
      if (userPincode && pincode === userPincode) {
        setSnackbar({
          open: true,
          message: 'PIN verified successfully!',
          severity: 'success'
        })

        // Execute the action based on pincodeAction
        if (pincodeAction === 'transfer') {
          executeTransfer()
        } else if (pincodeAction === 'withdraw') {
          executeWithdraw()
        }

        setShowPincodeDialog(false)
        setPincodeAction(null)
      } else {
        setPincodeError('Invalid PIN. Please try again.')
      }
    }
  }

  const handlePincodeError = (error: string) => {
    setPincodeError(error)
  }

  const openPincodeDialog = (action: 'transfer' | 'withdraw' | 'setup') => {
    if (action === 'setup' || !userPincode) {
      setPincodeAction('setup')
      setShowPincodeDialog(true)
    } else {
      setPincodeAction(action)
      setShowPincodeDialog(true)
    }
  }

  const executeTransfer = () => {
    if (selectedBank && transferAmount <= (mockMerchant?.walletBalance?.availableBalance || 0)) {
      setSnackbar({
        open: true,
        message: `Successfully transferred ${formatCurrency(transferAmount)} to your bank account`,
        severity: 'success'
      })

      // Reset form
      setTransferAmount(10000)
      setSelectedBank('')
    }
  }

  const executeWithdraw = () => {
    if (amount && selectedBank) {
      setSnackbar({
        open: true,
        message: `Withdrawal request of ${formatCurrency(parseInt(amount))} to ${mockMerchant?.bankAccountDetails?.bankName} submitted`,
        severity: 'success'
      })
      setShowWithdraw(false)
      setAmount('')
      setSelectedBank('')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'failed':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Back Card */}
      <Box sx={{ mb: 4 }}>

      </Box>

      {/* Wallet Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant='h4' sx={{ fontWeight: 600 }}>
            My Wallet
          </Typography>
          {!userPincode && (
            <Button
              variant='contained'
              size='small'
              startIcon={<Icon icon='mdi:lock-plus' />}
              onClick={() => openPincodeDialog('setup')}
              sx={{ ml: 2 }}
            >
              Set PIN
            </Button>
          )}
        </Box>
        <Typography variant='body1' color='text.secondary'>
          Manage your payments, transactions
        </Typography>
        {userPincode && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
            <Chip
              label='Secured with PIN'
              color='success'
              size='small'
              icon={<Icon icon='mdi:shield-check' />}
            />
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Wallet Balance Card */}
        <Grid item xs={12} md={12}>
          {isWalletLoading ? (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <Typography>Loading wallet details...</Typography>
                </Box>
              </CardContent>
            </Card>
          ) : walletError ? (
            <Card>
              <CardContent>
                <Alert severity="error">
                  Failed to load wallet details. Please try again.
                </Alert>
              </CardContent>
            </Card>
          ) : walletDetails ? (
            <CardWelcomeBack
              merchant={mockMerchant}
              walletBalance={walletDetails.availableBalance}
              totalEarnings={walletDetails.totalEarnings}
              pendingAmount={walletDetails.pendingBalance}
              onWithdraw={() => setShowWithdraw(true)}
            />
          ) : (
            <Card>
              <CardContent>
                <Alert severity="warning">
                  No wallet data available. Please contact support.
                </Alert>
              </CardContent>
            </Card>
          )}
        </Grid>



        {/* Navigation Tabs */}
        <Grid item xs={12}>
          <Paper sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider' }}>
              {[
                { key: 'transactions', label: 'Recent Transactions', icon: 'mdi:swap-horizontal' },
                { key: 'transfer', label: 'Quick Transfer', icon: 'mdi:bank-transfer' },
                { key: 'support', label: 'Support', icon: 'mdi:help-circle' }
              ].map((tab) => (
                <Button
                  key={tab.key}
                  startIcon={<Icon icon={tab.icon} />}
                  onClick={() => setSelectedTab(tab.key)}
                  sx={{
                    flex: 1,
                    py: 2,
                    borderRadius: 0,
                    borderBottom: selectedTab === tab.key ? 2 : 0,
                    borderColor: 'primary.main',
                    color: selectedTab === tab.key ? 'primary.main' : 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Content Sections */}
        <Grid item xs={12}>
          {selectedTab === 'transfer' && (
            <>
              {isWalletLoading ? (
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                      <Typography>Loading wallet details...</Typography>
                    </Box>
                  </CardContent>
                </Card>
              ) : walletError ? (
                <Card>
                  <CardContent>
                    <Alert severity="error">
                      Failed to load wallet details. Please try again.
                    </Alert>
                  </CardContent>
                </Card>
              ) : walletDetails ? (
                <PayoutRequestForm
                  merchant={mockMerchant}
                  onSuccess={() => {
                    setSnackbar({
                      open: true,
                      message: 'Payout request submitted successfully!',
                      severity: 'success'
                    })

                    // Redirect to payout requests page
                    setTimeout(() => {
                      // window.location.href = '/payout-requests'
                    }, 1500)
                  }}
                  onCancel={() => {
                    // Optional: Add any cancel logic here
                  }}
                />
              ) : (
                <Card>
                  <CardContent>
                    <Alert severity="warning">
                      No wallet data available. Please contact support.
                    </Alert>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {selectedTab === 'transactions' && (
            <Card>
              <CardContent>
                <Typography variant='h6' sx={{ mb: 3 }}>
                  Recent Transactions
                </Typography>
                {mockTransactions.map((transaction) => (
                  <TransactionItem key={transaction.id}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: transaction.type === 'credit' ? 'success.main' : 'error.main' }}>
                        <Icon icon={transaction.icon} />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={transaction.description}
                      secondary={transaction.date}
                      sx={{ flex: 1 }}
                    />
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography
                        variant='body1'
                        fontWeight={600}
                        color={transaction.type === 'credit' ? 'success.main' : 'error.main'}
                      >
                        {transaction.type === 'credit' ? '+' : '-'}RS: {transaction.amount.toLocaleString()}
                      </Typography>
                      <Chip
                        label={transaction.status}
                        size='small'
                        color={getStatusColor(transaction.status) as any}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </TransactionItem>
                ))}
              </CardContent>
            </Card>
          )}



          {selectedTab === 'support' && (
            <Card>
              <CardContent>
                <Typography variant='h6' sx={{ mb: 3 }}>
                  Support & Help
                </Typography>
                <Grid container spacing={3}>

                  <Grid item xs={12} md={6}>
                    <Card variant='outlined'>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Icon icon='mdi:email' color={theme.palette.primary.main} />
                          <Typography variant='h6' sx={{ ml: 1 }}>
                            Email Support
                          </Typography>
                        </Box>
                        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                          Send us an email for detailed assistance
                        </Typography>
                        <Button variant='outlined' startIcon={<Icon icon='mdi:email-outline' />}>
                          Send Email
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Logout Section */}
        <Grid item xs={12}>
          <Card variant='outlined'>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant='h6'>Account</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Manage your account settings and logout
                  </Typography>
                </Box>
                <Button
                  variant='outlined'
                  color='error'
                  startIcon={<Icon icon='mdi:logout' />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Money Dialog */}
      <Dialog open={showAddMoney} onClose={() => setShowAddMoney(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Add Money to Wallet</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label='Amount'
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>RS: </Typography>
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddMoney(false)}>Cancel</Button>
          <Button onClick={handleAddMoney} variant='contained'>Add Money</Button>
        </DialogActions>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdraw} onClose={() => setShowWithdraw(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Withdraw Money</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
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
                        {mockMerchant?.bankAccountDetails?.bankName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {maskAccount(mockMerchant?.bankAccountDetails?.accountNumber)}
                      </Typography>
                    </Box>
                  </Stack>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            fullWidth
            label='Amount'
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>RS: </Typography>
            }}
          />
          <Alert severity='info' sx={{ mb: 2 }}>
            Minimum withdrawal amount: RS: 500
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWithdraw(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setShowWithdraw(false)
              openPincodeDialog('withdraw')
            }}
            variant='contained'
            disabled={!selectedBank || !amount}
          >
            Withdraw
          </Button>
        </DialogActions>
      </Dialog>

      {/* PIN Code Dialog */}
      <Dialog
        open={showPincodeDialog}
        onClose={() => {
          setShowPincodeDialog(false)
          setPincodeAction(null)
          setPincodeError('')
        }}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>
          {pincodeAction === 'setup' ? 'Set Transaction PIN' : 'Verify PIN'}
        </DialogTitle>
        <DialogContent sx={{ py: 4 }}>
          <PincodeInput
            title={pincodeAction === 'setup' ? 'Create 4-digit PIN' : 'Enter your PIN'}
            subtitle={pincodeAction === 'setup'
              ? 'This PIN will be required for all wallet transactions'
              : 'Enter your 4-digit PIN to continue'
            }
            onComplete={handlePincodeComplete}
            onError={handlePincodeError}
            error={pincodeError}
            autoFocus={true}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowPincodeDialog(false)
              setPincodeAction(null)
              setPincodeError('')
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity as any}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

// Set page properties for merchant approval protection
Wallet.authGuard = true
Wallet.merchantApprovalGuard = true
export default Wallet
