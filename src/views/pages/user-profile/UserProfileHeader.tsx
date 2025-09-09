// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { MerchantProfile } from '@/store/api/v1/types'

import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts'


const HeaderCover = styled(Box)(({ theme }) => ({
  width: '100%',
  opacity: 0.9,
  background: 'linear-gradient(135deg, rgba(5, 62, 248, 0.6) 0%, rgba(145, 85, 253, 0.05) 100%)',
  height: 'auto',
  [theme.breakpoints.down('md')]: { height: 150 }
}))

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const UserProfileHeader = ({ data }: { data: MerchantProfile }) => {
  const fullName = `${data.firstName} ${data.lastName}`.trim()

  const balanceSeries = monthLabels.map((m, idx) => ({ month: m, balance: 50 + idx * 5 + (idx % 3) * 7 }))

  const BalanceAreaChart = () => (
    <Box sx={{ width: '100%', height: 260, textAlign: 'center' }}>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart data={balanceSeries} margin={{ left: -20, right: 10 }}>
          <defs>
            <linearGradient id='balanceGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#00D4AA' stopOpacity={0.8} />
              <stop offset='50%' stopColor='#00D4AA' stopOpacity={0.4} />
              <stop offset='95%' stopColor='#00D4AA' stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='rgba(0, 0, 0, 0.1)' />
          <XAxis dataKey='month' axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
          <RechartsTooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area type='monotone' dataKey='balance' stroke='#00D4AA' fill='url(#balanceGradient)' strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  )


  return (
    <Card>
      <HeaderCover >
        <CardContent>
          <BalanceAreaChart />
        </CardContent>
      </HeaderCover>
      <CardContent
        sx={{
          pt: 0,
          mt: -8,
          display: 'flex',
          alignItems: 'flex-end',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}
      >
        <Avatar sx={{ width: 120, height: 120, border: theme => `5px solid ${theme.palette.common.white}` }}>
          {data.firstName?.[0]}
          {data.lastName?.[0]}
        </Avatar>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            ml: { xs: 0, md: 6 },
            alignItems: 'flex-end',
            flexWrap: ['wrap', 'nowrap'],
            justifyContent: ['center', 'space-between']
          }}
        >
          <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
            <Typography variant='h5' sx={{ mb: 2 }}>
              {fullName || data.businessName}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: ['center', 'flex-start'] }}>
              <Box sx={{ mr: 5, display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}>
                <Icon icon='mdi:store-outline' />
                <Typography sx={{ ml: 1, color: 'text.secondary', fontWeight: 600 }}>{data.businessName}</Typography>
              </Box>
              <Box sx={{ mr: 5, display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}>
                <Icon icon='mdi:email-outline' />
                <Typography sx={{ ml: 1, color: 'text.secondary', fontWeight: 600 }}>{data.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}>
                <Icon icon='mdi:phone-outline' />
                <Typography sx={{ ml: 1, color: 'text.secondary', fontWeight: 600 }}>{data.phoneNumber}</Typography>
              </Box>
            </Box>
          </Box>
          <Button variant='contained' startIcon={<Icon icon='mdi:shield-check-outline' fontSize={20} />}>
            {data.verificationStatus === 'verified' ? 'Verified' : data.verificationStatus === 'pending' ? 'Pending' : 'Rejected'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default UserProfileHeader
