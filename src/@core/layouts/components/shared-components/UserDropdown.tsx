// ** React Imports
import { useState, SyntheticEvent, Fragment } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'
import { MerchantDataType, UserDataType } from 'src/context/types'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'

interface Props {
  settings: Settings
}

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = (props: Props) => {
  // ** Props
  const { settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  // ** Hooks
  const router = useRouter()
  const { user, logout } = useAuth()

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2,
      fontSize: '1.375rem',
      color: 'text.primary'
    }
  }

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  // ** Helper functions to get user info
  const getUserDisplayName = () => {
    if (!user) return 'Guest'

    if ((user as MerchantDataType).merchantId) {
      const merchant = user as MerchantDataType

      return merchant.businessName || `${merchant.firstName || ''} ${merchant.lastName || ''}`.trim() || 'Merchant'
    } else {
      const adminUser = user as UserDataType

      return adminUser.fullName || adminUser.username || 'Admin'
    }
  }

  const getUserRole = () => {
    if (!user) return 'Guest'

    if ((user as MerchantDataType).merchantId) {
      const merchant = user as MerchantDataType

      return merchant.verificationStatus === 'verified' ? 'Verified Merchant' : 'Merchant'
    } else {
      return 'Admin'
    }
  }

  const getUserAvatar = () => {
    if (!user) return '/images/avatars/1.png'

    if ((user as MerchantDataType).merchantId) {
      return '/images/avatars/2.png' // Merchant avatar
    } else {
      return (user as UserDataType).avatar || '/images/avatars/1.png'
    }
  }

  const isMerchant = user && (user as MerchantDataType).merchantId

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Avatar
          alt={getUserDisplayName()}
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src={getUserAvatar()}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Avatar alt={getUserDisplayName()} src={getUserAvatar()} sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
            <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{getUserDisplayName()}</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {getUserRole()}
              </Typography>
            </Box>
          </Box>
        </Box>

        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/account-settings/account')}>
          <Box sx={styles}>
            <Icon icon='mdi:cog-outline' />
            Settings
          </Box>
        </MenuItem>
        <Divider />

        {!isMerchant && (
          <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/pricing')}>
            <Box sx={styles}>
              <Icon icon='mdi:currency-usd' />
              Pricing
            </Box>
          </MenuItem>
        )}
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}
        >
          <Icon icon='mdi:logout-variant' />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
