// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import { styled } from '@mui/material/styles'


// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types'



interface Props {
  collapsedNavWidth: number
  hidden: LayoutProps['hidden']
  navigationBorderWidth: number
  toggleNavVisibility: () => void
  settings: LayoutProps['settings']
  saveSettings: LayoutProps['saveSettings']
  navMenuBranding?: LayoutProps['verticalLayoutProps']['navMenu']['branding']
  menuLockedIcon?: LayoutProps['verticalLayoutProps']['navMenu']['lockedIcon']
  menuUnlockedIcon?: LayoutProps['verticalLayoutProps']['navMenu']['unlockedIcon']
}

// ** Styled Components
const MenuHeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: theme.spacing(4.5),
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight,
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper
}))



const LinkStyled = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const VerticalNavHeader = (props: Props) => {
  // ** Props
  const {
    settings,
    collapsedNavWidth,
    navigationBorderWidth,
    navMenuBranding: userNavMenuBranding,
  } = props

  // ** Hooks & Vars
  const { navCollapsed } = settings



  const menuHeaderPaddingLeft = () => {
    if (navCollapsed) {
      if (userNavMenuBranding) {
        return 0
      } else {
        return (collapsedNavWidth - navigationBorderWidth - 30) / 8
      }
    } else {
      return 6
    }
  }

  return (
    <MenuHeaderWrapper className='nav-header' sx={{ pl: menuHeaderPaddingLeft() }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        {userNavMenuBranding ? (
          userNavMenuBranding(props)
        ) : (
          <LinkStyled href='/'>
            <Box
              component="img"
              src="/Pincode-logo.svg"
              alt="Pincode Logo"
              sx={{
                height: 40,
                width: 'auto',
                maxWidth: 200
              }}
            />
          </LinkStyled>
        )}
      </Box>
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
