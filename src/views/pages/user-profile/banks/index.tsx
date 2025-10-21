// ** React
import { useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// ** Framer Motion
import { motion } from 'framer-motion'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import type { MerchantDataType } from 'src/context/types'

// ** Hooks
import { BankType, useGetAllBanksQuery, useCreateBankAccountMutation, useDeleteBankAccountMutation } from '@/store/api/v1/endpoints/banks'

// ** Components
import DialogAddBank from './DialogAddBank'




const maskAccount = (value?: string) => {
  if (!value) return '-'
  const last4 = value.slice(-4)

  return `•••• •••• •••• ${last4}`
}

const Teams = ({ data }: { data: MerchantDataType }) => {
  console.log(data)
  const [showBankInfo, setShowBankInfo] = useState(false)
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())
  const [showAddBankDialog, setShowAddBankDialog] = useState(false)
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{ open: boolean; bankId: string | null; bankName: string }>({
    open: false,
    bankId: null,
    bankName: ''
  })
  const { data: banksResponse, isLoading, isError, error } = useGetAllBanksQuery({ page: 1, limit: 10 })
  const [createBankAccount, { isLoading: isCreatingBank }] = useCreateBankAccountMutation()
  const [deleteBankAccount, { isLoading: isDeletingBank }] = useDeleteBankAccountMutation()

  const toggleCardFlip = (index: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }

      return newSet
    })
  }

  const handleCreateBankAccount = async (bankData: Omit<BankType, 'id'>) => {
    try {
      await createBankAccount(bankData).unwrap()
      setShowAddBankDialog(false)
    } catch (error) {
      console.error('Failed to create bank account:', error)
    }
  }

  const handleDeleteBank = (bankId: string, bankName: string) => {
    setDeleteConfirmDialog({
      open: true,
      bankId,
      bankName
    })
  }

  const confirmDeleteBank = async () => {
    if (deleteConfirmDialog.bankId) {
      try {
        await deleteBankAccount(deleteConfirmDialog.bankId).unwrap()
        setDeleteConfirmDialog({ open: false, bankId: null, bankName: '' })
      } catch (error) {
        console.error('Failed to delete bank account:', error)
      }
    }
  }

  const cancelDeleteBank = () => {
    setDeleteConfirmDialog({ open: false, bankId: null, bankName: '' })
  }

  // Show loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    )
  }

  // Show error state
  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load bank accounts. Please try again later.
        </Alert>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Error: {JSON.stringify(error)}
          </Typography>
        )}
      </Box>
    )
  }

  // Show empty state if no banks
  if (!banksResponse || banksResponse.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          No bank accounts found. Please add a bank account to get started.
        </Alert>
      </Box>
    )
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant='h5' sx={{ fontWeight: 600 }}>
              Bank Accounts
            </Typography>
            <Button
              variant='contained'
              startIcon={<Icon icon='mdi:plus' />}
              onClick={() => setShowAddBankDialog(true)}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                px: 3,
                py: 1.5
              }}
            >
              Add Bank Account
            </Button>
          </Box>
        </Grid>
        {banksResponse?.map((bank: BankType, index: number) => (
          <Grid key={index * 10 - 50} item xs={12} sm={6} md={6} lg={4}>
            <Box
              sx={{
                perspective: '1000px',
                height: 260,
              }}
            >
              <motion.div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  rotateY: flippedCards.has(index) ? 180 : 0,
                }}
                transition={{
                  duration: 0.6,
                  ease: 'easeInOut',
                }}
              >
                {/* Front of the card */}
                <motion.div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                  }}
                  initial={false}
                  animate={{
                    rotateY: 0,
                  }}
                >
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
                          {bank.bankName || '-'}
                        </Typography>
                      </Box>

                      <Box sx={{ position: 'absolute', top: 16, left: 20 }}>
                        <IconButton
                          size='small'
                          onClick={() => handleDeleteBank(bank.id, bank.bankName)}
                          sx={{
                            color: 'error.light',
                            bgcolor: 'rgba(255,255,255,0.1)',
                            width: 28,
                            height: 28,
                            '&:hover': {
                              color: 'error.main',
                              bgcolor: 'rgba(255,255,255,0.2)',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease-in-out'
                          }}
                        >
                          <Icon icon='mdi:delete-outline' fontSize={16} />
                        </IconButton>
                      </Box>

                      <Box sx={{ position: 'absolute', top: 80, left: 20, right: 20 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 1 }}>
                          <Typography sx={{ color: 'grey.400', fontWeight: 600, fontSize: '0.65rem' }}>
                            ACCOUNT NUMBER
                          </Typography>
                          <IconButton size='small' onClick={() => setShowBankInfo(!showBankInfo)} sx={{ color: 'grey.400', bgcolor: 'rgba(255,255,255,0.1)', width: 24, height: 24, ml: 1, '&:hover': { color: 'common.white', bgcolor: 'rgba(255,255,255,0.2)' } }}>
                            <Icon icon={showBankInfo ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} fontSize={14} />
                          </IconButton>
                          <IconButton size='small' onClick={() => navigator.clipboard.writeText(bank.accountNumber)} sx={{ color: 'grey.400', bgcolor: 'rgba(255,255,255,0.1)', width: 24, height: 24, ml: 1, '&:hover': { color: 'common.white', bgcolor: 'rgba(255,255,255,0.2)' } }}>
                            <Icon icon='mdi:content-copy' fontSize={14} />
                          </IconButton>
                          <IconButton size='small' onClick={() => toggleCardFlip(index)} sx={{ color: 'grey.400', bgcolor: 'rgba(255,255,255,0.1)', width: 24, height: 24, ml: 1, '&:hover': { color: 'common.white', bgcolor: 'rgba(255,255,255,0.2)' } }}>
                            <Icon icon='mdi:flip-horizontal' fontSize={14} />
                          </IconButton>
                        </Box>
                        <Typography sx={{ letterSpacing: showBankInfo ? '3px' : '4px', fontFamily: 'monospace', fontSize: '1rem', color: 'common.white', textAlign: 'left' }}>
                          {showBankInfo ? bank.accountNumber || '-' : maskAccount(bank.accountNumber || '-')}
                        </Typography>
                      </Box>

                      <Box sx={{ position: 'absolute', bottom: 20, right: 20, left: 20 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ textAlign: 'left' }}>
                            <Typography sx={{ color: 'grey.400', fontSize: '0.65rem', mb: 0.5 }}>
                              ACCOUNT HOLDER
                            </Typography>
                            <Typography sx={{ color: 'common.white', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                              {bank.accountTitle || '-'}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography sx={{ color: 'grey.400', fontSize: '0.65rem', mb: 0.5 }}>
                              BRANCH CODE
                            </Typography>
                            <Typography sx={{ color: 'common.white', fontSize: '0.9rem', fontWeight: 600 }}>
                              {bank.branchCode || '-'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Back of the card - IBAN */}
                <motion.div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    rotateY: 180,
                  }}
                  initial={false}
                  animate={{
                    rotateY: 180,
                  }}
                >
                  <Card
                    sx={{
                      overflow: 'hidden',
                      position: 'relative',
                      height: 260,
                      background: theme => `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
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
                    <CardContent
                      sx={{
                        position: 'relative',
                        height: '100%',
                        p: theme => theme.spacing(4, 5),
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center'
                      }}
                    >
                      <Box sx={{ position: 'absolute', top: 16, right: 20 }}>
                        <IconButton size='small' onClick={() => toggleCardFlip(index)} sx={{ color: 'grey.400', bgcolor: 'rgba(255,255,255,0.1)', width: 24, height: 24, '&:hover': { color: 'common.white', bgcolor: 'rgba(255,255,255,0.2)' } }}>
                          <Icon icon='mdi:flip-horizontal' fontSize={14} />
                        </IconButton>
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Typography sx={{ color: 'grey.400', fontWeight: 700, fontSize: '0.7rem', mb: 1 }}>
                          IBAN
                        </Typography>
                        <Typography sx={{ color: 'common.white', fontWeight: 600, fontSize: '1.1rem', fontFamily: 'monospace', letterSpacing: '2px' }}>
                          {bank.iban || 'Not Available'}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <IconButton
                          size='small'
                          onClick={() => navigator.clipboard.writeText(bank.iban || '')}
                          sx={{ color: 'grey.400', bgcolor: 'rgba(255,255,255,0.1)', width: 32, height: 32, '&:hover': { color: 'common.white', bgcolor: 'rgba(255,255,255,0.2)' } }}
                        >
                          <Icon icon='mdi:content-copy' fontSize={16} />
                        </IconButton>
                      </Box>

                      <Typography sx={{ color: 'grey.400', fontSize: '0.65rem', textAlign: 'center' }}>
                        Click to copy IBAN
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </Box>
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
                {/* <DataGrid autoHeight rows={banks?.items} columns={recentColumns} rowsPerPageOptions={[5, 10]} pageSize={5} /> */}
              </div>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <DialogAddBank
        open={showAddBankDialog}
        onClose={() => setShowAddBankDialog(false)}
        onSubmit={handleCreateBankAccount}
        isLoading={isCreatingBank}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmDialog.open}
        onClose={cancelDeleteBank}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <Box sx={{ p: 4, minWidth: 400 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Icon icon='mdi:alert-circle-outline' fontSize={24} color='error.main' />
            <Typography variant='h6' sx={{ ml: 2, fontWeight: 600 }}>
              Delete Bank Account
            </Typography>
          </Box>

          <Typography variant='body1' sx={{ mb: 3 }}>
            Are you sure you want to delete the bank account for <strong>{deleteConfirmDialog.bankName}</strong>?
            This action cannot be undone.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant='outlined'
              onClick={cancelDeleteBank}
              disabled={isDeletingBank}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              color='error'
              onClick={confirmDeleteBank}
              disabled={isDeletingBank}
              startIcon={isDeletingBank ? <CircularProgress size={16} /> : <Icon icon='mdi:delete' />}
            >
              {isDeletingBank ? 'Deleting...' : 'Delete'}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  )
}

export default Teams
