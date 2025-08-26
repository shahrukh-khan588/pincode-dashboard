// import mock from './mock'

import './cards'
import './table'
import './auth/jwt'
import './apps/chat'
import './pages/faq'
import './apps/email'
import './apps/invoice'
import './autocomplete'
import './apps/userList'
import './apps/calendar'
import './pages/pricing'
import './pages/profile'
import './iconify-icons'

// import './app-bar-search'
import './apps/permissions'
import './pages/help-center'
import './server-side-menu/vertical'
import './server-side-menu/horizontal'

// Temporarily disable mock adapter for auth endpoints
// mock.onAny().passThrough()

// Explicitly exclude auth endpoints from mocking
// mock.onPost('/auth/admin/signin').passThrough()
// mock.onPost('/auth/merchant/signin').passThrough()
// mock.onGet('/auth/me').passThrough()
