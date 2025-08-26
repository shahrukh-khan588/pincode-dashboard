// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Import
import Link from 'next/link'

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
import themeConfig from 'src/configs/themeConfig'

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





// ** Complete validation schema
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

// ** Form Data Interface
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

const Register = () => {
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

      setSuccessMessage('You are registered successfully')
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
              <svg
                width={35}
                height={29}
                version='1.1'
                viewBox='0 0 30 23'
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'
              >
                <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                  <g id='Artboard' transform='translate(-95.000000, -51.000000)'>
                    <g id='logo' transform='translate(95.000000, 50.000000)'>
                      <path
                        id='Combined-Shape'
                        fill={theme.palette.primary.main}
                        d='M30,21.3918362 C30,21.7535219 29.9019196,22.1084381 29.7162004,22.4188007 C29.1490236,23.366632 27.9208668,23.6752135 26.9730355,23.1080366 L26.9730355,23.1080366 L23.714971,21.1584295 C23.1114106,20.7972624 22.7419355,20.1455972 22.7419355,19.4422291 L22.7419355,19.4422291 L22.741,12.7425689 L15,17.1774194 L7.258,12.7425689 L7.25806452,19.4422291 C7.25806452,20.1455972 6.88858935,20.7972624 6.28502902,21.1584295 L3.0269645,23.1080366 C2.07913318,23.6752135 0.850976404,23.366632 0.283799571,22.4188007 C0.0980803893,22.1084381 2.0190442e-15,21.7535219 0,21.3918362 L0,3.58469444 L0.00548573643,3.43543209 L0.00548573643,3.43543209 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 L15,9.19354839 L26.9548759,1.86636639 C27.2693965,1.67359571 27.6311047,1.5715689 28,1.5715689 C29.1045695,1.5715689 30,2.4669994 30,3.5715689 L30,3.5715689 Z'
                      />
                      <polygon
                        id='Rectangle'
                        opacity='0.077704'
                        fill={theme.palette.common.black}
                        points='0 8.58870968 7.25806452 12.7505183 7.25806452 16.8305646'
                      />
                      <polygon
                        id='Rectangle'
                        opacity='0.077704'
                        fill={theme.palette.common.black}
                        points='0 8.58870968 7.25806452 12.6445567 7.25806452 15.1370162'
                      />
                      <polygon
                        id='Rectangle'
                        opacity='0.077704'
                        fill={theme.palette.common.black}
                        points='22.7419355 8.58870968 30 12.7417372 30 16.9537453'
                        transform='translate(26.370968, 12.771227) scale(-1, 1) translate(-26.370968, -12.771227) '
                      />
                      <polygon
                        id='Rectangle'
                        opacity='0.077704'
                        fill={theme.palette.common.black}
                        points='22.7419355 8.58870968 30 12.6409734 30 15.2601969'
                        transform='translate(26.370968, 11.924453) scale(-1, 1) translate(-26.370968, -11.924453) '
                      />
                      <path
                        id='Rectangle'
                        fillOpacity='0.15'
                        fill={theme.palette.common.white}
                        d='M3.04512412,1.86636639 L15,9.19354839 L15,9.19354839 L15,17.1774194 L0,8.58649679 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 Z'
                      />
                      <path
                        id='Rectangle'
                        fillOpacity='0.35'
                        fill={theme.palette.common.white}
                        transform='translate(22.500000, 8.588710) scale(-1, 1) translate(-22.500000, -8.588710) '
                        d='M18.0451241,1.86636639 L30,9.19354839 L30,9.19354839 L30,17.1774194 L15,8.58649679 L15,3.5715689 C15,2.4669994 15.8954305,1.5715689 17,1.5715689 C17.3688953,1.5715689 17.7306035,1.67359571 18.0451241,1.86636639 Z'
                      />
                    </g>
                  </g>
                </g>
              </svg>
              <Typography
                variant='h6'
                sx={{
                  ml: 3,
                  lineHeight: 1,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '1.5rem !important'
                }}
              >
                {themeConfig.templateName}
              </Typography>
            </Box>

            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant='h5'>Adventure starts here 🚀</TypographyStyled>
              <Typography variant='body2'>Make your app management easy and fun!</Typography>
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
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              {/* Sign In Link */}
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography variant='body2' sx={{ mr: 2 }}>
                  Already have an account?
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

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Register.guestGuard = true

export default Register
