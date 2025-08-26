// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// ** Data Grid
import { DataGrid, GridColDef } from '@mui/x-data-grid'

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

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Request ID', flex: 1 },
  { field: 'createdAt', headerName: 'Date', flex: 0.8, valueGetter: params => new Date(params.value as string).toLocaleString() },
  { field: 'requester', headerName: 'Requester', flex: 1 },
  { field: 'bankName', headerName: 'Bank', flex: 1 },
  {
    field: 'amount',
    headerName: 'Amount',
    flex: 0.8,
    align: 'right',
    headerAlign: 'right',
    renderCell: params => <Typography sx={{ fontWeight: 700 }}>{formatCurrency(params.value as number)}</Typography>
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 0.7,
    renderCell: params => {
      const v = params.value as RequestRow['status']
      const color = v === 'approved' ? 'success' : v === 'pending' ? 'warning' : 'error'

      return <Chip size='small' label={v} color={color as any} variant='outlined' />
    }
  },
  { field: 'reference', headerName: 'Reference', flex: 1.2 }
]

const Requests = () => {
  return (
    <Card>
      <CardHeader title='Requests' subheader='Latest transaction-related requests' titleTypographyProps={{ variant: 'h6', fontSize: '1.1rem' }} />
      <Divider />
      <CardContent>
        <Box sx={{ width: '100%' }}>
          <DataGrid autoHeight rows={mockRequests} columns={columns} rowsPerPageOptions={[5, 10]} pageSize={5} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default Requests


