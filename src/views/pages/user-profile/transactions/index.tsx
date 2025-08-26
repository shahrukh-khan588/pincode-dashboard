// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import AvatarGroup from '@mui/material/AvatarGroup'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ProjectsTabType } from 'src/@fake-db/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(value)

const mockPayouts: Array<{ id: string; date: string; amount: number; status: 'paid' | 'pending' | 'failed'; reference: string; type?: 'credit' | 'debit' }> = [
  { id: 'P001', date: '2025-08-16', amount: 12500, status: 'paid', reference: 'Sale POS #221', type: 'credit' },
  { id: 'P002', date: '2025-08-13', amount: -4200, status: 'paid', reference: 'Refund TRX-8L1A71', type: 'debit' },
  { id: 'P003', date: '2025-08-10', amount: 23100, status: 'pending', reference: 'Payout to Bank', type: 'debit' },
  { id: 'P004', date: '2025-08-07', amount: 9900, status: 'failed', reference: 'Wallet Top-up', type: 'credit' },
  { id: 'P005', date: '2025-08-05', amount: 15600, status: 'paid', reference: 'Online Order #5541', type: 'credit' },
  { id: 'P006', date: '2025-08-03', amount: -3600, status: 'paid', reference: 'Chargeback #9912', type: 'debit' },
  { id: 'P007', date: '2025-08-01', amount: 8200, status: 'paid', reference: 'Shop Sale #991', type: 'credit' }
]

const transactionColumns: GridColDef[] = [
  { field: 'date', headerName: 'Date', flex: 0.8, valueGetter: params => new Date(params.value as string).toLocaleDateString() },
  { field: 'reference', headerName: 'Description', flex: 1.4 },
  {
    field: 'amount',
    headerName: 'Amount',
    flex: 0.8,
    align: 'right',
    headerAlign: 'right',
    renderCell: params => {
      const v = params.value as number

      return <Typography sx={{ color: v >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>{formatCurrency(Math.abs(v))}</Typography>
    }
  },
  { field: 'status', headerName: 'Status', flex: 0.6 },
  { field: 'type', headerName: 'Type', flex: 0.6 }
]

const ProjectAvatar = ({ project }: { project: ProjectsTabType }) => {
  const { title, avatar, avatarColor = 'primary' } = project

  if (avatar.length) {
    return <CustomAvatar src={avatar} sx={{ width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar skin='light' color={avatarColor} sx={{ width: 38, height: 38 }}>
        {getInitials(title)}
      </CustomAvatar>
    )
  }
}

const Projects = ({ data }: { data: ProjectsTabType[] }) => {
  return (
    <Grid container spacing={6}>
      {/* All Transactions moved from Profile tab */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='All Transactions' titleTypographyProps={{ variant: 'h6', fontSize: '1.1rem' }} />
          <Divider />
          <CardContent>
            <div style={{ width: '100%' }}>
              <DataGrid
                autoHeight
                rows={mockPayouts.map((t, idx) => ({ id: idx + 1, date: t.date, reference: t.reference, amount: t.amount, status: t.status, type: t.type }))}
                columns={transactionColumns}
                rowsPerPageOptions={[5, 10]}
                pageSize={5}
              />
            </div>
          </CardContent>
        </Card>
      </Grid>
      {data &&
        Array.isArray(data) &&
        data.map((item, index) => {
          return (
            <Grid key={index} item xs={12} md={6} lg={4}>
              <Card>
                <CardHeader
                  avatar={<ProjectAvatar project={item} />}
                  sx={{
                    pb: 4,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    '& .MuiCardHeader-avatar': { mr: 3 }
                  }}
                  subheader={
                    <Typography sx={{ color: 'text.secondary' }}>
                      <Box component='span' sx={{ fontWeight: 600 }}>
                        Client:
                      </Box>{' '}
                      {item.client}
                    </Typography>
                  }
                  action={
                    <OptionsMenu
                      iconButtonProps={{ size: 'small' }}
                      options={[
                        'Rename Project',
                        'View Details',
                        'Add to Favorites',
                        { divider: true },
                        { text: 'Leave Project', menuItemProps: { sx: { color: 'error.main' } } }
                      ]}
                    />
                  }
                  title={
                    <Typography
                      href='/'
                      variant='h6'
                      component={Link}
                      onClick={e => e.preventDefault()}
                      sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                    >
                      {item.title}
                    </Typography>
                  }
                />
                <CardContent>
                  <Box
                    sx={{
                      mb: 4,
                      gap: 2,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <CustomChip
                      rounded
                      size='small'
                      skin='light'
                      sx={{ height: 60 }}
                      label={
                        <>
                          <Box sx={{ display: 'flex' }}>
                            <Typography sx={{ fontWeight: 600 }}>{item.budgetSpent}</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>{`/${item.budget}`}</Typography>
                          </Box>
                          <Typography sx={{ color: 'text.secondary' }}>Total Budget</Typography>
                        </>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex' }}>
                        <Typography sx={{ mr: 1, fontWeight: 600 }}>Start Date:</Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{item.startDate}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex' }}>
                        <Typography sx={{ mr: 1, fontWeight: 600 }}>Deadline:</Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{item.deadline}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography sx={{ color: 'text.secondary' }}>{item.description}</Typography>
                </CardContent>
                <Divider sx={{ my: '0 !important' }} />
                <CardContent sx={{ pt: 6 }}>
                  <Box sx={{ mb: 3.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex' }}>
                      <Typography sx={{ mr: 1, fontWeight: 600 }}>All Hours:</Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{item.hours}</Typography>
                    </Box>
                    <CustomChip size='small' skin='light' color={item.chipColor} label={`${item.daysLeft} days left`} />
                  </Box>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='caption'>{`Tasks: ${item.completedTask}/${item.totalTask}`}</Typography>
                    <Typography variant='caption'>
                      {`${Math.round((item.completedTask / item.totalTask) * 100)}% Completed`}
                    </Typography>
                  </Box>
                  <LinearProgress
                    color='primary'
                    variant='determinate'
                    value={Math.round((item.completedTask / item.totalTask) * 100)}
                    sx={{
                      mb: 3.5,
                      height: 8,
                      borderRadius: 2,
                      '& .MuiLinearProgress-bar': { borderRadius: 2 }
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AvatarGroup className='pull-up' sx={{ mr: 2 }}>
                        {item.avatarGroup &&
                          item.avatarGroup.map((person, index) => {
                            return (
                              <Tooltip key={index} title={person.name}>
                                <CustomAvatar src={person.avatar} alt={person.name} sx={{ height: 32, width: 32 }} />
                              </Tooltip>
                            )
                          })}
                      </AvatarGroup>
                      <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                        {item.members}
                      </Typography>
                    </Box>
                    <Box
                      href='/'
                      component={Link}
                      onClick={e => e.preventDefault()}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        '& svg': { mr: 1, color: 'text.disabled' }
                      }}
                    >
                      <Icon icon='mdi:message-outline' />
                      <Typography sx={{ color: 'text.disabled' }}>{item.comments}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
    </Grid>
  )
}

export default Projects
