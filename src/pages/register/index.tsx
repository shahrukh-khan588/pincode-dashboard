// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Import
import Link from 'next/link'
import Image from 'next/image'

// ** MUI Components
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import InputAdornment from '@mui/material/InputAdornment'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography, { TypographyProps } from '@mui/material/Typography'
import FormHelperText from '@mui/material/FormHelperText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRegisterMutation } from 'src/store/api/v1/endpoints/register'
import { useRouter } from 'next/router'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

// ** Styled Components
const RegisterIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const RegisterIllustration = styled('img')(({ theme }) => ({
  maxWidth: '48rem',
  [theme.breakpoints.down('lg')]: {
    maxWidth: '35rem'
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 600
  }
}))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('xl')]: {
    width: '100%'
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: 500
  }
}))

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

// ** Merchant validation schema
const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  businessName: yup.string().required('Business name is required'),
  businessAddress: yup.string().required('Business address is required'),
  taxId: yup.string().required('Tax ID is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  bankAccountDetails: yup.object({
    accountNumber: yup.string().required('Account number is required'),
    accountTitle: yup.string().required('Account title is required'),
    bankName: yup.string().required('Bank name is required'),
    branchCode: yup.string().required('Branch code is required'),
    iban: yup.string().required('IBAN is required')
  }),
  agreeToTerms: yup.boolean().oneOf([true], 'You must agree to the terms and conditions')
})

// ** Merchant Form Data Interface
interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  businessName: string
  businessAddress: string
  taxId: string
  phoneNumber: string
  bankAccountDetails: {
    accountNumber: string
    accountTitle: string
    bankName: string
    branchCode: string
    iban: string
  }
  agreeToTerms: boolean
}

const defaultValues: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  businessName: '',
  businessAddress: '',
  taxId: '',
  phoneNumber: '',
  bankAccountDetails: {
    accountNumber: '',
    accountTitle: '',
    bankName: '',
    branchCode: '',
    iban: ''
  },
  agreeToTerms: false
}

const MerchantRegister = () => {
  // ** States
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [registerMutation, { isLoading }] = useRegisterMutation()
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()

  // ** Vars
  const { skin } = settings

  // ** Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ** Handle Form Submit
  const onSubmit = async (data: FormData) => {
    setErrorMessage('')
    setSuccessMessage('')

    try {
      await registerMutation({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        businessName: data.businessName,
        businessAddress: data.businessAddress,
        taxId: data.taxId,
        phoneNumber: data.phoneNumber,
        bankAccountDetails: {
          accountNumber: data.bankAccountDetails.accountNumber,
          accountTitle: data.bankAccountDetails.accountTitle,
          bankName: data.bankAccountDetails.bankName,
          branchCode: data.bankAccountDetails.branchCode,
          iban: data.bankAccountDetails.iban
        }
      }).unwrap()

      setSuccessMessage('Merchant account created successfully')
      router.push('/login')
      reset()
    } catch (error: any) {
      const message = error?.data?.message || error?.message || 'Registration failed. Please try again.'
      setErrorMessage(message)
    }
  }

  // ** Form Content
  const renderFormContent = () => (
    <Box sx={{ width: '100%', maxHeight: '60vh', overflowY: 'auto', bgcolor: 'transparent' }} p={4}>
      {/* Personal Information */}
      <FormControl fullWidth sx={{ mb: 4 }}>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Controller
              name='firstName'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='First Name'
                  placeholder='John'
                  error={Boolean(errors.firstName)}
                />
              )}
            />
            {errors.firstName && <FormHelperText sx={{ color: 'error.main' }}>{errors.firstName.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name='lastName'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Last Name'
                  placeholder='Doe'
                  error={Boolean(errors.lastName)}
                />
              )}
            />
            {errors.lastName && <FormHelperText sx={{ color: 'error.main' }}>{errors.lastName.message}</FormHelperText>}
          </Grid>
        </Grid>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label='Email Address'
              placeholder='john@business.com'
              error={Boolean(errors.email)}
            />
          )}
        />
        {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel htmlFor='auth-register-password' error={Boolean(errors.password)}>
          Password
        </InputLabel>
        <Controller
          name='password'
          control={control}
          render={({ field }) => (
            <OutlinedInput
              {...field}
              label='Password'
              id='auth-register-password'
              type={showPassword ? 'text' : 'password'}
              error={Boolean(errors.password)}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                  </IconButton>
                </InputAdornment>
              }
            />
          )}
        />
        {errors.password && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {errors.password.message}
          </FormHelperText>
        )}
      </FormControl>

      {/* Business Information */}
      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='businessName'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label='Business Name'
              placeholder='Your Business LLC'
              error={Boolean(errors.businessName)}
            />
          )}
        />
        {errors.businessName && <FormHelperText sx={{ color: 'error.main' }}>{errors.businessName.message}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='businessAddress'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={3}
              label='Business Address'
              placeholder='123 Business St, City, State, ZIP'
              error={Boolean(errors.businessAddress)}
            />
          )}
        />
        {errors.businessAddress && <FormHelperText sx={{ color: 'error.main' }}>{errors.businessAddress.message}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='phoneNumber'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type='tel'
              fullWidth
              label='Phone Number'
              placeholder='3XX XXXXXXX'
              InputProps={{
                startAdornment: <InputAdornment position='start'>+92</InputAdornment>
              }}
              error={Boolean(errors.phoneNumber)}
            />
          )}
        />
        {errors.phoneNumber && <FormHelperText sx={{ color: 'error.main' }}>{errors.phoneNumber.message}</FormHelperText>}
      </FormControl>

      {/* Financial Information */}
      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='taxId'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type='text'
              inputProps={{ maxLength: 11 }}
              fullWidth
              label='Tax ID / EIN'
              placeholder='XX-XXXXXXX'
              error={Boolean(errors.taxId)}
            />
          )}
        />
        {errors.taxId && <FormHelperText sx={{ color: 'error.main' }}>{errors.taxId.message}</FormHelperText>}
      </FormControl>

      {/* Bank Account Details */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Controller
            name='bankAccountDetails.accountNumber'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Account Number'
                placeholder='0987654321098'
                error={Boolean((errors.bankAccountDetails as any)?.accountNumber)}
              />
            )}
          />
          {(errors.bankAccountDetails as any)?.accountNumber && (
            <FormHelperText sx={{ color: 'error.main' }}>{(errors.bankAccountDetails as any).accountNumber.message}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='bankAccountDetails.accountTitle'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Account Title'
                placeholder='Malik Electronics & Mobile Center'
                error={Boolean((errors.bankAccountDetails as any)?.accountTitle)}
              />
            )}
          />
          {(errors.bankAccountDetails as any)?.accountTitle && (
            <FormHelperText sx={{ color: 'error.main' }}>{(errors.bankAccountDetails as any).accountTitle.message}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='bankAccountDetails.bankName'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Bank Name'
                placeholder='MCB Bank Limited'
                error={Boolean((errors.bankAccountDetails as any)?.bankName)}
              />
            )}
          />
          {(errors.bankAccountDetails as any)?.bankName && (
            <FormHelperText sx={{ color: 'error.main' }}>{(errors.bankAccountDetails as any).bankName.message}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='bankAccountDetails.branchCode'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Branch Code'
                placeholder='0456'
                error={Boolean((errors.bankAccountDetails as any)?.branchCode)}
              />
            )}
          />
          {(errors.bankAccountDetails as any)?.branchCode && (
            <FormHelperText sx={{ color: 'error.main' }}>{(errors.bankAccountDetails as any).branchCode.message}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='bankAccountDetails.iban'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='IBAN'
                placeholder='PK24MUCB0004560987654321098'
                error={Boolean((errors.bankAccountDetails as any)?.iban)}
              />
            )}
          />
          {(errors.bankAccountDetails as any)?.iban && (
            <FormHelperText sx={{ color: 'error.main' }}>{(errors.bankAccountDetails as any).iban.message}</FormHelperText>
          )}
        </Grid>
      </Grid>

      {/* Terms Agreement */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Controller
          name='agreeToTerms'
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label={
                <Typography variant='body2'>
                  I agree to the{' '}
                  <LinkStyled href='#'>Terms of Service</LinkStyled>
                  {' '}and{' '}
                  <LinkStyled href='#'>Privacy Policy</LinkStyled>
                </Typography>
              }
            />
          )}
        />
        {errors.agreeToTerms && (
          <FormHelperText sx={{ color: 'error.main', width: '100%' }}>
            {errors.agreeToTerms.message}
          </FormHelperText>
        )}
      </Box>
    </Box>
  )

  const imageSource = skin === 'bordered' ? 'auth-v2-register-illustration-bordered' : 'auth-v2-register-illustration'

  return (
    <Box className='content-right'>
      {!hidden ? (
        <Box sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <RegisterIllustrationWrapper>
            <RegisterIllustration
              alt='register-illustration'
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </RegisterIllustrationWrapper>
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
        <Box
          sx={{
            p: 12,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent'
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                top: 30,
                left: 40,
                display: 'flex',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image src="/Pincode-logo.svg" alt="logo" width={200} height={200} />
            </Box>

            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant='h5'>Merchant Registration 🚀</TypographyStyled>
              <Typography variant='body2'>Join our platform and start accepting payments!</Typography>
            </Box>

            {/* Alerts */}
            {successMessage && (
              <Alert severity="success" sx={{ mb: 4 }}>
                {successMessage}
              </Alert>
            )}
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 4 }}>
                {errorMessage}
              </Alert>
            )}

            {/* Form Content */}
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              {renderFormContent()}

              {/* Submit Button */}
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7, mt: 4 }} disabled={isLoading}>
                {isLoading ? 'Creating Merchant Account...' : 'Create Merchant Account'}
              </Button>

              {/* Sign In Link */}
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography variant='body2' sx={{ mr: 2 }}>
                  Already have a merchant account?
                </Typography>
                <Typography variant='body2'>
                  <LinkStyled href='/login'>Sign in instead</LinkStyled>
                </Typography>
              </Box>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}

MerchantRegister.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

MerchantRegister.guestGuard = true

export default MerchantRegister
