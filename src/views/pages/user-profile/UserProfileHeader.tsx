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

const HeaderCover = styled(Box)(({ theme }) => ({
  width: '100%',
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  height: 250,
  [theme.breakpoints.down('md')]: { height: 150 }
}))

const UserProfileHeader = ({ data }: { data: MerchantProfile }) => {
  const fullName = `${data.firstName} ${data.lastName}`.trim()

  return (
    <Card>
      <HeaderCover />
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
