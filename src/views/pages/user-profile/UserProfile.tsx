// ** React Imports
import { useState, useEffect, ReactElement, SyntheticEvent } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Components
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import { styled, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import CircularProgress from '@mui/material/CircularProgress'

// ** Type Import

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Components
import BankDetails from '@/views/pages/user-profile/banks'
import Profile from 'src/views/pages/user-profile/profile'
import Transactions from '@/views/pages/user-profile/transactions'
import Requests from '@/views/pages/user-profile/requests'
import UserProfileHeader from 'src/views/pages/user-profile/UserProfileHeader'

// ** Types
import { MerchantProfile } from '@/store/api/v1/types'
import { buildUserProfileTabs } from '@/utils/profileMapper'

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'block',
    height: 3,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.main
  },
  '& .Mui-selected': {
    color: `${theme.palette.primary.main} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 38,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderRadius: 0,
    [theme.breakpoints.up('sm')]: {
      minWidth: 130
    }
  }
}))

const UserProfile = ({ tab, data }: { tab: string; data: MerchantProfile }) => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // ** Hooks
  const router = useRouter()
  const hideText = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/pages/user-profile/${value.toLowerCase()}`
      })
      .then(() => setIsLoading(false))
  }

  useEffect(() => {
    if (data) {
      setIsLoading(false)
    }
  }, [data])

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const mapped = buildUserProfileTabs(data)
  const tabContentList: { [key: string]: ReactElement } = {
    profile: <Profile data={mapped.profile} />,
    'bank-details': <BankDetails data={mapped.bankDetails} />,
    transactions: <Transactions data={mapped.transactions} />,
    requests: <Requests />
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {data ? <UserProfileHeader data={data} /> : null}
      </Grid>
      {activeTab === undefined ? null : (
        <Grid item xs={12}>
          <TabContext value={activeTab}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <TabList
                  variant='scrollable'
                  scrollButtons='auto'
                  onChange={handleChange}
                  aria-label='customized tabs example'
                >
                  <Tab
                    value='profile'
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                        <Icon fontSize={20} icon='mdi:account-outline' />
                        {!hideText && 'Profile'}
                      </Box>
                    }
                  />
                  <Tab
                    value='bank-details'
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                        <Icon fontSize={20} icon='mdi:bank' />
                        {!hideText && 'Bank Details'}
                      </Box>
                    }
                  />
                  <Tab
                    value='transactions'
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                        <Icon fontSize={20} icon='mdi:bank-transfer' />
                        {!hideText && 'Transactions'}
                      </Box>
                    }
                  />
                  <Tab
                    value='requests'
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                        <Icon fontSize={20} icon='mdi:clipboard-text-clock-outline' />
                        {!hideText && 'Requests'}
                      </Box>
                    }
                  />
                  {/* <Tab
                    value='connections'
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                        <Icon fontSize={20} icon='mdi:shuffle-variant' />
                        {!hideText && 'randomw'}
                      </Box>
                    }
                  /> */}
                </TabList>
              </Grid>
              <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(4)} !important` }}>
                {isLoading ? (
                  <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <CircularProgress sx={{ mb: 4 }} />
                    <Typography>Loading...</Typography>
                  </Box>
                ) : (
                  <TabPanel sx={{ p: 0 }} value={activeTab}>
                    {tabContentList[activeTab]}
                  </TabPanel>
                )}
              </Grid>
            </Grid>
          </TabContext>
        </Grid>
      )}
    </Grid>
  )
}

export default UserProfile
