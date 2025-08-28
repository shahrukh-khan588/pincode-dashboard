// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    // admin and merchant can access this
    {
      title: 'Dashboard',
      icon: 'mdi:home-outline',
      path: '/',
      auth: true,
      accessTo: ['admin', 'merchant']
    },
    {
      icon: 'mdi:wallet-outline',
      title: 'Wallet',
      path: '/wallet/',
      auth: true,
      accessTo: ['merchant']
    },
    {
      sectionTitle: 'Profile Section'
    },

    // only merchant can access this
    {
      auth: true,
      accessTo: ['merchant'],
      title: 'Profile',
      icon: 'mdi:account-outline',
      children: [
        {
          icon: 'mdi:account-outline',
          title: 'Profile',
          path: '/pages/user-profile/profile/'
        },
        {
          icon: 'mdi:bank-outline',
          title: 'Bank Details',
          path: '/pages/user-profile/bank-details/'
        },
        {
          title: 'Transactions',
          icon: 'mdi:bank-transfer',
          path: '/pages/user-profile/transactions/'
        },
        {
          title: 'Payout Requests',
          icon: 'mdi:cash-sync',
          path: '/pages/user-profile/requests/'
        }
      ]
    },

    // admin can access this
    {
      badgeContent: '10',
      badgeColor: 'success',
      title: 'Payout Requests',
      icon: 'mdi:cash-sync',
      path: '/pages/payout/payoutlist',
      auth: true,
      accessTo: ['admin']
    },
    {
      // auth: true,
      accessTo: ['admin'],
      title: 'Merchants',
      path: '/pages/merchants/merchantlist',
      icon: 'mdi:account-group-outline'
    }

    // {
    //   title: 'Dashboards',
    //   icon: 'mdi:home-outline',
    //   badgeContent: 'new',
    //   badgeColor: 'error',
    //   children: [
    //     {
    //       title: 'CRM',
    //       path: '/dashboards/crm',
    //       disabled: true
    //     },
    //     {
    //       title: 'Analytics',
    //       path: '/dashboards/analytics',
    //       disabled: true
    //     },
    //     {
    //       title: 'eCommerce',
    //       path: '/dashboards/ecommerce',
    //       disabled: true
    //     }
    //   ]
    // },
    // {
    //   sectionTitle: 'Apps & Pages'
    // },
    // {
    //   title: 'Invoice',
    //   icon: 'mdi:file-document-outline',
    //   children: [
    //     {
    //       title: 'List',
    //       path: '/apps/invoice/list'
    //     },
    //     {
    //       title: 'Preview',
    //       path: '/apps/invoice/preview'
    //     },
    //     {
    //       title: 'Edit',
    //       path: '/apps/invoice/edit'
    //     },
    //     {
    //       title: 'Add',
    //       path: '/apps/invoice/add'
    //     }
    //   ]
    // },

    // {
    //   title: 'User',
    //   icon: 'mdi:account-outline',
    //   children: [
    //     {
    //       title: 'List',
    //       path: '/apps/user/list'
    //     },
    //     {
    //       title: 'View',
    //       children: [
    //         {
    //           title: 'Overview',
    //           path: '/apps/user/view/overview'
    //         },
    //         {
    //           title: 'Security',
    //           path: '/apps/user/view/security'
    //         },
    //         {
    //           title: 'Billing & Plans',
    //           path: '/apps/user/view/billing-plan'
    //         },
    //         {
    //           title: 'Notifications',
    //           path: '/apps/user/view/notification'
    //         },
    //         {
    //           title: 'Connection',
    //           path: '/apps/user/view/connection'
    //         }
    //       ]
    //     }
    //   ]
    // },
  ]
}

export default navigation
