// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types'

// ** Components
import AppBar from './components/vertical/appBar'
import Customizer from 'src/@core/components/customizer'
import Navigation from './components/vertical/navigation'
import ScrollToTop from 'src/@core/components/scroll-to-top'
import Fab from '@mui/material/Fab'
import Fade from '@mui/material/Fade'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'


const VerticalLayoutWrapper = styled('div')({
  height: '100%',
  display: 'flex'
})

const MainContentWrapper = styled(Box)<BoxProps>({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
})

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const VerticalLayout = (props: LayoutProps) => {
  // ** Props
  const { hidden, settings, saveSettings, children, scrollToTop, contentHeightFixed, verticalLayoutProps } = props

  // ** Hooks
  const { user } = useAuth()

  // ** Vars
  const { skin, contentWidth, navCollapsed } = settings
  const { navigationSize, disableCustomizer, collapsedNavigationSize } = themeConfig
  const navWidth = navigationSize
  const navigationBorderWidth = skin === 'bordered' ? 1 : 0
  const collapsedNavWidth = collapsedNavigationSize

  // ** States
  const [navVisible, setNavVisible] = useState<boolean>(false)

  // Check if merchant is verified - hide all UI for unverified merchants
  const isMerchantVerified = user && (user as any).merchantId
    ? (user as any).verificationStatus === 'verified'
    : true // Admin users are always considered "verified"

  // Hide all UI elements for unverified merchants
  const shouldHideAllUI = user && (user as any).merchantId && !isMerchantVerified

  // ** Toggle Functions
  const toggleNavVisibility = () => setNavVisible(!navVisible)

  // If merchant is not verified, show only content without any UI elements
  if (shouldHideAllUI) {
    return (
      <Box position={'relative'}>
        <ContentWrapper
          className='layout-page-content'
          sx={{
            ...(contentHeightFixed && {
              overflow: 'hidden',
              '& > :first-of-type': { height: '100%' }
            }),
            ...(contentWidth === 'boxed' && {
              mx: 'auto',
              '@media (min-width:1440px)': { maxWidth: 1440 },
              '@media (min-width:1200px)': { maxWidth: '100%' }
            })
          }}
        >
          {children}
        </ContentWrapper>
      </Box>
    )
  }

  return (
    <Box position={'relative'}>
      {/* Vertical Layout Wrapper */}
      <VerticalLayoutWrapper className='layout-wrapper'>
        {/* Navigation Menu */}
        <Navigation
          navWidth={navWidth}
          navVisible={navVisible}
          setNavVisible={setNavVisible}
          collapsedNavWidth={collapsedNavWidth}
          toggleNavVisibility={toggleNavVisibility}
          navigationBorderWidth={navigationBorderWidth}
          navMenuContent={verticalLayoutProps.navMenu.content}
          navMenuBranding={verticalLayoutProps.navMenu.branding}
          menuLockedIcon={verticalLayoutProps.navMenu.lockedIcon}
          verticalNavItems={verticalLayoutProps.navMenu.navItems}
          navMenuProps={verticalLayoutProps.navMenu.componentProps}
          menuUnlockedIcon={verticalLayoutProps.navMenu.unlockedIcon}
          afterNavMenuContent={verticalLayoutProps.navMenu.afterContent}
          beforeNavMenuContent={verticalLayoutProps.navMenu.beforeContent}
          {...props}
        />
        <Fade timeout={500} in={navCollapsed}>
          <Fab aria-label='edit' disableRipple disableFocusRipple
            onClick={() => saveSettings({ ...settings, navCollapsed: !navCollapsed })}
            sx={{
              position: 'absolute',
              width: '35px',
              height: '10px',
              left: 50,
              top: 50,
              zIndex: 9999,
              display: { xs: 'none', lg: 'flex' }
            }}>
            <Icon icon='mdi:menu-close' fontSize='1.2rem' />
          </Fab>
        </Fade>

        <Fade timeout={500} in={!navCollapsed}>
          <Fab aria-label='edit' disableRipple disableFocusRipple
            onClick={() => saveSettings({ ...settings, navCollapsed: !navCollapsed })}
            sx={{
              position: 'absolute',
              width: '35px',
              height: '10px',
              left: 283,
              top: 50,
              zIndex: 9999,
              display: { xs: 'none', lg: 'flex' }
            }}>
            <Icon icon='mdi:menu-open' fontSize='1.2rem' />
          </Fab>
        </Fade>


        <MainContentWrapper
          className='layout-content-wrapper'
          sx={{ ...(contentHeightFixed && { maxHeight: '100vh' }) }}
        >
          {/* AppBar Component */}
          <AppBar
            toggleNavVisibility={toggleNavVisibility}
            appBarContent={verticalLayoutProps.appBar?.content}
            appBarProps={verticalLayoutProps.appBar?.componentProps}
            {...props}
          />

          {/* Content */}
          <ContentWrapper
            className='layout-page-content'
            sx={{
              ...(contentHeightFixed && {
                overflow: 'hidden',
                '& > :first-of-type': { height: '100%' }
              }),
              ...(contentWidth === 'boxed' && {
                mx: 'auto',
                '@media (min-width:1440px)': { maxWidth: 1440 },
                '@media (min-width:1200px)': { maxWidth: '100%' }
              })
            }}
          >
            {children}
          </ContentWrapper>

          {/* Footer Component */}
        </MainContentWrapper>
      </VerticalLayoutWrapper >

      {/* Customizer */}
      {disableCustomizer || hidden ? null : <Customizer />}

      {/* Scroll to top button */}
      {
        scrollToTop ? (
          scrollToTop(props)
        ) : (
          <ScrollToTop className='mui-fixed'>
            <Fab color='primary' size='small' aria-label='scroll back to top'>
              <Icon icon='mdi:arrow-up' />
            </Fab>
          </ScrollToTop>
        )
      }
    </Box >
  )
}

export default VerticalLayout
