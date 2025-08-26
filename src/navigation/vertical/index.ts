// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      icon: 'mdi:wallet-outline',
      title: 'Wallet',
      path: '/pages/user-profile/wallet/'
    },
    {
      sectionTitle: 'Profile Section'
    },
    {
      title: 'Profile',
      icon: 'mdi:store-outline',

      // badgeContent: 'new',
      // badgeColor: 'error',
      children: [
        {
          title: 'Profile',
          path: '/pages/user-profile/profile/'
        },
        {
          title: 'Settings',
          path: '/pages/user-profile/bank-details/'
        },
        {
          title: 'Transactions',
          path: '/pages/user-profile/transactions/'
        },
        {
          title: 'Requests',
          path: '/pages/user-profile/requests/'
        }
      ]
    },


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
