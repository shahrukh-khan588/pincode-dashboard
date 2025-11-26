// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid, { GridProps } from '@mui/material/Grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import type { MerchantDataType } from 'src/context/types'

// Styled Grid component
const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    justifyContent: 'center'
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 13,
  bottom: 0,
  height: 200,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    height: 165,
    position: 'static'
  }
}))

interface CardWelcomeBackProps {
  merchant?: MerchantDataType
  walletBalance?: number
  totalEarnings?: number
  pendingAmount?: number
  isWalletEnabled?: boolean
}

const CardWelcomeBack = ({
  merchant,
  walletBalance = 28450,
  totalEarnings = 125000,
  pendingAmount = 3500,
}: CardWelcomeBackProps) => {


  const firstName = merchant?.firstName || 'User Name'

  return (
    <Card sx={{
      position: 'relative',
      overflow: 'visible',
      mt: { xs: 0, sm: 14.4, md: 0 },
      opacity: 1,
      transition: 'opacity 0.3s ease'
    }}>
      <CardContent sx={{ p: theme => theme.spacing(7.25, 7.5, 7.75, 7.5) }}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant='h5' sx={{ mb: 6.5 }}>
                Wallet Overview{' '}
                <Box component='span' sx={{ fontWeight: 'bold' }}>
                  {firstName}
                </Box>
                ! 📊
              </Typography>

            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ mr: 1, color: 'success.main' }}>
                <Icon icon='mdi:wallet' />
              </Box>
              <Typography variant='body2'>
                Available Balance: <strong>RS: {walletBalance.toLocaleString()}</strong>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ mr: 1, color: 'primary.main' }}>
                <Icon icon='mdi:chart-line' />
              </Box>
              <Typography variant='body2'>
                Total Revenue: <strong>RS: {totalEarnings.toLocaleString()}</strong>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ mr: 1, color: 'warning.main' }}>
                <Icon icon='mdi:clock-time-four' />
              </Box>
              <Typography variant='body2'>
                Processing: <strong>RS: {pendingAmount.toLocaleString()}</strong>
              </Typography>
            </Box>

            <Typography variant='body2' sx={{ mb: 3 }}>
              Your business is performing great! 💼 Ready to manage your finances?
            </Typography>

          </Grid>
          <StyledGrid item xs={12} sm={6}>
            <Img alt={`Welcome back ${firstName}`} src='/images/cards/illustration-john.png' />
          </StyledGrid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CardWelcomeBack
