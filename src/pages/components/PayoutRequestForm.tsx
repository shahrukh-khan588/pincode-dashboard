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
  Paper,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Icon from 'src/@core/components/icon';
import PincodeInput from 'src/@core/components/PincodeInput';
import usePayout from 'src/hooks/usePayout';
import { MerchantDataType } from 'src/context/types';

interface PayoutRequestFormProps {
  merchant: MerchantDataType;
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
  onSuccess,
  onCancel,
}) => {
  const [amount, setAmount] = useState(10000);
  const [selectedBank, setSelectedBank] = useState('');
  const [description, setDescription] = useState('');
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pinError, setPinError] = useState('');

  // Mock bank accounts for carousel
  const bankAccounts = [
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
      setShowPinDialog(false);
      onSuccess?.();
    },
    onError: (error) => {
      setPinError(error?.data?.message || 'Failed to process payout request');
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


  const handleSubmit = () => {
    clearValidationErrors();
    setPinError('');
    setShowPinDialog(true);
  };

  const handlePinComplete = async (pin: string) => {
    setPinError('');

    const result = await requestPayout({
      amount: amount,
      bankAccountId: selectedBank,
      transactionPin: pin,
      description: description || undefined,
    });

    if (!result.success) {
      setPinError(result.error || 'Invalid PIN or request failed');
    }
  };

  const handlePinError = (error: string) => {
    setPinError(error);
  };

  const isValidAmount = amount >= 1000 && amount <= 100000;
  const hasSufficientBalance = amount <= (merchant?.walletBalance?.availableBalance || 0);

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
                min={1000}
                max={100000}
                step={1000}
                marks={[
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
                  Min: RS 1,000
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
                Amount must be between RS 1,000 and RS 100,000
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
                disabled={!selectedBank || amount <= 0 || !isValidAmount || !hasSufficientBalance || isSubmitting}
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

      {/* PIN Input - Show when dialog is open */}
      {showPinDialog && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <Paper sx={{ p: 4, maxWidth: 400, width: '90%' }}>
            <PincodeInput
              title="Verify Transaction PIN"
              subtitle="Enter your 4-digit PIN to confirm the payout request"
              onComplete={handlePinComplete}
              onError={handlePinError}
              error={pinError}
              autoFocus={true}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setShowPinDialog(false)}
              >
                Cancel
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default PayoutRequestForm;
