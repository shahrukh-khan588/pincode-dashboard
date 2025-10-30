// ** React Imports
import React, { useState } from 'react'

// ** Next Imports
import type { NextPage } from 'next'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

// import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Paper from '@mui/material/Paper'

// ** Data Grid
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Hooks
import { useGetMerchantPayoutRequestsQuery } from 'src/store/api/v1/endpoints/payout'

// ** Types
import type { MerchantPayoutRequestItem } from 'src/store/api/v1/types'

// ** Icon
import Icon from 'src/@core/components/icon'

// ** Utils
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(value)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'success':
      return 'success'
    case 'pending':
      return 'warning'
    case 'processing':
      return 'info'
    case 'failed':
      return 'error'
    case 'cancelled':
      return 'default'
    default:
      return 'default'
  }
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'success':
      return 'mdi:check-circle'
    case 'pending':
      return 'mdi:clock-outline'
    case 'processing':
      return 'mdi:loading'
    case 'failed':
      return 'mdi:close-circle'
    case 'cancelled':
      return 'mdi:cancel'
    default:
      return 'mdi:help-circle'
  }
}

const PayoutRequestsPage: NextPage & { authGuard?: boolean } = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed' | 'failed'>('all')

  // Fetch payout requests (new endpoint)
  const { data: payoutResponse, isLoading, error } = useGetMerchantPayoutRequestsQuery({
    page: 1,
    limit: 100
  })

  // Extract requests from response
  const payoutRequests: MerchantPayoutRequestItem[] = payoutResponse?.items || []

  // Filter requests based on active tab
  const filteredRequests = payoutRequests.filter((request: MerchantPayoutRequestItem) => {
    if (activeTab === 'all') return true

    // Map API status to frontend status
    const statusMapping: { [key: string]: string } = {
      'PENDING': 'pending',
      'SUCCESS': 'completed',
      'FAILED': 'failed',
      'PROCESSING': 'processing',
      'CANCELLED': 'cancelled'
    }

    const mappedStatus = statusMapping[request.status] || request.status.toLowerCase()

    return mappedStatus === activeTab
  })

  // Calculate statistics
  const stats = {
    total: payoutRequests.length,
    pending: payoutRequests.filter((r: MerchantPayoutRequestItem) => r.status === 'PENDING').length,
    completed: payoutRequests.filter((r: MerchantPayoutRequestItem) => r.status === 'SUCCESS').length,
    failed: payoutRequests.filter((r: MerchantPayoutRequestItem) => r.status === 'FAILED').length,
    totalAmount: payoutRequests.reduce((sum: number, r: MerchantPayoutRequestItem) => sum + r.amount, 0)
  }

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {formatDate(params.value)}
        </Typography>
      )
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600}>
          {formatCurrency(params.value)}
        </Typography>
      )
    },
    {
      field: 'destination',
      headerName: 'Destination',
      flex: 1.5,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
            <Icon icon='mdi:bank' fontSize={16} />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {params.value?.bankName || params.value?.type}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.value?.accountLast4 ? `•••• ${params.value.accountLast4}` : 'Destination'}
            </Typography>
          </Box>
        </Stack>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        // Map API status to display status
        const statusMapping: { [key: string]: string } = {
          'PENDING': 'Pending',
          'SUCCESS': 'Completed',
          'FAILED': 'Failed',
          'PROCESSING': 'Processing',
          'CANCELLED': 'Cancelled'
        }

        const displayStatus = statusMapping[params.value] || params.value

        return (
          <Chip
            label={displayStatus}
            color={getStatusColor(params.value) as any}
            size="small"
            icon={<Icon icon={getStatusIcon(params.value)} />}
          />
        )
      }
    }
  ]

  return (
    <Grid container spacing={6}>
      {/* Header */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Payout Requests
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track and manage your payout requests
            </Typography>
          </Box>
          {/* <Button
            variant="contained"
            startIcon={<Icon icon='mdi:plus' />}
            onClick={() => window.location.href = '/pages/wallet/my-wallet'}
          >
            New Request
          </Button> */}
        </Box>
      </Grid>

      {/* Statistics Cards */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                <Icon icon='mdi:bank-transfer' />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Requests
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.dark' }}>
                <Icon icon='mdi:clock-outline' />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {stats.pending}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'success.light', color: 'success.dark' }}>
                <Icon icon='mdi:check-circle' />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {stats.completed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'error.light', color: 'error.dark' }}>
                <Icon icon='mdi:close-circle' />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {stats.failed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Failed
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Tabs */}
      <Grid item xs={12}>
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="scrollable"
            allowScrollButtonsMobile
          >
            <Tab label={`All (${stats.total})`} value="all" />
            <Tab label={`Pending (${stats.pending})`} value="pending" />
            <Tab label={`Completed (${stats.completed})`} value="completed" />
            <Tab label={`Failed (${stats.failed})`} value="failed" />
          </Tabs>
        </Paper>
      </Grid>

      {/* Data Grid */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Payout Requests"
            titleTypographyProps={{ variant: 'h6', fontSize: '1.1rem' }}
            subheader={`${filteredRequests.length} request(s) found`}
          />
          <Divider />
          <CardContent>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <Typography>Loading payout requests...</Typography>
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                Failed to load payout requests. Please try again.
              </Alert>
            ) : (
              <div style={{ width: '100%' }}>
                <DataGrid
                  autoHeight
                  rows={filteredRequests}
                  columns={columns}
                  rowsPerPageOptions={[5, 10, 25]}
                  pageSize={10}
                  disableSelectionOnClick
                />
              </div>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

PayoutRequestsPage.authGuard = true

export default PayoutRequestsPage
