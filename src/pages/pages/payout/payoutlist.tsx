// ** MUI Imports
import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

// ** Data Grid Imports
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid'

// ** Date Picker Imports
import PickersRange from '@/views/forms/form-elements/pickers/PickersRange'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** API Imports
import {
  useGetAdminPayoutRequestsQuery,
  useApprovePayoutRequestMutation,
  useRejectPayoutRequestMutation
} from 'src/store/api/v1/endpoints/admin'
import { AdminPayoutRequestItem } from 'src/store/api/v1/types'

// ** Types
interface PayoutRequest {
  id: string
  userId: string
  userName: string
  userEmail: string
  amount: number
  currentBalance: number
  bankName: string
  accountNumber: string
  accountTitle: string
  ifscCode: string
  status: 'pending' | 'in-progress' | 'rejected'
  requestDate: string
  processedDate?: string
  reason?: string
}

const PayoutList = () => {
  // ** States
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<PayoutRequest | null>(null)
  const [actionDialog, setActionDialog] = useState<{ open: boolean; action: string }>({ open: false, action: '' })
  const [rejectionReason, setRejectionReason] = useState('')
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  })

  // ** Map API response to component data structure
  const mapApiToComponent = React.useCallback((item: AdminPayoutRequestItem): PayoutRequest => {
    // Map status from API format to component format
    let mappedStatus: 'pending' | 'in-progress' | 'rejected' = 'pending'
    if (item.status === 'PENDING') {
      mappedStatus = 'pending'
    } else if (item.status === 'IN_PROGRESS' || item.status === 'COMPLETED') {
      mappedStatus = 'in-progress'
    } else if (item.status === 'REJECTED') {
      mappedStatus = 'rejected'
    }

    return {
      id: item.id,
      userId: item.merchantId,
      userName: item.merchantName,
      userEmail: item.merchantEmail,
      amount: item.amount,
      currentBalance: item.availableAmount,
      bankName: item.destination?.bankName || 'N/A',
      accountNumber: item.destination?.accountLast4 ? `****${item.destination.accountLast4}` : 'N/A',
      accountTitle: item.merchantName.toUpperCase(),
      ifscCode: 'N/A', // Not available in API response
      status: mappedStatus,
      requestDate: item.createdAt.split('T')[0]
    }
  }, [])

  // ** Map status filter to API format
  const getApiStatus = (filter: string): string | undefined => {
    if (filter === 'all') {
      return undefined
    }
    if (filter === 'pending') {
      return 'PENDING'
    }
    if (filter === 'in-progress') {
      return 'IN_PROGRESS'
    }
    if (filter === 'rejected') {
      return 'REJECTED'
    }

    return undefined
  }

  // ** API Query
  const { data: payoutData, isLoading, error, refetch } = useGetAdminPayoutRequestsQuery({
    page,
    limit: pageSize,
    status: getApiStatus(statusFilter),
    search: searchQuery || undefined
  })

  // ** Mutations
  const [approvePayoutRequest, { isLoading: isApproving }] = useApprovePayoutRequestMutation()
  const [rejectPayoutRequest, { isLoading: isRejecting }] = useRejectPayoutRequestMutation()

  // ** Update payout requests when API data changes
  React.useEffect(() => {
    if (payoutData?.items) {
      const mappedRequests = payoutData.items.map(mapApiToComponent)
      setPayoutRequests(mappedRequests)
    }
  }, [payoutData, mapApiToComponent])

  // ** Handlers
  const handleStatusFilter = (event: any) => {
    setStatusFilter(event.target.value)
    setPage(1) // Reset to first page when filter changes
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    setPage(1) // Reset to first page when search changes
  }

  const handleDateFilterChange = (event: any) => {
    setDateFilter(event.target.value)
    if (event.target.value !== 'custom') {
      setStartDate(null)
      setEndDate(null)
    }
  }

  const handleActionClick = (request: PayoutRequest, action: string) => {
    setSelectedRequest(request)
    setActionDialog({ open: true, action })
  }

  const handleActionConfirm = async () => {
    if (!selectedRequest) return

    try {
      if (actionDialog.action === 'accept') {
        // Approve payout request
        await approvePayoutRequest({ payoutRequestId: selectedRequest.id }).unwrap()
        setSnackbar({
          open: true,
          message: 'Payout request approved successfully',
          severity: 'success'
        })
      } else if (actionDialog.action === 'reject') {
        // Reject payout request
        if (!rejectionReason.trim()) {
          setSnackbar({
            open: true,
            message: 'Please provide a rejection reason',
            severity: 'error'
          })

          return
        }
        await rejectPayoutRequest({
          payoutRequestId: selectedRequest.id,
          reason: rejectionReason
        }).unwrap()
        setSnackbar({
          open: true,
          message: 'Payout request rejected successfully',
          severity: 'success'
        })
      } else if (actionDialog.action === 'complete') {
        // TODO: Add complete mutation when API endpoint is available
        setSnackbar({
          open: true,
          message: 'Complete action not yet implemented',
          severity: 'success'
        })
      }

      // Close dialog and reset state
      setActionDialog({ open: false, action: '' })
      setRejectionReason('')
      setSelectedRequest(null)

      // Data will be automatically refetched due to invalidatesTags
    } catch (error: any) {
      const errorMessage = error?.data?.error || error?.data?.message || 'Failed to update request. Please try again.'
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      })
    }
  }

  const handleCloseDialog = () => {
    setActionDialog({ open: false, action: '' })
    setRejectionReason('')
    setSelectedRequest(null)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // ** Date filter helper function
  const isDateInRange = (requestDate: string) => {
    const today = new Date()
    const requestDateTime = new Date(requestDate)

    switch (dateFilter) {
      case 'today':
        return requestDateTime.toDateString() === today.toDateString()
      case 'yesterday':
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        return requestDateTime.toDateString() === yesterday.toDateString()
      case 'last3days':
        const threeDaysAgo = new Date(today)
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

        return requestDateTime >= threeDaysAgo
      case 'last7days':
        const sevenDaysAgo = new Date(today)
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        return requestDateTime >= sevenDaysAgo
      case 'last30days':
        const thirtyDaysAgo = new Date(today)
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        return requestDateTime >= thirtyDaysAgo
      case 'custom':
        if (startDate && endDate) {
          const endDateTime = new Date(endDate)
          endDateTime.setHours(23, 59, 59) // Include the entire end date

          return requestDateTime >= startDate && requestDateTime <= endDateTime
        }

        return true
      default:
        return true
    }
  }

  // ** Filtered requests
  const filteredRequests = payoutRequests.filter(request => {
    // Filter by status
    const statusMatch = statusFilter === 'all' || request.status === statusFilter

    // Filter by search query (user name or email)
    const searchMatch = searchQuery === '' ||
      request.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.userId.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by date
    const dateMatch = isDateInRange(request.requestDate)

    return statusMatch && searchMatch && dateMatch
  })

  // ** Statistics
  const stats = {
    total: payoutData?.total || 0,
    pending: payoutRequests.filter(r => r.status === 'pending').length,
    inProgress: payoutRequests.filter(r => r.status === 'in-progress').length,
    rejected: payoutRequests.filter(r => r.status === 'rejected').length,
    totalAmount: payoutRequests.reduce((sum, r) => sum + r.amount, 0)
  }

  // ** Status chip colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'in-progress': return 'info'
      case 'rejected': return 'error'
      default: return 'default'
    }
  }

  // ** Data Grid Columns
  const columns: GridColDef[] = [
    {
      field: 'userName',
      headerName: 'Merchant Name',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.main' }}>
            {params.value.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              {params.value}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {params.row.userEmail}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'amount',
      headerName: 'Requested Amount',
      width: 150,
      type: 'number',
      renderCell: (params) => (
        <Typography variant='body2' sx={{ fontWeight: 600, color: 'primary.main' }}>
          Rs. {params.value.toLocaleString()}
        </Typography>
      )
    },
    {
      field: 'currentBalance',
      headerName: 'Current Balance',
      width: 150,
      type: 'number',
      renderCell: (params) => (
        <Typography variant='body2' sx={{ fontWeight: 600, color: 'success.main' }}>
          Rs. {params.value.toLocaleString()}
        </Typography>
      )
    },
    {
      field: 'bankName',
      headerName: 'Bank Details',
      width: 300,
      renderCell: (params) => {
        const request = params.row

        if (request.status === 'rejected') {
          return (
            <Box sx={{ py: 1 }}>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'error.main', mb: 1 }}>
                Rejection Reason:
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {request.reason || 'No reason provided'}
              </Typography>
            </Box>
          )
        }

        return (
          <Box sx={{ py: 1 }}>
            <Typography variant='body1' sx={{ fontWeight: 600, mb: 1 }}>
              {params.value}
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
              A/C: {params.row.accountNumber}
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
              IFSC: {params.row.ifscCode}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {params.row.accountTitle}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value.replace('-', ' ').toUpperCase()}
          color={getStatusColor(params.value) as any}
          size='small'
        />
      )
    },
    {
      field: 'requestDate',
      headerName: 'Request Date',
      width: 130,
      type: 'date',
      valueGetter: (params) => new Date(params.value),
      renderCell: (params) => (
        <Typography variant='body2'>
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const request = params.row

        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {request.status === 'pending' && (
              <>
                <Tooltip title="Accept Request">
                  <IconButton
                    size='small'
                    color='success'
                    onClick={() => handleActionClick(request, 'accept')}
                  >
                    <Icon icon='mdi:check' />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reject Request">
                  <IconButton
                    size='small'
                    color='error'
                    onClick={() => handleActionClick(request, 'reject')}
                  >
                    <Icon icon='mdi:close' />
                  </IconButton>
                </Tooltip>
              </>
            )}

            {request.status === 'in-progress' && (
              <Tooltip title="Mark as Completed">
                <Button
                  variant='contained'
                  size='small'
                  startIcon={<Icon icon='mdi:check-circle' />}
                  onClick={() => handleActionClick(request, 'complete')}
                >
                  Complete
                </Button>
              </Tooltip>
            )}
          </Box>
        )
      }
    }
  ]

  // ** Row selection state
  const [rowSelectionModel, setRowSelectionModel] = useState<GridSelectionModel>([])

  return (
    <Box>
      {/* Statistics Cards */}
      <Grid container spacing={6} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <CardStatisticsVerticalComponent
            stats={stats.pending.toString()}
            title='New Requests'
            subtitle='Awaiting approval'
            icon={<Icon icon='mdi:clock-outline' />}
            color='warning'
            trendNumber=''
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardStatisticsVerticalComponent
            stats={stats.inProgress.toString()}
            title='In Progress'
            subtitle='Being processed'
            icon={<Icon icon='mdi:progress-clock' />}
            color='info'
            trendNumber=''
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardStatisticsVerticalComponent
            stats={stats.rejected.toString()}
            title='Rejected'
            subtitle='Declined requests'
            icon={<Icon icon='mdi:close-circle-outline' />}
            color='error'
            trendNumber=''
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardStatisticsVerticalComponent
            stats={`Rs. ${stats.totalAmount.toLocaleString()}`}
            title='Total Amount'
            subtitle='Sum of all requests'
            icon={<Icon icon='mdi:currency-usd' />}
            color='secondary'
            trendNumber=''
          />
        </Grid>
      </Grid>

      {/* Data Grid Section */}
      <Card sx={{ mb: 6 }}>
        <CardHeader
          title='Payout Requests'
          subheader={`Showing ${filteredRequests.length} of ${payoutData?.total || 0} requests`}
          action={
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                size='small'
                placeholder='Search by name, email, or user ID...'
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ minWidth: 300 }}
                InputProps={{
                  startAdornment: <Icon icon='mdi:magnify' style={{ marginRight: 8, color: '#666' }} />
                }}
              />
              <FormControl size='small' sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={statusFilter}
                  label='Filter by Status'
                  onChange={handleStatusFilter}
                >
                  <MenuItem value='all'>All Requests</MenuItem>
                  <MenuItem value='pending'>Pending</MenuItem>
                  <MenuItem value='in-progress'>In Progress</MenuItem>
                  <MenuItem value='rejected'>Rejected</MenuItem>
                </Select>
              </FormControl>
              <FormControl size='small' sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Date</InputLabel>
                <Select
                  value={dateFilter}
                  label='Filter by Date'
                  onChange={handleDateFilterChange}
                >
                  <MenuItem value='all'>All Dates</MenuItem>
                  <MenuItem value='today'>Today</MenuItem>
                  <MenuItem value='yesterday'>Yesterday</MenuItem>
                  <MenuItem value='last3days'>Last 3 Days</MenuItem>
                  <MenuItem value='last7days'>Last 7 Days</MenuItem>
                  <MenuItem value='last30days'>Last 30 Days</MenuItem>
                  <MenuItem value='custom'>Custom Range</MenuItem>
                </Select>
              </FormControl>
              {dateFilter === 'custom' && (
                <PickersRange popperPlacement='bottom-start' />
              )}
            </Box>
          }
        />
        <CardContent sx={{ p: 0 }}>
          {isLoading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography>Loading payout requests...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to load payout requests. Please try again.
              </Alert>
              <Button variant="contained" onClick={() => refetch()}>
                Retry
              </Button>
            </Box>
          ) : (
            <DataGrid
              rows={filteredRequests}
              columns={columns}
              page={page - 1}
              pageSize={pageSize}
              rowsPerPageOptions={[10, 20, 50, 100]}
              checkboxSelection
              disableSelectionOnClick
              autoHeight
              paginationMode="server"
              rowCount={payoutData?.total || 0}
              onPageChange={(newPage) => setPage(newPage + 1)}
              onPageSizeChange={(newPageSize) => {
                setPageSize(newPageSize)
                setPage(1)
              }}
              selectionModel={rowSelectionModel}
              onSelectionModelChange={(newRowSelectionModel: GridSelectionModel) => {
                setRowSelectionModel(newRowSelectionModel)
              }}
              loading={isLoading}
            />
          )}
        </CardContent>
      </Card>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog.open} onClose={handleCloseDialog} maxWidth='sm' fullWidth>
        <DialogTitle>
          {actionDialog.action === 'accept' && 'Accept Payout Request'}
          {actionDialog.action === 'reject' && 'Reject Payout Request'}
          {actionDialog.action === 'complete' && 'Complete Payout Request'}
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Typography variant='body1' sx={{ mb: 2 }}>
                Are you sure you want to {actionDialog.action} the payout request for{' '}
                <strong>{selectedRequest.userName}</strong> (Rs. {selectedRequest.amount.toLocaleString()})?
              </Typography>

              {actionDialog.action === 'reject' && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label='Rejection Reason'
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  sx={{ mt: 2 }}
                  required
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleActionConfirm}
            variant='contained'
            color={actionDialog.action === 'reject' ? 'error' : 'primary'}
            disabled={
              (actionDialog.action === 'reject' && !rejectionReason.trim()) ||
              isApproving ||
              isRejecting
            }
          >
            {isApproving || isRejecting ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default PayoutList
