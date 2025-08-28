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
import IconButton from '@mui/material/IconButton'
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
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { styled, useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Styled Components
const WalletCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("/images/cards/credit-card.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.1,
    zIndex: 0
  }
}))

const TransactionItem = styled(ListItem)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}))

const BalanceAmount = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem'
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

const mockWalletHistory = [
  { month: 'January 2024', total: 45000, transactions: 45 },
  { month: 'December 2023', total: 38000, transactions: 38 },
  { month: 'November 2023', total: 42000, transactions: 42 },
  { month: 'October 2023', total: 35000, transactions: 35 }
]

const Wallet = () => {
  // ** States
  const [selectedTab, setSelectedTab] = useState('transactions')
  const [showAddMoney, setShowAddMoney] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  // ** Hooks
  const theme = useTheme()
  const router = useRouter()
  const auth = useAuth()

  // ** Mock Data
  const walletBalance = 28450
  const totalEarnings = 125000
  const pendingAmount = 3500

  const handleLogout = () => {
    auth.logout()
    router.push('/login')
  }

  const handleAddMoney = () => {
    if (amount && paymentMethod) {
      setSnackbar({
        open: true,
        message: `Successfully added Rs: ${amount} to wallet`,
        severity: 'success'
      })
      setShowAddMoney(false)
      setAmount('')
      setPaymentMethod('')
    }
  }

  const handleWithdraw = () => {
    if (amount) {
      setSnackbar({
        open: true,
        message: `Withdrawal request of Rs: ${amount} submitted`,
        severity: 'success'
      })
      setShowWithdraw(false)
      setAmount('')
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
      {/* Wallet Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' sx={{ mb: 1, fontWeight: 600 }}>
          My Wallet
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Manage your payments, transactions, and wallet settings
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Wallet Balance Card */}
        <Grid item xs={12} md={8}>
          <WalletCard>
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Typography variant='body2' sx={{ opacity: 0.8 }}>
                    Available Balance
                  </Typography>
                  <BalanceAmount>
                    Rs: {walletBalance.toLocaleString()}
                  </BalanceAmount>
                </Box>
                <IconButton sx={{ color: 'white' }}>
                  <Icon icon='mdi:dots-vertical' />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant='contained'
                  startIcon={<Icon icon='mdi:plus' />}
                  onClick={() => setShowAddMoney(true)}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  Add Money
                </Button>
                <Button
                  variant='outlined'
                  startIcon={<Icon icon='mdi:arrow-up' />}
                  onClick={() => setShowWithdraw(true)}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    '&:hover': { borderColor: 'white' }
                  }}
                >
                  Withdraw
                </Button>
              </Box>
            </CardContent>
          </WalletCard>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Icon icon='mdi:trending-up' color={theme.palette.success.main} />
                    <Typography variant='body2' color='text.secondary' sx={{ ml: 1 }}>
                      Total Earnings
                    </Typography>
                  </Box>
                  <Typography variant='h6' fontWeight={600}>
                    Rs: {totalEarnings.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Icon icon='mdi:clock-outline' color={theme.palette.warning.main} />
                    <Typography variant='body2' color='text.secondary' sx={{ ml: 1 }}>
                      Pending
                    </Typography>
                  </Box>
                  <Typography variant='h6' fontWeight={600}>
                    Rs: {pendingAmount.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Navigation Tabs */}
        <Grid item xs={12}>
          <Paper sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider' }}>
              {[
                { key: 'transactions', label: 'Recent Transactions', icon: 'mdi:swap-horizontal' },
                { key: 'history', label: 'Transaction History', icon: 'mdi:history' },
                { key: 'settings', label: 'Wallet Settings', icon: 'mdi:cog' },
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
                        {transaction.type === 'credit' ? '+' : '-'}Rs: {transaction.amount.toLocaleString()}
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

          {selectedTab === 'history' && (
            <Card>
              <CardContent>
                <Typography variant='h6' sx={{ mb: 3 }}>
                  Transaction History
                </Typography>
                <Grid container spacing={2}>
                  {mockWalletHistory.map((month, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card variant='outlined'>
                        <CardContent>
                          <Typography variant='body2' color='text.secondary'>
                            {month.month}
                          </Typography>
                          <Typography variant='h6' fontWeight={600}>
                            Rs: {month.total.toLocaleString()}
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            {month.transactions} transactions
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}

          {selectedTab === 'settings' && (
            <Card>
              <CardContent>
                <Typography variant='h6' sx={{ mb: 3 }}>
                  Wallet Settings
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Default Payment Method</InputLabel>
                      <Select
                        value={paymentMethod}
                        label='Default Payment Method'
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <MenuItem value='upi'>UPI</MenuItem>
                        <MenuItem value='card'>Credit/Debit Card</MenuItem>
                        <MenuItem value='netbanking'>Net Banking</MenuItem>
                        <MenuItem value='wallet'>Digital Wallet</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Transaction Limit</InputLabel>
                      <Select
                        value='50000'
                        label='Transaction Limit'
                      >
                        <MenuItem value='10000'>Rs: 10,000</MenuItem>
                        <MenuItem value='25000'>Rs: 25,000</MenuItem>
                        <MenuItem value='50000'>Rs: 50,000</MenuItem>
                        <MenuItem value='100000'>Rs: 1,00,000</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant='contained' startIcon={<Icon icon='mdi:content-save' />}>
                      Save Settings
                    </Button>
                  </Grid>
                </Grid>
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
                          <Icon icon='mdi:chat' color={theme.palette.primary.main} />
                          <Typography variant='h6' sx={{ ml: 1 }}>
                            Live Chat
                          </Typography>
                        </Box>
                        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                          Get instant help from our support team
                        </Typography>
                        <Button variant='contained' startIcon={<Icon icon='mdi:message' />}>
                          Start Chat
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
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
              startAdornment: <Typography sx={{ mr: 1 }}>Rs: </Typography>
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              label='Payment Method'
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <MenuItem value='upi'>UPI</MenuItem>
              <MenuItem value='card'>Credit/Debit Card</MenuItem>
              <MenuItem value='netbanking'>Net Banking</MenuItem>
              <MenuItem value='wallet'>Digital Wallet</MenuItem>
            </Select>
          </FormControl>
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
          <TextField
            fullWidth
            label='Amount'
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>Rs: </Typography>
            }}
          />
          <Alert severity='info' sx={{ mb: 2 }}>
            Minimum withdrawal amount: Rs: 100
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWithdraw(false)}>Cancel</Button>
          <Button onClick={handleWithdraw} variant='contained'>Withdraw</Button>
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

export default Wallet
