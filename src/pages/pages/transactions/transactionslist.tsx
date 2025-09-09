// ** React Imports
import { useState, MouseEvent, useCallback } from 'react'

// ** Next Imports'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Tooltip from '@mui/material/Tooltip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import

// ** Types Imports
import type { PaymentResponse } from 'src/store/api/v1/types'

interface TransactionItem {
  id: string
  referenceId: string
  requestedFrom: string
  isCompany: boolean
  timestamp: string
  amount: number
  currency: string
  status: 'success' | 'failed' | 'not_checked'
}

// ** Custom Table Components Imports
import TableHeader from './components/tableheader'
import CheckTransactionDrawer from './components/checkTransactionDrawer'

// ** Hooks
import { useGetAdminPaymentsQuery } from 'src/store/api/v1/endpoints/admin'

interface CellType {
  row: TransactionItem
}



// Status icon variants
const statusIconObj: { [key: string]: { icon: string; color: string } } = {
  success: { icon: 'mdi:check-circle-outline', color: 'success.main' },
  failed: { icon: 'mdi:close-circle-outline', color: 'error.main' },
  not_checked: { icon: 'mdi:clock-outline', color: 'warning.main' }
}


// ** renders user/company column
const renderUser = (row: TransactionItem) => {
  const name = row.requestedFrom
  const icon = row.isCompany ? 'mdi:domain' : 'mdi:account'

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <CustomAvatar
        skin='light'
        color={row.isCompany ? 'info' : 'primary'}
        sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}
      >
        <Icon icon={icon} fontSize={16} />
      </CustomAvatar>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
        <Typography noWrap variant='body2' sx={{ fontWeight: 600 }}>
          {name}
        </Typography>
        <Typography noWrap variant='caption' sx={{ color: 'text.disabled' }}>
          {row.isCompany ? 'Merchant' : 'Individual'}
        </Typography>
      </Box>
    </Box>
  )
}

// ** renders reference ID column with copy functionality
const renderReferenceId = (row: TransactionItem) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(row.referenceId)
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography noWrap variant='body2' sx={{ mr: 1, fontFamily: 'monospace' }}>
        {row.referenceId}
      </Typography>
      <Tooltip title="Copy Reference ID">
        <IconButton size='small' onClick={copyToClipboard}>
          <Icon icon='mdi:content-copy' fontSize={16} />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

// ** renders amount column
const renderAmount = (row: TransactionItem) => {
  return (
    <Typography noWrap variant='body2' sx={{ fontWeight: 600 }}>
      {row.currency} {row.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
    </Typography>
  )
}

// ** renders time column
const renderTime = (row: TransactionItem) => {
  const date = new Date(row.timestamp)
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography noWrap variant='body2'>
        {formattedDate}
      </Typography>
      <Typography noWrap variant='caption' sx={{ color: 'text.disabled' }}>
        {formattedTime}
      </Typography>
    </Box>
  )
}

const RowOptions = ({ row }: { row: TransactionItem }) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleCheckStatus = () => {
    handleRowOptionsClose()

    // Handle check status logic here
    console.log('Checking status for transaction:', row.referenceId)
  }

  const handleViewDetails = () => {
    handleRowOptionsClose()

    // Handle view details logic here
    console.log('Viewing details for transaction:', row.referenceId)
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          onClick={handleCheckStatus}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='mdi:refresh' fontSize={20} />
          Check Status
        </MenuItem>
        <MenuItem
          onClick={handleViewDetails}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='mdi:eye-outline' fontSize={20} />
          View Details
        </MenuItem>
      </Menu>
    </>
  )
}

const columns = [
  {
    flex: 0.25,
    minWidth: 250,
    field: 'referenceId',
    headerName: 'Transaction Reference ID',
    renderCell: ({ row }: CellType) => renderReferenceId(row)
  },
  {
    flex: 0.25,
    minWidth: 200,
    field: 'requestedFrom',
    headerName: 'Requested From',
    renderCell: ({ row }: CellType) => renderUser(row)
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: 'timestamp',
    headerName: 'Time',
    renderCell: ({ row }: CellType) => renderTime(row)
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: 'amount',
    headerName: 'Amount',
    renderCell: ({ row }: CellType) => renderAmount(row)
  },
  {
    flex: 0.15,
    minWidth: 130,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      const variant = statusIconObj[row.status]

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ mr: 1, color: variant.color }}>
            <Icon icon={variant.icon} fontSize={20} />
          </Box>
          <CustomChip
            skin='light'
            size='small'
            label={row.status.replace('_', ' ')}
            color={row.status === 'success' ? 'success' : row.status === 'failed' ? 'error' : 'warning'}
            sx={{ textTransform: 'capitalize' }}
          />
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <RowOptions row={row} />
  }
]

const TransactionList = () => {
  // ** State
  const [searchValue, setSearchValue] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [checkTransactionOpen, setCheckTransactionOpen] = useState<boolean>(false)

  // ** Fetch admin payments data
  const { data: paymentsResponse, isLoading, error } = useGetAdminPaymentsQuery({
    page: 1,
    limit: 100
  })

  // ** Alert visibility state
  const [visibleAlerts, setVisibleAlerts] = useState({
    success: true,
    error: true,
    warning: true,
    info: true
  })

  // ** Transform API data to match existing interface
  const transformedTransactions: TransactionItem[] = (paymentsResponse?.items || []).map((payment: PaymentResponse) => ({
    id: payment.id,
    referenceId: payment.transactionRef,
    requestedFrom: payment.merchantId, // Using merchantId as requestedFrom for now
    isCompany: true, // Assuming merchants are companies
    timestamp: payment.createdAt,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status === 'SUCCESS' ? 'success' : payment.status === 'FAILED' ? 'failed' : 'not_checked'
  }))

  // ** Calculate statistics
  const successTransactions = transformedTransactions.filter(t => t.status === 'success').length
  const failedTransactions = transformedTransactions.filter(t => t.status === 'failed').length
  const notCheckedTransactions = transformedTransactions.filter(t => t.status === 'not_checked').length
  const totalAmount = transformedTransactions.reduce((sum, t) => sum + t.amount, 0)

  // ** Filter transactions based on search and status
  const filteredTransactions = transformedTransactions.filter(transaction => {
    const matchesSearch = searchValue === '' ||
      transaction.referenceId.toLowerCase().includes(searchValue.toLowerCase()) ||
      transaction.requestedFrom.toLowerCase().includes(searchValue.toLowerCase())

    const matchesStatus = statusFilter === '' || transaction.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleSearchChange = useCallback((val: string) => {
    setSearchValue(val)
  }, [])

  const handleStatusChange = useCallback((e: SelectChangeEvent) => {
    setStatusFilter(e.target.value)
  }, [])

  const toggleCheckTransactionDrawer = () => setCheckTransactionOpen(!checkTransactionOpen)

  // ** Alert handlers
  const handleCloseAlert = (alertType: keyof typeof visibleAlerts) => {
    setVisibleAlerts(prev => ({ ...prev, [alertType]: false }))
  }

  const handleShowAllAlerts = () => {
    setVisibleAlerts({
      success: true,
      error: true,
      warning: true,
      info: true
    })
  }

  // ** Check if any alerts are hidden
  const hasHiddenAlerts = Object.values(visibleAlerts).some(visible => !visible)

  return (
    <Grid container spacing={6}>
      {/* Statistics Cards */}
      <Grid item xs={12}>
        {hasHiddenAlerts && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              size="small"
              variant="outlined"
              onClick={handleShowAllAlerts}
              startIcon={<Icon icon='mdi:eye' />}
            >
              Show Alerts
            </Button>
          </Box>
        )}

        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
          <Stack direction="column" spacing={2} rowGap={2} sx={{ flex: 1, minWidth: 0 }}>
            {/* Successful Transactions Alert */}
            {visibleAlerts.success && (
              <Alert
                severity='success'
                onClose={() => handleCloseAlert('success')}
              >
                {successTransactions} Successful Transactions
              </Alert>
            )}

            {/* Failed Transactions Alert */}
            {visibleAlerts.error && (
              <Alert
                severity='error'
                onClose={() => handleCloseAlert('error')}
              >
                {failedTransactions} Failed Transactions
              </Alert>
            )}
          </Stack>

          <Stack direction="column" spacing={2} rowGap={2} sx={{ flex: 1, minWidth: 0 }}>
            {/* Not Checked Alert */}
            {visibleAlerts.warning && (
              <Alert
                severity='warning'
                onClose={() => handleCloseAlert('warning')}
              >
                {notCheckedTransactions} Not Checked Transactions
              </Alert>
            )}

            {/* Total Amount Alert */}
            {visibleAlerts.info && (
              <Alert
                severity='info'
                onClose={() => handleCloseAlert('info')}
              >
                Rs {totalAmount.toLocaleString()} Total Amount
              </Alert>
            )}
          </Stack>
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Transaction Filters' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder='Paste reference ID to check transaction status'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Icon icon='mdi:magnify' />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='status-select'>Status Filter</InputLabel>
                  <Select
                    fullWidth
                    value={statusFilter}
                    id='select-status'
                    label='Status Filter'
                    labelId='status-select'
                    onChange={handleStatusChange}
                    inputProps={{ placeholder: 'Status Filter' }}
                  >
                    <MenuItem value=''>All Statuses</MenuItem>
                    <MenuItem value='success'>Success</MenuItem>
                    <MenuItem value='failed'>Failed</MenuItem>
                    <MenuItem value='not_checked'>Not Checked</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <TableHeader
            value={searchValue}
            handleFilter={handleSearchChange}
            toggle={toggleCheckTransactionDrawer}
          />
          <Box sx={{ width: '100%', overflowX: 'hidden' }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <Typography>Loading transactions...</Typography>
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ m: 2 }}>
                Failed to load transactions. Please try again.
              </Alert>
            ) : filteredTransactions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Icon icon='mdi:receipt-outline' style={{ fontSize: '48px', color: '#666', marginBottom: '16px' }} />
                <Typography variant='h6' sx={{ mb: 1 }}>
                  No transactions found
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {searchValue || statusFilter ? 'No transactions match your filters.' : 'No transactions available.'}
                </Typography>
              </Box>
            ) : (
              <DataGrid
                autoHeight
                rows={filteredTransactions}
                columns={columns}
                checkboxSelection
                pageSize={pageSize}
                disableSelectionOnClick
                rowsPerPageOptions={[10, 25, 50]}
                onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
                loading={isLoading}
              />
            )}
          </Box>
        </Card>
      </Grid>

      <CheckTransactionDrawer open={checkTransactionOpen} toggle={toggleCheckTransactionDrawer} />
    </Grid >
  )
}

export default TransactionList
