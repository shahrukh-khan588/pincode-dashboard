// ** React Imports
import { Ref, useState, forwardRef, ReactElement, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Framer Motion
import { motion } from 'framer-motion'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { BankType } from '@/store/api/v1/endpoints/banks'

const maskAccount = (value?: string) => {
  if (!value) return '-'
  const last4 = value.slice(-4)

  return `•••• •••• •••• ${last4}`
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface DialogAddBankProps {
  open: boolean
  onClose: () => void
  onSubmit: (bankData: Omit<BankType, 'id'>) => void
  isLoading?: boolean
}

const DialogAddBank = ({ open, onClose, onSubmit, isLoading = false }: DialogAddBankProps) => {
  // ** States
  const [formData, setFormData] = useState<Omit<BankType, 'id'>>({
    accountNumber: '',
    accountTitle: '',
    bankName: '',
    branchCode: '',
    iban: ''
  })
  const [isPreviewFlipped, setIsPreviewFlipped] = useState(false)

  const handleInputChange = (field: keyof Omit<BankType, 'id'>) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))

    // Auto-flip to IBAN side when typing IBAN
    if (field === 'iban' && event.target.value.length > 0) {
      setIsPreviewFlipped(true)
    }
  }

  const handleClose = () => {
    setFormData({
      accountNumber: '',
      accountTitle: '',
      bankName: '',
      branchCode: '',
      iban: ''
    })
    setIsPreviewFlipped(false)
    onClose()
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth='lg'
      scroll='body'
      onClose={handleClose}
      onBackdropClick={handleClose}
      TransitionComponent={Transition}
    >
      <DialogContent
        sx={{
          position: 'relative',
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant='h5' sx={{ mb: 3 }}>
            Add New Bank Account
          </Typography>
          <Typography variant='body2'>Add bank account for payments and withdrawals</Typography>
        </Box>
        <Grid container spacing={6}>
          {/* Form Section */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name='bankName'
                  value={formData.bankName}
                  autoComplete='off'
                  label='Bank Name'
                  onChange={handleInputChange('bankName')}
                  placeholder='MCB Bank Limited'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name='accountTitle'
                  value={formData.accountTitle}
                  autoComplete='off'
                  label='Account Title'
                  onChange={handleInputChange('accountTitle')}
                  placeholder='Malik Electronics & Mobile Center'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name='accountNumber'
                  value={formData.accountNumber}
                  autoComplete='off'
                  label='Account Number'
                  onChange={handleInputChange('accountNumber')}
                  placeholder='0987654321098'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name='branchCode'
                  value={formData.branchCode}
                  autoComplete='off'
                  label='Branch Code'
                  onChange={handleInputChange('branchCode')}
                  placeholder='0456'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name='iban'
                  value={formData.iban}
                  autoComplete='off'
                  label='IBAN'
                  onChange={handleInputChange('iban')}
                  onFocus={() => setIsPreviewFlipped(true)}
                  onBlur={() => setIsPreviewFlipped(false)}
                  placeholder='PK24MUCB0004560987654321098'
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Preview Card Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Box
                sx={{
                  perspective: '1000px',
                  height: 260,
                  width: '100%',
                  maxWidth: 400,
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
                    rotateY: isPreviewFlipped ? 180 : 0,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: 'easeInOut',
                  }}
                >
                  {/* Front Preview Card */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                    }}
                    initial={false}
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
                            {formData.bankName || 'Bank Name'}
                          </Typography>
                        </Box>

                        <Box sx={{ position: 'absolute', top: 16, left: 20 }}>
                          <IconButton
                            size='small'
                            onClick={() => setIsPreviewFlipped(!isPreviewFlipped)}
                            sx={{
                              color: 'grey.400',
                              bgcolor: 'rgba(255,255,255,0.1)',
                              width: 28,
                              height: 28,
                              '&:hover': {
                                color: 'common.white',
                                bgcolor: 'rgba(255,255,255,0.2)',
                                transform: 'scale(1.1)'
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}
                          >
                            <Icon icon='mdi:flip-horizontal' fontSize={16} />
                          </IconButton>
                        </Box>

                        <Box sx={{ position: 'absolute', top: 80, left: 20, right: 20 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 1 }}>
                            <Typography sx={{ color: 'grey.400', fontWeight: 600, fontSize: '0.65rem' }}>
                              ACCOUNT NUMBER
                            </Typography>
                          </Box>
                          <Typography sx={{ letterSpacing: '4px', fontFamily: 'monospace', fontSize: '1rem', color: 'common.white', textAlign: 'left' }}>
                            {formData.accountNumber ? maskAccount(formData.accountNumber) : '•••• •••• •••• ••••'}
                          </Typography>
                        </Box>

                        <Box sx={{ position: 'absolute', bottom: 20, right: 20, left: 20 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ textAlign: 'left' }}>
                              <Typography sx={{ color: 'grey.400', fontSize: '0.65rem', mb: 0.5 }}>
                                ACCOUNT HOLDER
                              </Typography>
                              <Typography sx={{ color: 'common.white', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                                {formData.accountTitle || 'Account Holder'}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography sx={{ color: 'grey.400', fontSize: '0.65rem', mb: 0.5 }}>
                                BRANCH CODE
                              </Typography>
                              <Typography sx={{ color: 'common.white', fontSize: '0.9rem', fontWeight: 600 }}>
                                {formData.branchCode || '----'}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* IBAN Preview Card */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      rotateY: 180,
                    }}
                    initial={false}
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
                          <IconButton
                            size='small'
                            onClick={() => setIsPreviewFlipped(!isPreviewFlipped)}
                            sx={{
                              color: 'grey.400',
                              bgcolor: 'rgba(255,255,255,0.1)',
                              width: 28,
                              height: 28,
                              '&:hover': {
                                color: 'common.white',
                                bgcolor: 'rgba(255,255,255,0.2)',
                                transform: 'scale(1.1)'
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}
                          >
                            <Icon icon='mdi:flip-horizontal' fontSize={16} />
                          </IconButton>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Typography sx={{ color: 'grey.400', fontWeight: 700, fontSize: '0.7rem', mb: 1 }}>
                            IBAN
                          </Typography>
                          <Typography sx={{ color: 'common.white', fontWeight: 600, fontSize: '1.1rem', fontFamily: 'monospace', letterSpacing: '2px' }}>
                            {formData.iban || 'IBAN Number'}
                          </Typography>
                        </Box>

                        <Typography sx={{ color: 'grey.400', fontSize: '0.65rem', textAlign: 'center' }}>
                          Live Preview
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Button variant='contained' sx={{ mr: 1 }} onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Bank Account'}
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogAddBank
