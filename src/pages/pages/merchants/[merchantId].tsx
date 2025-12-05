// ** React Imports
import { useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomChip from 'src/@core/components/mui/chip'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** API Imports
import { useGetMerchantByIdQuery, useGetAdminPaymentsQuery } from 'src/store/api/v1/endpoints/admin'

// ** Types
import { PaymentResponse } from 'src/store/api/v1/types'

interface CellType {
    row: PaymentResponse
}

const MerchantDetail = () => {
    const router = useRouter()
    const { merchantId } = router.query
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

    const { data: merchant, isLoading, error } = useGetMerchantByIdQuery(merchantId as string, {
        skip: !merchantId
    })

    const { data: paymentsData, isLoading: paymentsLoading } = useGetAdminPaymentsQuery(
        {
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
            merchantId: merchantId as string
        },
        {
            skip: !merchantId
        }
    )

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </Box>
        )
    }

    if (error || !merchant) {
        return (
            <Box sx={{ p: 5 }}>
                <Alert severity="error">
                    Failed to load merchant details. Please try again.
                </Alert>
                <Button
                    variant="contained"
                    sx={{ mt: 3 }}
                    onClick={() => router.push('/pages/merchants/merchantlist')}
                >
                    Back to Merchants List
                </Button>
            </Box>
        )
    }

    const fullName = merchant.businessName || `${merchant.firstName} ${merchant.lastName}`
    const statusColor = merchant.verificationStatus === 'verified' ? 'success' : merchant.verificationStatus === 'rejected' ? 'error' : 'warning'

    // Transaction table columns
    const columns: GridColDef[] = [
        {
            flex: 0.2,
            minWidth: 180,
            field: 'transactionRef',
            headerName: 'Transaction',
            renderCell: ({ row }: CellType) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar skin='light' color='primary' sx={{ mr: 3, width: 34, height: 34 }}>
                        <Icon icon='mdi:receipt-text-outline' fontSize={20} />
                    </CustomAvatar>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {row.transactionRef}
                        </Typography>
                        <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                            {new Date(row.createdAt).toLocaleDateString()}
                        </Typography>
                    </Box>
                </Box>
            )
        },
        {
            flex: 0.15,
            minWidth: 120,
            field: 'amount',
            headerName: 'Amount',
            renderCell: ({ row }: CellType) => (
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {row.currency} {row.amount.toLocaleString()}
                </Typography>
            )
        },
        {
            flex: 0.15,
            minWidth: 120,
            field: 'fee',
            headerName: 'Fee',
            renderCell: ({ row }: CellType) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Icon icon='mdi:cash' fontSize={20} style={{ marginRight: 8, opacity: 0.7 }} />
                    <Typography variant='body2'>
                        {typeof row.fee === 'number' ? `${row.currency} ${row.fee.toLocaleString()}` : '—'}
                    </Typography>
                </Box>
            )
        },
        {
            flex: 0.15,
            minWidth: 120,
            field: 'status',
            headerName: 'Status',
            renderCell: ({ row }: CellType) => {
                const statusColorMap: Record<string, 'success' | 'error' | 'warning' | 'info' | 'primary'> = {
                    SUCCESS: 'success',
                    FAILED: 'error',
                    PENDING: 'warning',
                    PROCESSING: 'info',
                    CANCELLED: 'error'
                }

                return (
                    <CustomChip
                        skin='light'
                        size='small'
                        label={row.status}
                        color={statusColorMap[row.status] || 'primary'}
                        sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                    />
                )
            }
        },
        {
            flex: 0.2,
            minWidth: 180,
            field: 'createdAt',
            headerName: 'Date & Time',
            renderCell: ({ row }: CellType) => (
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                    {new Date(row.createdAt).toLocaleString()}
                </Typography>
            )
        }
    ]

    return (
        <Grid container spacing={6}>

            {/* Left Column: Stats & Transactions (Previously Right) */}
            <Grid item xs={12} md={7} lg={8}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            startIcon={<Icon icon='mdi:arrow-left' />}
                            onClick={() => router.push('/pages/merchants/merchantlist')}
                            sx={{ mb: 2, width: 'fit-content' }}
                        >
                            Back to List
                        </Button>
                    </Grid>
                    {/* Balance Cards */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{
                            p: 4,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #28C76F 0%, #48DA89 100%)',
                            color: 'white',
                            boxShadow: '0 4px 20px rgba(40, 199, 111, 0.2)',
                            position: 'relative',
                            overflow: 'hidden',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <Icon icon='mdi:wallet-outline' fontSize={90} style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.15 }} />
                            <Typography variant='body2' sx={{ color: 'white', opacity: 0.9, mb: 1, fontWeight: 500 }}>
                                Available Balance
                            </Typography>
                            <Typography variant='h5' sx={{ color: 'white', fontWeight: 700 }}>
                                PKR {merchant?.walletBalance?.availableBalance?.toLocaleString() || '0'}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{
                            p: 4,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #FF9F43 0%, #FFB775 100%)',
                            color: 'white',
                            boxShadow: '0 4px 20px rgba(255, 159, 67, 0.2)',
                            position: 'relative',
                            overflow: 'hidden',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <Icon icon='mdi:clock-time-three-outline' fontSize={90} style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.15 }} />
                            <Typography variant='body2' sx={{ color: 'white', opacity: 0.9, mb: 1, fontWeight: 500 }}>
                                Pending Balance
                            </Typography>
                            <Typography variant='h5' sx={{ color: 'white', fontWeight: 700 }}>
                                PKR {merchant?.walletBalance?.pendingBalance?.toLocaleString() || '0'}
                            </Typography>
                        </Box>
                    </Grid>


                    {/* Transactions Table */}
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader
                                title='Transaction History'
                                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                                action={
                                    <Button variant='outlined' size='small' startIcon={<Icon icon='mdi:download' />}>
                                        Export
                                    </Button>
                                }
                            />
                            <DataGrid
                                autoHeight
                                rows={paymentsData?.items || []}
                                columns={columns}
                                loading={paymentsLoading}
                                rowsPerPageOptions={[10, 25, 50]}
                                page={paginationModel.page}
                                pageSize={paginationModel.pageSize}
                                onPageChange={(newPage) => setPaginationModel(prev => ({ ...prev, page: newPage }))}
                                onPageSizeChange={(newPageSize) => setPaginationModel(prev => ({ ...prev, pageSize: newPageSize }))}
                                paginationMode="server"
                                rowCount={paymentsData?.total || 0}
                                sx={{
                                    '& .MuiDataGrid-columnHeaders': {
                                        backgroundColor: 'background.default',
                                        borderRadius: 0,
                                        fontWeight: 600
                                    }
                                }}
                            />
                        </Card>
                    </Grid>
                </Grid>
            </Grid>

            {/* Right Column: Profile Sidebar (Previously Left) */}
            <Grid item xs={12} md={5} lg={4} sx={{ position: 'relative' }}>
                <Card sx={{ position: 'absolute' }}>

                    <Box sx={{
                        height: 150,
                        width: '100%',
                        background: 'linear-gradient(135deg, #7367F0 0%, #9E95F5 100%)',
                        borderRadius: '6px 6px 0 0',
                    }} >

                    </Box>
                    <CardContent sx={{ pt: 0, mt: -12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <CustomAvatar
                            skin='light'
                            color='primary'
                            sx={{
                                width: 120,
                                height: 120,
                                fontSize: '3rem',
                                border: '5px solid white',
                                boxShadow: '0 4px 18px rgba(0,0,0,0.1)',
                                mb: 4,
                                backgroundColor: 'background.paper',
                                color: 'primary.main'
                            }}
                        >
                            {getInitials(fullName)}
                        </CustomAvatar>
                        <Typography variant='h5' sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}>
                            {fullName}
                        </Typography>
                        <Typography variant='body2' sx={{ color: 'text.secondary', mb: 2, textAlign: 'center' }}>
                            {merchant.email}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Chip
                                label={merchant.verificationStatus}
                                color={statusColor}
                                variant='filled'
                                size="small"
                                sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                            />
                            <Chip
                                label={merchant.isActive ? 'Active' : 'Inactive'}
                                color={merchant.isActive ? 'success' : 'default'}
                                size="small"
                            />
                        </Box>
                        <Divider sx={{ mb: 3, width: '100%' }} />
                        {[{
                            icon: 'mdi:email-outline', label: 'Email', value: merchant.email
                        },
                        { icon: 'mdi:phone-outline', label: 'Phone', value: merchant.phoneNumber },
                        { icon: 'mdi:map-marker-outline', label: 'Address', value: merchant.businessAddress },
                        { icon: 'mdi:file-document-outline', label: 'Tax ID', value: merchant.taxId },
                        { icon: 'mdi:account-outline', label: 'First Name', value: merchant.firstName },
                        { icon: 'mdi:account-outline', label: 'Last Name', value: merchant.lastName },
                        { icon: 'mdi:store-outline', label: 'Business Name', value: merchant.businessName },
                        ].map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2, '&:last-child': { mb: 0 } }}>
                                <CustomAvatar skin='light' color='primary' variant='rounded' sx={{ mr: 2, width: 30, height: 30 }}>
                                    <Icon icon={item.icon} fontSize={18} />
                                </CustomAvatar>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                                        {item.value || 'N/A'}
                                    </Typography>
                                    <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                                        {item.label}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}

                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default MerchantDetail
