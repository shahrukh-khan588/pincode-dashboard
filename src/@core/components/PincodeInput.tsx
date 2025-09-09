// ** React Imports
import { ChangeEvent, useState, KeyboardEvent } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import Cleave from 'cleave.js/react'
import { useForm, Controller } from 'react-hook-form'

// ** Custom Styled Component
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Styles
import 'cleave.js/dist/addons/cleave-phone.us'

// ** Styled Components
const CleaveInput = styled(Cleave)(({ theme }) => ({
  maxWidth: 50,
  textAlign: 'center',
  height: '50px !important',
  fontSize: '150% !important',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&:not(:last-child)': {
    marginRight: theme.spacing(2)
  },
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    margin: 0,
    WebkitAppearance: 'none'
  }
}))

const defaultValues: { [key: string]: string } = {
  val1: '',
  val2: '',
  val3: '',
  val4: ''
}

interface PincodeInputProps {
  title?: string
  subtitle?: string
  onComplete?: (pincode: string) => void
  onError?: (error: string) => void
  error?: string
  disabled?: boolean
  autoFocus?: boolean
}

const PincodeInput = ({
  title = "Enter 4-digit PIN",
  subtitle = "Enter your secure PIN to continue",
  onComplete,
  onError,
  error,
  disabled = false,
  autoFocus = true
}: PincodeInputProps) => {
  // ** State
  const [isBackspace, setIsBackspace] = useState<boolean>(false)

  // ** Hooks
  const theme = useTheme()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  // ** Vars
  const errorsArray = Object.keys(errors)

  const handleChange = (event: ChangeEvent, onChange: (...event: any[]) => void) => {
    if (!isBackspace && !disabled) {
      onChange(event)

      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (form[index].value && form[index].value.length) {
        if (index < 3) {
          form.elements[index + 1].focus()
        } else {
          // All fields filled, check if complete
          const values = Object.values(form).map((input: any) => input.value).join('')
          if (values.length === 4) {
            onComplete?.(values)
          }
        }
      }
      event.preventDefault()
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Backspace' && !disabled) {
      setIsBackspace(true)

      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (index >= 1) {
        if (!(form[index].value && form[index].value.length)) {
          form.elements[index - 1].focus()
        }
      }
    } else {
      setIsBackspace(false)
    }
  }

  const renderInputs = () => {
    return Object.keys(defaultValues).map((val, index) => (
      <Controller
        key={val}
        name={val}
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <Box
            type='tel'
            maxLength={1}
            value={value}
            autoFocus={autoFocus && index === 0}
            component={CleaveInput}
            onKeyDown={handleKeyDown}
            onChange={(event: ChangeEvent) => handleChange(event, onChange)}
            options={{ blocks: [1], numeral: true, numeralPositiveOnly: true }}
            disabled={disabled}
            sx={{
              [theme.breakpoints.down('sm')]: { px: `${theme.spacing(2)} !important` },
              opacity: disabled ? 0.6 : 1
            }}
          />
        )}
      />
    ))
  }

  const handleFormSubmit = (data: any) => {
    const pincode = Object.values(data).join('')
    if (pincode.length === 4) {
      onComplete?.(pincode)
    } else {
      onError?.('Please enter a complete 4-digit PIN')
    }
  }


  return (
    <Box>
      {title && (
        <Typography variant='h6' sx={{ mb: 1, textAlign: 'center' }}>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant='body2' sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
          {subtitle}
        </Typography>
      )}
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CleaveWrapper
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...(errorsArray.length && {
              '& .invalid:focus': {
                borderColor: theme => `${theme.palette.error.main} !important`,
                boxShadow: theme => `0 1px 3px 0 ${hexToRGBA(theme.palette.error.main, 0.4)}`
              }
            })
          }}
        >
          {renderInputs()}
        </CleaveWrapper>
        {(errorsArray.length || error) && (
          <FormHelperText sx={{ color: 'error.main', textAlign: 'center', mt: 1 }}>
            {error || 'Please enter a valid 4-digit PIN'}
          </FormHelperText>
        )}
      </form>
    </Box>
  )
}

export default PincodeInput
