// ** React Imports
import React from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Data Grid Imports
import { DataGrid } from '@mui/x-data-grid'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils
import { getInitials } from 'src/@core/utils/get-initials'

// ** Types
interface MerchantDetail {
  id: string
  merchantId: string
  email: string
  businessName: string
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'suspended'
  firstName: string
  lastName: string
  phoneNumber: string
  createdAt: string
  updatedAt: string
}

// ** Mock data - replace with actual API call
const mockMerchantData: MerchantDetail = {
  id: "68af3dcee56bae87dadd7938",
  merchantId: "MERCH_1756315086400_v124239ld",
  email: "malik.electronics@gmail.com",
  businessName: "Malik Electronics & Mobile Center",
  verificationStatus: "pending",
  firstName: "Muhammad",
  lastName: "Malik",
  phoneNumber: "+92-51-5551234",
  createdAt: "2025-08-27T17:18:06.404Z",
  updatedAt: "2025-09-04T20:20:37.140Z"
}

// ** Status color mapping
const statusColorMap = {
  verified: 'success',
  pending: 'warning',
  rejected: 'error',
  suspended: 'error'
} as const

// ** Payout Requests Table Component
const PayoutRequestsTable = () => {

  type RequestRow = {
    id: string
    createdAt: string
    requester: string
    bankName: string
    amount: number
    status: 'pending' | 'approved' | 'rejected'
    reference: string
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(value)

  const mockRequests: RequestRow[] = [
    { id: 'RQ-1001', createdAt: '2025-08-16T10:32:00Z', requester: 'Malik Electronics', bankName: 'MCB Bank', amount: 25000, status: 'pending', reference: 'Withdrawal #7721' },
    { id: 'RQ-1002', createdAt: '2025-08-15T14:05:00Z', requester: 'Malik Electronics', bankName: 'HBL', amount: 12000, status: 'approved', reference: 'Payout #7715' },
    { id: 'RQ-1003', createdAt: '2025-08-15T09:11:00Z', requester: 'Malik Electronics', bankName: 'ABL', amount: 56000, status: 'rejected', reference: 'Transfer #7711' },
    { id: 'RQ-1004', createdAt: '2025-08-14T18:44:00Z', requester: 'Malik Electronics', bankName: 'MCB Bank', amount: 9000, status: 'approved', reference: 'Payout #7702' }
  ]

  const columns: any[] = [
    { field: 'id', headerName: 'Request ID', flex: 1 },
    { field: 'createdAt', headerName: 'Date', flex: 0.8, valueGetter: (params: any) => new Date(params.value as string).toLocaleString() },
    { field: 'requester', headerName: 'Requester', flex: 1 },
    { field: 'bankName', headerName: 'Bank', flex: 1 },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 0.8,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: any) => <Typography sx={{ fontWeight: 700 }}>{formatCurrency(params.value as number)}</Typography>
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      renderCell: (params: any) => {
        const v = params.value as RequestRow['status']
        const color = v === 'approved' ? 'success' : v === 'pending' ? 'warning' : 'error'

        return <Chip size='small' label={v} color={color as any} variant='outlined' />
      }
    },
    { field: 'reference', headerName: 'Reference', flex: 1.2 }
  ]

  return (
    <Card>
      <CardHeader title='Payout Requests' subheader='Latest payout requests from this merchant' />
      <Divider />
      <CardContent>
        <Box sx={{ width: '100%' }}>
          <DataGrid autoHeight rows={mockRequests} columns={columns} rowsPerPageOptions={[5, 10]} pageSize={5} />
        </Box>
      </CardContent>
    </Card>
  )
}

function MerchantDetail() {
  const router = useRouter()


  const handleBack = () => {
    router.back()
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header with Back Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <Icon icon='mdi:arrow-left' />
        </IconButton>
        <Typography variant='h4' sx={{ fontWeight: 600 }}>
          Merchant Details
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Merchant Information Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Enhanced Basic Information Card */}
            <Grid item xs={12}>
              <Card sx={{ position: 'relative', overflow: 'visible' }}>

                <Divider />
                <CardContent sx={{ pt: 3 }}>
                  <Grid container spacing={4}>
                    {/* Merchant Profile Section */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <CustomAvatar
                          skin='light'
                          color='primary'
                          sx={{
                            width: 80,
                            height: 80,
                            fontSize: '2rem',
                            mb: 2,
                            border: '3px solid',
                            borderColor: 'primary.main'
                          }}
                        >
                          {getInitials(mockMerchantData.businessName)}
                        </CustomAvatar>
                        <Typography variant='h5' sx={{ fontWeight: 700, mb: 1 }}>
                          {mockMerchantData.businessName}
                        </Typography>
                        <Typography variant='body1' sx={{ color: 'text.secondary', mb: 2 }}>
                          {mockMerchantData.firstName} {mockMerchantData.lastName}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                          <Chip
                            icon={<Icon icon='mdi:store' />}
                            label='Business'
                            color='primary'
                            variant='outlined'
                            size='small'
                          />
                          <Chip
                            icon={<Icon icon='mdi:calendar' />}
                            label={new Date(mockMerchantData.createdAt).getFullYear()}
                            color='info'
                            variant='outlined'
                            size='small'
                          />
                        </Box>
                      </Box>
                    </Grid>

                    {/* Contact Information */}
                    <Grid item xs={12} md={4}>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box sx={{ mt: 0.5, color: 'text.secondary' }}>
                            <Icon icon='mdi:identifier' fontSize={20} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                              Merchant ID
                            </Typography>
                            <Typography variant='body2' sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                              {mockMerchantData.merchantId}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box sx={{ mt: 0.5, color: 'text.secondary' }}>
                            <Icon icon='mdi:email' fontSize={20} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                              Email Address
                            </Typography>
                            <Typography variant='body2' sx={{ fontWeight: 500 }}>
                              {mockMerchantData.email}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box sx={{ mt: 0.5, color: 'text.secondary' }}>
                            <Icon icon='mdi:phone' fontSize={20} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                              Phone Number
                            </Typography>
                            <Typography variant='body2' sx={{ fontWeight: 500 }}>
                              {mockMerchantData.phoneNumber}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Account Details */}
                    <Grid item xs={12} md={4}>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box sx={{ mt: 0.5, color: 'text.secondary' }}>
                            <Icon icon='mdi:shield-check' fontSize={20} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                              Verification Status
                            </Typography>
                            <Chip
                              label={mockMerchantData.verificationStatus}
                              color={statusColorMap[mockMerchantData.verificationStatus]}
                              size='small'
                              variant='filled'
                            />
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box sx={{ mt: 0.5, color: 'text.secondary' }}>
                            <Icon icon='mdi:calendar-plus' fontSize={20} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                              Member Since
                            </Typography>
                            <Typography variant='body2' sx={{ fontWeight: 500 }}>
                              {new Date(mockMerchantData.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>
                        </Box>
                        {/* <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box sx={{ mt: 0.5, color: 'text.secondary' }}>
                            <Icon icon='mdi:update' fontSize={20} />
                          </Box>
                          {/* <Box sx={{ flex: 1 }}>
                            <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                              Last Updated
                            </Typography>
                            <Typography variant='body2' sx={{ fontWeight: 500 }}>
                              {new Date(mockMerchantData.updatedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>
                      </Box> */}
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Additional Stats Row */}
                  <Divider sx={{ my: 3 }} />
                  <Grid container spacing={3}>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                        <Typography variant='h4' sx={{ fontWeight: 700, color: 'success.main' }}>
                          Rs 45,000
                        </Typography>
                        <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                          Available Balance
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                        <Typography variant='h4' sx={{ fontWeight: 700, color: 'primary.main' }}>
                          12
                        </Typography>
                        <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                          Total Transactions
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                        <Typography variant='h4' sx={{ fontWeight: 700, color: 'warning.main' }}>
                          4
                        </Typography>
                        <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                          Pending Requests
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                        <Typography variant='h4' sx={{ fontWeight: 700, color: 'info.main' }}>
                          95%
                        </Typography>
                        <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                          Success Rate
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </Grid>

        {/* Quick Actions Sidebar */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title='Quick Actions' />
            <Divider />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant='contained'
                  color='success'
                  startIcon={<Icon icon='mdi:check-circle-outline' />}
                  fullWidth
                >
                  Approve Merchant
                </Button>
                <Button
                  variant='outlined'
                  color='warning'
                  startIcon={<Icon icon='mdi:close-circle-outline' />}
                  fullWidth
                >
                  Reject Merchant
                </Button>
                <Button
                  variant='outlined'
                  color='error'
                  startIcon={<Icon icon='mdi:pause-circle-outline' />}
                  fullWidth
                >
                  Suspend Account
                </Button>
                <Button
                  variant='outlined'
                  color='error'
                  startIcon={<Icon icon='mdi:delete-outline' />}
                  fullWidth
                >
                  Delete Account
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Payout Requests Table */}
        <Grid item xs={12}>
          <PayoutRequestsTable />
        </Grid>
      </Grid>
    </Box >
  )
}

export default MerchantDetail
