// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Alert,
    Chip,
    Divider
} from '@mui/material'

// ** Icon
import { Icon } from '@iconify/react'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Types
import { MerchantDataType } from 'src/context/types'

const DebugMerchantData = () => {
    const { user } = useAuth()
    const [localStorageData, setLocalStorageData] = useState<any>(null)

    useEffect(() => {
        // Get data from localStorage
        const storedData = localStorage.getItem('userData')
        if (storedData) {
            try {
                setLocalStorageData(JSON.parse(storedData))
            } catch (error) {
                console.error('Error parsing localStorage data:', error)
            }
        }
    }, [])

    const merchant = user as MerchantDataType

    const clearLocalStorage = () => {
        localStorage.removeItem('userData')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setLocalStorageData(null)
        window.location.reload()
    }

    return (
        <Box sx={{ p: 3, maxWidth: 1000, margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>
                Debug Merchant Data
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
                This page shows the current merchant data from both the auth context and localStorage.
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                    variant="outlined"
                    onClick={() => window.location.reload()}
                    startIcon={<Icon icon='mdi:refresh' />}
                >
                    Refresh Data
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={clearLocalStorage}
                    startIcon={<Icon icon='mdi:delete' />}
                >
                    Clear LocalStorage
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {/* Auth Context Data */}
                <Card sx={{ flex: 1, minWidth: 300 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Auth Context Data
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {merchant ? (
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Chip
                                        label={merchant.verificationStatus?.toUpperCase() || 'UNKNOWN'}
                                        color={merchant.verificationStatus === 'verified' ? 'success' :
                                            merchant.verificationStatus === 'pending' ? 'warning' : 'error'}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {merchant.businessName}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Merchant ID:
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                                        {merchant.merchantId}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Email:
                                    </Typography>
                                    <Typography variant="body1">
                                        {merchant.email}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Is Active:
                                    </Typography>
                                    <Typography variant="body1">
                                        {merchant.isActive ? 'Yes' : 'No'}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Has Access Token:
                                    </Typography>
                                    <Typography variant="body1">
                                        {merchant.accessToken ? 'Yes' : 'No'}
                                    </Typography>
                                </Box>
                            </Box>
                        ) : (
                            <Alert severity="warning">
                                No merchant data in auth context
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {/* LocalStorage Data */}
                <Card sx={{ flex: 1, minWidth: 300 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            LocalStorage Data
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {localStorageData ? (
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Chip
                                        label={localStorageData.verificationStatus?.toUpperCase() || 'UNKNOWN'}
                                        color={localStorageData.verificationStatus === 'verified' ? 'success' :
                                            localStorageData.verificationStatus === 'pending' ? 'warning' : 'error'}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {localStorageData.businessName}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Merchant ID:
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                                        {localStorageData.merchantId}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Email:
                                    </Typography>
                                    <Typography variant="body1">
                                        {localStorageData.email}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Is Active:
                                    </Typography>
                                    <Typography variant="body1">
                                        {localStorageData.isActive ? 'Yes' : 'No'}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Has Access Token:
                                    </Typography>
                                    <Typography variant="body1">
                                        {localStorageData.accessToken ? 'Yes' : 'No'}
                                    </Typography>
                                </Box>
                            </Box>
                        ) : (
                            <Alert severity="warning">
                                No data in localStorage
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </Box>

            {/* Raw Data */}
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Raw Data (JSON)
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        <Box sx={{ flex: 1, minWidth: 300 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Auth Context:
                            </Typography>
                            <pre style={{
                                backgroundColor: '#f5f5f5',
                                padding: '10px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                overflow: 'auto',
                                maxHeight: '200px'
                            }}>
                                {JSON.stringify(merchant, null, 2)}
                            </pre>
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 300 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                LocalStorage:
                            </Typography>
                            <pre style={{
                                backgroundColor: '#f5f5f5',
                                padding: '10px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                overflow: 'auto',
                                maxHeight: '200px'
                            }}>
                                {JSON.stringify(localStorageData, null, 2)}
                            </pre>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}

// Set page properties
DebugMerchantData.authGuard = true
DebugMerchantData.merchantApprovalGuard = false // Allow access to debug page

export default DebugMerchantData
