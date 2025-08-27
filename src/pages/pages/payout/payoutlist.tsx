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
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([
    {
      id: '1',
      userId: 'USER001',
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      amount: 15000,
      currentBalance: 45000,
      bankName: 'HDFC Bank',
      accountNumber: '1234567890',
      accountTitle: 'JOHN DOE',
      ifscCode: 'HDFC0001234',
      status: 'pending',
      requestDate: '2024-01-15'
    },
    {
      id: '2',
      userId: 'USER002',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      amount: 25000,
      currentBalance: 75000,
      bankName: 'ICICI Bank',
      accountNumber: '9876543210',
      accountTitle: 'JANE SMITH',
      ifscCode: 'ICIC0005678',
      status: 'in-progress',
      requestDate: '2024-01-14',
      processedDate: '2024-01-15'
    },
    {
      id: '3',
      userId: 'USER003',
      userName: 'Mike Johnson',
      userEmail: 'mike.johnson@example.com',
      amount: 8000,
      currentBalance: 28000,
      bankName: 'SBI Bank',
      accountNumber: '1122334455',
      accountTitle: 'MIKE JOHNSON',
      ifscCode: 'SBIN0009012',
      status: 'pending',
      requestDate: '2024-01-13'
    },
    {
      id: '4',
      userId: 'USER004',
      userName: 'Sarah Wilson',
      userEmail: 'sarah.wilson@example.com',
      amount: 12000,
      currentBalance: 35000,
      bankName: 'Axis Bank',
      accountNumber: '5566778899',
      accountTitle: 'SARAH WILSON',
      ifscCode: 'UTIB0003456',
      status: 'rejected',
      requestDate: '2024-01-12',
      processedDate: '2024-01-13',
      reason: 'Invalid account details'
    },
    {
      id: '5',
      userId: 'USER005',
      userName: 'David Brown',
      userEmail: 'david.brown@example.com',
      amount: 18000,
      currentBalance: 52000,
      bankName: 'Kotak Mahindra Bank',
      accountNumber: '9988776655',
      accountTitle: 'DAVID BROWN',
      ifscCode: 'KKBK0009988',
      status: 'pending',
      requestDate: '2024-01-16'
    }
  ])

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

  // ** Handlers
  const handleStatusFilter = (event: any) => {
    setStatusFilter(event.target.value)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
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

  const handleActionConfirm = () => {
    if (!selectedRequest) return

    const updatedRequests = payoutRequests.map(request => {
      if (request.id === selectedRequest.id) {
        const updatedRequest = { ...request }

        if (actionDialog.action === 'accept') {
          updatedRequest.status = 'in-progress'
          updatedRequest.processedDate = new Date().toISOString().split('T')[0]
        } else if (actionDialog.action === 'reject') {
          updatedRequest.status = 'rejected'
          updatedRequest.reason = rejectionReason
          updatedRequest.processedDate = new Date().toISOString().split('T')[0]
        } else if (actionDialog.action === 'complete') {
          updatedRequest.status = 'in-progress'
        }

        return updatedRequest
      }

      return request
    })

    setPayoutRequests(updatedRequests)
    setActionDialog({ open: false, action: '' })
    setRejectionReason('')
    setSelectedRequest(null)

    setSnackbar({
      open: true,
      message: `Request ${actionDialog.action === 'accept' ? 'accepted' : actionDialog.action === 'reject' ? 'rejected' : 'completed'} successfully`,
      severity: 'success'
    })
  }

  const handleCloseDialog = () => {
    setActionDialog({ open: false, action: '' })
    setRejectionReason('')
    setSelectedRequest(null)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // ** Copy to clipboard function
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbar({
        open: true,
        message: `${label} copied to clipboard!`,
        severity: 'success'
      })
    }).catch(() => {
      setSnackbar({
        open: true,
        message: 'Failed to copy to clipboard',
        severity: 'error'
      })
    })
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
    total: payoutRequests.length,
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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant='body1' sx={{ fontWeight: 600, flex: 1 }}>
                {params.value}
              </Typography>
              <Tooltip title="Copy Bank Details">
                <IconButton
                  size='small'
                  onClick={() => copyToClipboard(
                    `${request.bankName}\nAccount: ${request.accountNumber}\nIFSC: ${request.ifscCode}\nTitle: ${request.accountTitle}\nAmount: Rs. ${request.amount.toLocaleString()}`,
                    'Bank details'
                  )}
                >
                  <Icon icon='mdi:content-copy' fontSize='small' />
                </IconButton>
              </Tooltip>
            </Box>
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

            <Tooltip title="Copy Bank Details">
              <IconButton
                size='small'
                onClick={() => copyToClipboard(
                  `${request.bankName}\nAccount: ${request.accountNumber}\nIFSC: ${request.ifscCode}\nTitle: ${request.accountTitle}\nAmount: Rs. ${request.amount.toLocaleString()}`,
                  'Bank details'
                )}
              >
                <Icon icon='mdi:content-copy' />
              </IconButton>
            </Tooltip>
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
          subheader={`Showing ${filteredRequests.length} of ${payoutRequests.length} requests`}
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
          <DataGrid
            rows={filteredRequests}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            checkboxSelection
            disableSelectionOnClick
            autoHeight
            selectionModel={rowSelectionModel}
            onSelectionModelChange={(newRowSelectionModel: GridSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel)
            }}
          />
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
            disabled={actionDialog.action === 'reject' && !rejectionReason.trim()}
          >
            Confirm
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
