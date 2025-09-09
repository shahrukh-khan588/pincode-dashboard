// ** React
import { useMemo, useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import type { MerchantDataType } from 'src/context/types'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Data Grid
import { DataGrid, GridColDef } from '@mui/x-data-grid'

const mockMerchant: MerchantDataType = {
  merchantId: 'MERCH_1755529411388_mr61qtivk',
  email: 'malik.electronics@gmail.com',
  firstName: 'Muhammad',
  lastName: 'Malik',
  businessName: 'Malik Electronics & Mobile Center',
  businessAddress: 'Shop No. 15, Main Bazaar, Saddar, Rawalpindi, Punjab, Pakistan',
  taxId: 'NTN-9876543-2',
  phoneNumber: '+92-51-5551234',
  verificationStatus: 'pending',
  isActive: true,
  walletBalance: {
    availableBalance: 0,
    pendingBalance: 0,
    totalEarnings: 0,
    lastUpdated: new Date().toISOString()
  },
  bankAccountDetails: {
    accountNumber: '0987654321098',
    accountTitle: 'Malik Electronics & Mobile Center',
    bankName: 'MCB Bank Limited',
    branchCode: '0456',
    iban: 'PK24MUCB0004560987654321098'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

const maskAccount = (value?: string) => {
  if (!value) return '-'
  const last4 = value.slice(-4)

  return `•••• •••• •••• ${last4}`
}

const Teams = ({ data }: { data: MerchantDataType }) => {
  console.log(data)
  const { user } = useAuth()
  const [showBankInfo, setShowBankInfo] = useState(false)
  const merchant = useMemo(() => (user as MerchantDataType | null) || mockMerchant, [user])
  const bankAccounts: Array<{ id: string; bankName: string; accountNumber: string; accountTitle: string; iban: string; branchCode: string }> = [
    {
      id: 'acc-1',
      bankName: merchant?.bankAccountDetails?.bankName || '',
      accountNumber: merchant?.bankAccountDetails?.accountNumber || "",
      accountTitle: merchant?.bankAccountDetails?.accountTitle || '',
      iban: merchant?.bankAccountDetails?.iban || '',
      branchCode: merchant?.bankAccountDetails?.branchCode || ''
    },
    {
      id: 'acc-2',
      bankName: 'Habib Bank Limited',
      accountNumber: '0011223344556677',
      accountTitle: merchant?.bankAccountDetails?.accountTitle || '',
      iban: 'PK36HABB0001234567890011223',
      branchCode: '0123'
    }
  ]

  const recentBankAccounts: Array<{ id: string; bankName: string; accountNumber: string; accountTitle: string; lastUsed: string; amount: number }> = [
    { id: 'r-1', bankName: bankAccounts[0].bankName, accountNumber: bankAccounts[0].accountNumber, accountTitle: bankAccounts[0].accountTitle, lastUsed: '2025-08-16', amount: 25000 },
    { id: 'r-2', bankName: bankAccounts[1].bankName, accountNumber: bankAccounts[1].accountNumber, accountTitle: bankAccounts[1].accountTitle, lastUsed: '2025-08-12', amount: 12000 },
  ]

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(value)

  const recentColumns: GridColDef[] = [
    { field: 'bankName', headerName: 'Bank', flex: 1 },
    { field: 'accountTitle', headerName: 'Account Title', flex: 1 },
    {
      field: 'accountNumber',
      headerName: 'Account',
      flex: 1,
      valueGetter: params => maskAccount(params.value as string)
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 0.7,
      align: 'right',
      headerAlign: 'right',
      renderCell: params => <Typography sx={{ fontWeight: 600 }}>{formatCurrency(params.value as number)}</Typography>
    },
    { field: 'lastUsed', headerName: 'Last Used', flex: 0.8, valueGetter: params => new Date(params.value as string).toLocaleDateString() }
  ]

  return (
    <Grid container spacing={6}>
      {bankAccounts.map(acc => (
        <Grid key={acc.id} item xs={12} sm={6} md={6} lg={4}>
          <Card
            sx={{
              overflow: 'hidden',
              position: 'relative',
              height: 260,
              background: theme => `linear-gradient(135deg, ${theme.palette.grey[900]}, ${theme.palette.primary.dark})`,
              color: theme => theme.palette.success.light,
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)',
              '&:hover': { boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), 0 6px 20px rgba(0, 0, 0, 0.3)', transform: 'translateY(-2px)', transition: 'all 0.3s ease-in-out' },
              transition: 'all 0.3s ease-in-out',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z\' fill=\'%239C92AC\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                backgroundSize: '30px 30px',
                opacity: 0.1
              }
            }}
          >
            <CardContent sx={{ position: 'relative', height: '100%', p: theme => theme.spacing(4, 5) }}>
              <Box sx={{ position: 'absolute', top: 16, right: 20 }}>
                <Typography sx={{ color: 'grey.400', fontWeight: 700, fontSize: '0.7rem', mb: 0.5 }}>
                  BANK NAME
                </Typography>
                <Typography sx={{ color: 'common.white', fontWeight: 600, fontSize: '0.95rem' }}>
                  {acc.bankName}
                </Typography>
              </Box>

              <Box sx={{ position: 'absolute', top: 80, left: 20, right: 20 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 1 }}>
                  <Typography sx={{ color: 'grey.400', fontWeight: 600, fontSize: '0.65rem' }}>
                    ACCOUNT NUMBER
                  </Typography>
                  <IconButton size='small' onClick={() => setShowBankInfo(!showBankInfo)} sx={{ color: 'grey.400', bgcolor: 'rgba(255,255,255,0.1)', width: 24, height: 24, ml: 1, '&:hover': { color: 'common.white', bgcolor: 'rgba(255,255,255,0.2)' } }}>
                    <Icon icon={showBankInfo ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} fontSize={14} />
                  </IconButton>
                  <IconButton size='small' onClick={() => navigator.clipboard.writeText(acc.accountNumber)} sx={{ color: 'grey.400', bgcolor: 'rgba(255,255,255,0.1)', width: 24, height: 24, ml: 1, '&:hover': { color: 'common.white', bgcolor: 'rgba(255,255,255,0.2)' } }}>
                    <Icon icon='mdi:content-copy' fontSize={14} />
                  </IconButton>
                </Box>
                <Typography sx={{ letterSpacing: showBankInfo ? '3px' : '4px', fontFamily: 'monospace', fontSize: '1rem', color: 'common.white', textAlign: 'left' }}>
                  {showBankInfo ? acc.accountNumber : maskAccount(acc.accountNumber)}
                </Typography>
              </Box>

              <Box sx={{ position: 'absolute', bottom: 20, right: 20, left: 20 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography sx={{ color: 'grey.400', fontSize: '0.65rem', mb: 0.5 }}>
                      ACCOUNT HOLDER
                    </Typography>
                    <Typography sx={{ color: 'common.white', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                      {acc.accountTitle}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ color: 'grey.400', fontSize: '0.65rem', mb: 0.5 }}>
                      BRANCH CODE
                    </Typography>
                    <Typography sx={{ color: 'common.white', fontSize: '0.9rem', fontWeight: 600 }}>
                      {acc.branchCode}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}

      <Grid item xs={12}>
        <Card>
          <Box sx={{ p: 5 }}>
            <Typography variant='h6' sx={{ fontSize: '1.1rem', mb: 2 }}>
              Recent Bank Accounts
            </Typography>
            <Divider sx={{ mb: 4 }} />
            <div style={{ width: '100%' }}>
              <DataGrid autoHeight rows={recentBankAccounts} columns={recentColumns} rowsPerPageOptions={[5, 10]} pageSize={5} />
            </div>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Teams
