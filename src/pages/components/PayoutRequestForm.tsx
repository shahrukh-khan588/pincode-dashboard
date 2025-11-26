import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Alert,
  Typography,
  Stack,
  Avatar,
  Slider,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Icon from 'src/@core/components/icon';
import usePayout from 'src/hooks/usePayout';
import { MerchantDataType } from 'src/context/types';
import { BankType } from 'src/store/api/v1/endpoints/banks';

interface PayoutRequestFormProps {
  merchant: MerchantDataType;
  bankAccounts?: BankType[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '& .MuiCardHeader-root': {
    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(139, 195, 74, 0.1) 100%)',
    backdropFilter: 'blur(10px)',
    border: `1px solid rgba(76, 175, 80, 0.2)`,
    color: theme.palette.text.primary,
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      borderRadius: 'inherit',
      zIndex: -1,
    },
    '& .MuiCardHeader-title': {
      fontWeight: 700,
      fontSize: '1.25rem',
      color: theme.palette.text.primary,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    },
    '& .MuiCardHeader-subheader': {
      color: theme.palette.text.secondary,
      fontWeight: 500,
    },
  },
}));


const PayoutRequestForm: React.FC<PayoutRequestFormProps> = ({
  merchant,
  bankAccounts: propBankAccounts,
  onSuccess,
  onCancel,
}) => {
  const [amount, setAmount] = useState(500);
  const [selectedBank, setSelectedBank] = useState('');
  const [description, setDescription] = useState('');

  // Use prop bank accounts or fallback to mock data
  const bankAccounts = propBankAccounts && propBankAccounts.length > 0
    ? propBankAccounts.map(bank => ({
      id: bank.id,
      name: bank.bankName,
      accountNumber: bank.accountNumber,
      accountTitle: bank.accountTitle,
      iban: bank.iban,
      color: 'success.main'
    }))
    : [
      {
        id: 'mcb',
        name: merchant?.bankAccountDetails?.bankName || '',
        accountNumber: merchant?.bankAccountDetails?.accountNumber,
        accountTitle: merchant?.bankAccountDetails?.accountTitle || '',
        iban: merchant?.bankAccountDetails?.iban || '',
        color: 'success.main'
      },
    ];

  const { requestPayout, isSubmitting, validationErrors, clearValidationErrors } = usePayout({
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Payout request error:', error);
    },
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(value);

  const maskAccount = (value?: string) => {
    if (!value) return '-';
    const last4 = value.slice(-4);

    return `•••• •••• •••• ${last4}`;
  };


  const handleSubmit = async () => {
    clearValidationErrors();

    const result = await requestPayout({
      amount: amount,
      bankAccountId: selectedBank,
      description: description || undefined,
    });

    if (!result.success) {
      console.error('Payout request failed:', result.error);
    }
  };

  const isValidAmount = Number(amount) >= 100 && Number(amount) <= 100000;
  const hasSufficientBalance = Number(amount) <= (merchant?.walletBalance?.availableBalance || 0);

  return (
    <>
      <StyledCard>
        <CardHeader
          title="Request Payout"
          subheader="Transfer funds to your bank account"
        />
        <CardContent>
          <Stack spacing={3}>
            {/* Bank Account Dropdown */}
            <Box mt={4}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontWeight: 600 }}>
                Select Bank Account
              </Typography>
              <FormControl fullWidth error={!!validationErrors.bankAccountId}>
                <Select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  displayEmpty
                  sx={{ minHeight: 50 }}
                >
                  <MenuItem value="">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.main', width: 28, height: 28 }}>
                        <Icon icon='mdi:bank' fontSize={18} />
                      </Avatar>
                      <Typography>Select your bank account</Typography>
                    </Stack>
                  </MenuItem>
                  {bankAccounts.map((bank) => (
                    <MenuItem key={bank.id} value={bank.id}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: bank.color, width: 28, height: 28 }}>
                          <Icon icon='mdi:bank' fontSize={18} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {bank.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {maskAccount(bank.accountNumber)}
                          </Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {validationErrors.bankAccountId && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {validationErrors.bankAccountId}
                </Typography>
              )}
            </Box>

            {/* Amount Slider */}
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontWeight: 600, textTransform: 'uppercase' }}>
                Insert Amount
              </Typography>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h3" sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '1.5rem', lineHeight: 1.2, letterSpacing: '0.02em' }}>
                  {amount.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {formatCurrency(amount)}
                </Typography>
              </Box>
              <Slider
                value={amount}
                onChange={(_, value) => setAmount(value as number)}
                min={100}
                max={100000}
                step={100}
                marks={[
                  { value: 100, label: '100' },
                  { value: 1000, label: '1K' },
                  { value: 10000, label: '10K' },
                  { value: 25000, label: '25K' },
                  { value: 50000, label: '50K' },
                  { value: 75000, label: '75K' },
                  { value: 100000, label: '100K' }
                ]}
                sx={{
                  '& .MuiSlider-thumb': {
                    backgroundColor: 'primary.main',
                    '&:hover': { backgroundColor: 'primary.dark' },
                    width: 24,
                    height: 24,
                  },
                  '& .MuiSlider-track': { backgroundColor: 'primary.main', height: 6 },
                  '& .MuiSlider-rail': { backgroundColor: 'grey.300', height: 6 },
                  '& .MuiSlider-mark': { backgroundColor: 'grey.400' },
                  '& .MuiSlider-markLabel': { fontSize: '0.75rem', color: 'text.secondary' }
                }}
              />
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Min: RS 100
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Max: RS 100,000
                </Typography>
              </Stack>
              {validationErrors.amount && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {validationErrors.amount}
                </Alert>
              )}
            </Box>

            {/* Description (Optional) */}
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontWeight: 600 }}>
                Description (Optional)
              </Typography>
              <TextField
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a note for this payout"
                multiline
                rows={2}
              />
            </Box>

            {/* Payout Summary */}
            {amount && isValidAmount && (
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontWeight: 600 }}>
                  Payout Summary
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Amount:</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(amount)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Remaining Balance:</Typography>
                    <Typography variant="body2" fontWeight={600} color="info.main">
                      {formatCurrency((merchant?.walletBalance?.availableBalance || 0) - amount)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )}

            {/* Validation Alerts */}
            {!hasSufficientBalance && amount > 0 && (
              <Alert severity="error" icon={<Icon icon='mdi:alert-circle' />}>
                Insufficient balance. Available: {formatCurrency(merchant?.walletBalance?.availableBalance || 0)}
              </Alert>
            )}

            {!isValidAmount && amount > 0 && (
              <Alert severity="warning" icon={<Icon icon='mdi:information' />}>
                Amount must be between RS 100 and RS 100,000
              </Alert>
            )}

            {/* Transfer Time Estimate */}
            {amount > 0 && isValidAmount && (
              <Alert severity="info" icon={<Icon icon='mdi:clock-outline' />}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Transfer Time Estimate
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    {amount <= 50000 ? 'Instant transfer (within 30 seconds)' : 'Standard transfer (2-4 business hours)'}
                  </Typography>
                </Box>
              </Alert>
            )}

            {/* Action Buttons */}
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={isSubmitting}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!selectedBank || !isValidAmount || !hasSufficientBalance || isSubmitting}
                startIcon={<Icon icon='mdi:bank-transfer' />}
                fullWidth
                size="large"
                sx={{ py: 1.5, fontSize: '1rem', fontWeight: 600 }}
              >
                {isSubmitting ? 'Processing...' : `Request Payout ${formatCurrency(amount)}`}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </StyledCard>

    </>
  );
};

export default PayoutRequestForm;
