// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'

interface DataType {
  icon: string
  stats: string
  title: string
  color: ThemeColor
}

interface CrmTransactionsProps {
  loading?: boolean
}

const bankingData: DataType[] = [
  {
    stats: 'Rs: ....',
    title: 'Today\'s Transactions',
    color: 'primary',
    icon: 'mdi:bank-transfer'
  },
  {
    stats: 'Rs: ....',
    color: 'success',
    title: 'Total Deposits',
    icon: 'mdi:arrow-down-bold'
  },
  {
    stats: 'Rs: ....',
    color: 'warning',
    title: 'Total Withdrawals',
    icon: 'mdi:arrow-up-bold'
  },
  {
    stats: 'Rs: ....',
    color: 'info',
    title: 'Net Balance',
    icon: 'mdi:account-balance'
  },

  // {
  //   stats: 'Rs: ....',
  //   color: 'secondary',
  //   title: 'Active Accounts',
  //   icon: 'mdi:account-group'
  // },
  // {
  //   stats: 'Rs: ....',
  //   color: 'error',
  //   title: 'Pending Loans',
  //   icon: 'mdi:hand-coin'
  // }
]

const renderStats = () => {
  return bankingData.map((item: DataType, index: number) => (
    <Grid item xs={12} sm={6} md={3} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar variant='rounded' color={item.color} sx={{ mr: 3, boxShadow: 3, width: 44, height: 44 }}>
          <Icon icon={item.icon} fontSize='1.75rem' />
        </CustomAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>{item.title}</Typography>
          <Typography variant='h6'>{item.stats}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const renderSkeletonStats = () => {
  return Array.from({ length: 4 }).map((_, index) => (
    <Grid item xs={12} sm={6} md={3} key={index}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Skeleton variant='rounded' width={44} height={44} sx={{ mr: 3 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Skeleton variant='text' width={120} height={20} sx={{ mb: 1 }} />
          <Skeleton variant='text' width={80} height={24} />
        </Box>
      </Box>
    </Grid>
  ))
}

const CrmTransactions = ({ loading = false }: CrmTransactionsProps) => {
  return (
    <Card>
      <CardHeader
        title='Banking Overview'
        action={
          <OptionsMenu
            options={['Refresh']}
            iconButtonProps={{ size: 'small', className: 'card-more-options', sx: { color: 'text.secondary' } }}
          />
        }
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              Banking Performance
            </Box>{' '}
            📊 this month
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.25,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(0.75)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {loading ? renderSkeletonStats() : renderStats()}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CrmTransactions
