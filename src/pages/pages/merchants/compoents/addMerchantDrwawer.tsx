// ** React Imports
import React from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** RegisterForm Import
import RegisterForm from 'src/views/pages/register/RegisterForm'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const SidebarAddUser = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle } = props

  const handleClose = () => {
    toggle()
  }

  const handleSuccess = () => {
    // Handle successful registration
    toggle()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 600 } } }}
    >
      <Header>
        <Typography variant='h6'>Add Merchant</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <RegisterForm
        onSuccess={handleSuccess}
        onCancel={handleClose}
        submitLabel="Add Merchant"
        fullHeight={true}
      />
    </Drawer>
  )
}

export default SidebarAddUser
