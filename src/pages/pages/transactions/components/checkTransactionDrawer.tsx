// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** API Imports
import { useCheckPaymentStatusQuery } from 'src/store/api/v1/endpoints/payout'

interface CheckTransactionDrawerProps {
  open: boolean
  toggle: () => void
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  flexShrink: 0,
  borderBottom: `1px solid ${theme.palette.divider}`
}))

const CheckTransactionDrawer = (props: CheckTransactionDrawerProps) => {
  const { open, toggle } = props

  const [referenceId, setReferenceId] = useState('')
  const [shouldFetch, setShouldFetch] = useState(false)

  // Use the API hook with skip to control when to fetch
  const {
    data: transactionResult,
    isLoading,
    error,
    refetch
  } = useCheckPaymentStatusQuery(
    { transactionRef: referenceId },
    { skip: !shouldFetch || !referenceId.trim() }
  )


  const handleSubmit = () => {
    if (referenceId.trim()) {
      setShouldFetch(true)
      refetch()
    }
  }

  const handleClose = () => {
    setReferenceId('')
    setShouldFetch(false)
    toggle()
  }

  const handleCheckAnother = () => {
    setReferenceId('')
    setShouldFetch(false)
  }

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'success'
      case 'FAILED':
        return 'error'
      case 'PENDING':
        return 'warning'
      case 'PROCESSING':
        return 'info'
      case 'CANCELLED':
        return 'default'
      default:
        return 'default'
    }
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{
        keepMounted: true // Better open performance on mobile.
      }}
      sx={{
        zIndex: 9999999,
        '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } }
      }}
    >
      <Header>
        <Typography variant='h6'>Check Transaction Status</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{
            color: 'text.primary',
            ml: 'auto'
          }}
        >
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            Enter the transaction reference ID to check its current status
          </Typography>

          <TextField
            fullWidth
            label='Transaction Reference ID'
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
            placeholder='e.g., TXN-2024-001'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Icon icon='mdi:identifier' />
                </InputAdornment>
              )
            }}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              fullWidth
              variant='outlined'
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant='contained'
              onClick={handleSubmit}
              disabled={!referenceId.trim() || isLoading}
            >
              {isLoading ? 'Checking...' : 'Check Status'}
            </Button>
          </Box>

          {isLoading && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Checking transaction status...
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {String((error as any).message)}
            </Alert>
          )}

          {transactionResult && (
            <Box sx={{ mt: 4, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant='h6' sx={{ mb: 2 }}>Transaction Result</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant='body2'><strong>Status:</strong></Typography>
                  <Chip
                    label={transactionResult.status}
                    color={getStatusColor(transactionResult.status) as any}
                    size="small"
                  />
                </Box>
                <Typography variant='body2'><strong>Amount:</strong> {transactionResult.currency} {transactionResult.amount}</Typography>
                <Typography variant='body2'><strong>Merchant ID:</strong> {transactionResult.merchantId}</Typography>
                <Typography variant='body2'><strong>Provider:</strong> {transactionResult.provider || 'N/A'}</Typography>
                <Typography variant='body2'><strong>Created:</strong> {formatDate(transactionResult.createdAt)}</Typography>
                {transactionResult.description && (
                  <Typography variant='body2'><strong>Description:</strong> {transactionResult.description}</Typography>
                )}
                {transactionResult.fees && (
                  <Typography variant='body2'><strong>Fees:</strong> {transactionResult.currency} {transactionResult.fees}</Typography>
                )}
                {transactionResult.failureReason && (
                  <Typography variant='body2'><strong>Failure Reason:</strong> {transactionResult.failureReason}</Typography>
                )}
              </Box>
              <Button
                fullWidth
                variant='outlined'
                onClick={handleCheckAnother}
                sx={{ mt: 2 }}
              >
                Check Another Transaction
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Drawer>
  )
}

export default CheckTransactionDrawer
