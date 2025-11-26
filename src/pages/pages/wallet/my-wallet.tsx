// ** React Imports
import React, { useState, useEffect } from 'react'

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
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import { useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useGetWalletDetailsQuery } from 'src/store/api/v1/endpoints/my-wallet'
import { useCheckPaymentStatusQuery, useGetPayoutRequestsQuery } from 'src/store/api/v1/endpoints/payout'
import { useGetAllBanksQuery } from 'src/store/api/v1/endpoints/banks'

// ** Types
import type { MerchantDataType } from 'src/context/types'

// ** Components
import CardWelcomeBack from 'src/views/ui/cards/gamification/CardWelcomeBack'
import PayoutRequestForm from '@/pages/components/PayoutRequestForm'
import CircularProgress from '@mui/material/CircularProgress'

// ** Styled Components (none for table version)



const Wallet = () => {
  // ** States
  const [selectedTab, setSelectedTab] = useState('transactions')
  const [showAddMoney, setShowAddMoney] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [amount, setAmount] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [selectedBank, setSelectedBank] = useState('')
  const [checkingTransactionRef, setCheckingTransactionRef] = useState<string | null>(null)
  const [checkingProvider, setCheckingProvider] = useState<string | null>(null)

  const { user } = useAuth()
  const merchant = user as MerchantDataType


  // ** Hooks
  const theme = useTheme()
  const router = useRouter()
  const auth = useAuth()

  // ** Fetch wallet details from API
  const { data: walletDetails, isLoading: isWalletLoading, error: walletError } = useGetWalletDetailsQuery()

  // ** Fetch bank accounts from API
  const { data: bankAccounts, isLoading: isBanksLoading, error: banksError } = useGetAllBanksQuery({})

  const [txPage, setTxPage] = useState(1)
  const [txLimit, setTxLimit] = useState(10)
  const [txStatus, setTxStatus] = useState<string>('all')

  const { data: payouts, isLoading, error, refetch: refetchPayouts } = useGetPayoutRequestsQuery({
    page: txPage,
    limit: txLimit,
    status: txStatus !== 'all' ? txStatus : undefined
  })

  // ** Check payment status query
  const {
    data: transactionStatus,
    isLoading: isTransactionStatusLoading,
    error: transactionStatusError,
    refetch: refetchTransactionStatus
  } = useCheckPaymentStatusQuery(
    { provider: checkingProvider || '', transactionRef: checkingTransactionRef || '' },
    {
      skip: !checkingTransactionRef || !checkingProvider,
      refetchOnMountOrArgChange: true // Force refetch when arguments change
    }
  )

  // ** Refetch payouts list when status check succeeds to update the table
  useEffect(() => {
    if (transactionStatus && !isTransactionStatusLoading && checkingTransactionRef) {
      // Refetch the payouts list to show updated status
      refetchPayouts()

      // Show success message
      setSnackbar({
        open: true,
        message: `Transaction status updated: ${transactionStatus.status}`,
        severity: 'success'
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionStatus?.status, transactionStatus?.transactionRef, isTransactionStatusLoading, checkingTransactionRef])

  // ** Handle status check errors
  useEffect(() => {
    if (transactionStatusError && checkingTransactionRef) {
      setSnackbar({
        open: true,
        message: 'Failed to check transaction status. Please try again.',
        severity: 'error'
      })
    }
  }, [transactionStatusError, checkingTransactionRef])

  console.log('🔍 Transaction Status:', transactionStatus)
  console.log('🔍 Transaction Status Loading:', isTransactionStatusLoading)
  console.log('🔍 Transaction Status Error:', transactionStatusError)

  // ** Debug: Log wallet and bank data
  React.useEffect(() => {
    if (walletDetails) {
      console.log('💰 Wallet Details:', walletDetails)
    }
    if (walletError) {
      console.error('❌ Wallet Error:', walletError)
    }
    if (bankAccounts) {
      console.log('🏦 Bank Accounts:', bankAccounts)
    }
    if (banksError) {
      console.error('❌ Banks Error:', banksError)
    }
  }, [walletDetails, walletError, bankAccounts, banksError])


  // ** Mock merchant data for transfer functionality (using dynamic bank details)
  const mockMerchant: MerchantDataType = {
    merchantId: merchant?.merchantId || '',
    email: merchant?.email || '',
    firstName: merchant?.firstName || '',
    lastName: merchant?.lastName || '',
    businessName: merchant?.businessName || '',
    businessAddress: merchant?.businessAddress || '',
    taxId: merchant?.taxId || '',
    phoneNumber: merchant?.phoneNumber || '',
    verificationStatus: merchant?.verificationStatus || 'pending',
    isActive: true,
    walletBalance: {
      availableBalance: walletDetails?.availableBalance || 0,
      pendingBalance: walletDetails?.pendingBalance || 0,
      totalEarnings: walletDetails?.totalEarnings || 0,
      lastUpdated: walletDetails?.lastUpdated || new Date().toISOString()
    },
    bankAccountDetails: {
      accountNumber: bankAccounts?.[0]?.accountNumber || '',
      accountTitle: bankAccounts?.[0]?.accountTitle || '',
      bankName: bankAccounts?.[0]?.bankName || '',
      branchCode: bankAccounts?.[0]?.branchCode || '',
      iban: bankAccounts?.[0]?.iban || ''
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





  const getStatusColor = (status: string) => {
    if (!status || status.trim() === '') {
      return 'default'
    }

    const normalizedStatus = status.toUpperCase().trim()

    switch (normalizedStatus) {
      case 'COMPLETED':
      case 'SUCCESS':
        return 'success'
      case 'PENDING':
      case 'PROCESSING':
        return 'warning'
      case 'FAILED':
        return 'error'
      case 'CANCELLED':
        return 'default'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    if (!status || status.trim() === '') {
      return 'Unknown'
    }

    return status
  }

  const handleCheckStatus = (transactionRef: string, provider: string) => {
    // Only update if it's a different transaction to trigger refetch
    if (checkingTransactionRef !== transactionRef || checkingProvider !== provider) {
      setCheckingTransactionRef(transactionRef)
      setCheckingProvider(provider)
    } else {
      // If same transaction, manually trigger refetch
      refetchTransactionStatus()
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Back Card */}
      <Box sx={{ mb: 4 }}>

      </Box>

      {/* Wallet Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' sx={{ mb: 1, fontWeight: 600 }}>
          My Wallet
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Manage your payments, transactions
        </Typography>
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
                  bankAccounts={bankAccounts}
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
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Typography variant='h6'>
                    Recent Transactions
                  </Typography>
                  <TextField
                    size='small'
                    select
                    label='Filter by status'
                    value={txStatus}
                    onChange={(e) => { setTxStatus(e.target.value); setTxPage(1) }}
                    sx={{ minWidth: 200 }}
                  >
                    <MenuItem value='all'>All</MenuItem>
                    <MenuItem value='PENDING'>Pending</MenuItem>
                    <MenuItem value='SUCCESS'>Success</MenuItem>
                    <MenuItem value='FAILED'>Failed</MenuItem>
                  </TextField>
                </Box>
                {isLoading ? (
                  <Typography>Loading transactions...</Typography>
                ) : error ? (
                  <Alert severity="error">Failed to load transactions. Please try again.</Alert>
                ) : payouts && payouts?.items && payouts.items.length > 0 ? (
                  <>
                    <TableContainer>
                      <Table size='small'>
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Transaction Ref</TableCell>
                            <TableCell>Provider</TableCell>
                            <TableCell align='right'>Amount (PKR)</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {payouts.items.map((transaction: any, index: number) => (
                            <TableRow key={index} hover>
                              <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
                              <TableCell>{transaction.transactionRef || transaction.id}</TableCell>
                              <TableCell>
                                <Stack direction='row' spacing={1} alignItems='center'>
                                  <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.light' }}>
                                    <Icon icon='mdi:bank' width={16} height={16} />
                                  </Avatar>
                                  <Typography variant='body2'>{transaction.provider || 'Payment'}</Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align='right'>
                                <Typography fontWeight={600}>RS: {Number(transaction?.amount || 0).toLocaleString()}</Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={getStatusLabel(transaction.status)}
                                  size='small'
                                  color={getStatusColor(transaction.status) as any}
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  disabled={isTransactionStatusLoading && checkingTransactionRef === transaction.transactionRef}
                                  variant='contained' color='primary' size='small' onClick={() => handleCheckStatus(transaction.transactionRef || transaction.id, transaction.provider || 'JAZZCASH')}>
                                  Check Status
                                  {isTransactionStatusLoading && checkingTransactionRef === transaction.transactionRef && (
                                    <CircularProgress size={20} sx={{ ml: 1 }} />
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <TablePagination
                      component='div'
                      count={payouts?.total || 0}
                      page={(payouts?.page ? payouts.page - 1 : txPage - 1)}
                      onPageChange={(e, newPage) => setTxPage(newPage + 1)}
                      rowsPerPage={txLimit}
                      onRowsPerPageChange={(e) => { setTxLimit(parseInt(e.target.value, 10)); setTxPage(1) }}
                      rowsPerPageOptions={[10, 25, 50, 100]}
                      showFirstButton
                      showLastButton
                    />
                  </>
                ) : (
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 8,
                    textAlign: 'center'
                  }}>
                    <Avatar sx={{
                      bgcolor: 'grey.100',
                      width: 80,
                      height: 80,
                      mb: 3,
                      '& .MuiSvgIcon-root': {
                        fontSize: '2rem',
                        color: 'grey.400'
                      }
                    }}>
                      <Icon icon='mdi:receipt-outline' />
                    </Avatar>
                    <Typography variant='h6' sx={{ mb: 1, color: 'text.secondary' }}>
                      No transactions yet
                    </Typography>
                    <Typography variant='body2' sx={{ color: 'text.secondary', mb: 3, maxWidth: 300 }}>
                      Your transaction history will appear here once you start receiving payments or making transfers.
                    </Typography>
                    <Button
                      variant='outlined'
                      startIcon={<Icon icon='mdi:bank-transfer' />}
                      onClick={() => setSelectedTab('transfer')}
                    >
                      Make a Transfer
                    </Button>
                  </Box>
                )}

                {/* Removed old pagination controls in favor of TablePagination */}
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
                        <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                          Send us an email for detailed assistance
                        </Typography>
                        <Typography variant='body2' sx={{ mb: 2, fontWeight: 600 }}>
                          hello@pincodepk.com
                        </Typography>
                        <Button
                          variant='outlined'
                          startIcon={<Icon icon='mdi:email-outline' />}
                          component='a'
                          href='https://mail.google.com/mail/?view=cm&fs=1&to=hello@pincodepk.com'
                          target='_blank'
                          rel='noopener noreferrer'
                        >
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
                {isBanksLoading ? (
                  <MenuItem disabled>
                    <Typography>Loading bank accounts...</Typography>
                  </MenuItem>
                ) : banksError ? (
                  <MenuItem disabled>
                    <Typography color="error">Failed to load bank accounts</Typography>
                  </MenuItem>
                ) : bankAccounts && bankAccounts.length > 0 ? (
                  bankAccounts.map((bank, index) => (
                    <MenuItem key={index} value={bank.id}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'success.main', width: 28, height: 28 }}>
                          <Icon icon='mdi:bank' fontSize={18} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {bank.bankName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {maskAccount(bank.accountNumber)} • {bank.accountTitle}
                          </Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    <Typography>No bank accounts found</Typography>
                  </MenuItem>
                )}
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
            Minimum withdrawal amount: RS: 100
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWithdraw(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (amount && selectedBank) {
                const selectedBankAccount = bankAccounts?.find(bank => bank.id === selectedBank)
                const bankName = selectedBankAccount?.bankName || 'your bank account'

                setSnackbar({
                  open: true,
                  message: `Withdrawal request of ${formatCurrency(parseInt(amount))} to ${bankName} submitted`,
                  severity: 'success'
                })
                setShowWithdraw(false)
                setAmount('')
                setSelectedBank('')
              }
            }}
            variant='contained'
            disabled={!selectedBank || !amount}
          >
            Withdraw
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
