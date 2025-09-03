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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

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
  const [isLoading, setIsLoading] = useState(false)
  const [transactionResult, setTransactionResult] = useState<any>(null)
  const [showResult, setShowResult] = useState(false)

  const handleSubmit = () => {
    setIsLoading(true)

    // Simulate API call - replace with actual API call
    setTimeout(() => {
      // Mock transaction result - replace with actual API response
      const mockResult = {
        referenceId: referenceId,
        status: 'success',
        amount: 1500.00,
        currency: 'Rs',
        requestedFrom: 'John Doe',
        isCompany: false,
        timestamp: '2024-01-15T10:30:00Z',
        description: 'Payment for services',
        transactionType: 'Credit',
        fees: 25.00
      }

      setTransactionResult(mockResult)
      setShowResult(true)
      setIsLoading(false)
    }, 1500)
  }

  const handleClose = () => {
    setReferenceId('')
    setTransactionResult(null)
    setShowResult(false)
    toggle()
  }

  const handleCheckAnother = () => {
    setReferenceId('')
    setTransactionResult(null)
    setShowResult(false)
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

          {showResult && transactionResult && (
            <Box sx={{ mt: 4, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant='h6' sx={{ mb: 2 }}>Transaction Result</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant='body2'><strong>Status:</strong> {transactionResult.status}</Typography>
                <Typography variant='body2'><strong>Amount:</strong> {transactionResult.currency} {transactionResult.amount}</Typography>
                <Typography variant='body2'><strong>From:</strong> {transactionResult.requestedFrom}</Typography>
                <Typography variant='body2'><strong>Type:</strong> {transactionResult.transactionType}</Typography>
                <Typography variant='body2'><strong>Fees:</strong> {transactionResult.currency} {transactionResult.fees}</Typography>
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
