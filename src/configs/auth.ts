export default {
  meEndpoint: '/auth/me',
  merchantProfileEndpoint: '/merchants/profile',
  adminLoginEndpoint: '/admin/auth/login',
  merchantLoginEndpoint: '/merchants/auth/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
