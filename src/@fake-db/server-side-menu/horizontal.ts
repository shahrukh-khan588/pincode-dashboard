// ** Mock Adapter
import mock from 'src/@fake-db/mock'

// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation: HorizontalNavItemsType = [
  {
    icon: 'mdi:home-outline',
    title: 'Dashboards',
    children: [
      {
        title: 'CRM',
        icon: 'mdi:chart-donut',
        path: '/dashboards/crm'
      },
      {
        icon: 'mdi:chart-timeline-variant',
        title: 'Analytics',
        path: '/dashboards/analytics'
      },
      {
        icon: 'mdi:cart-outline',
        title: 'eCommerce',
        path: '/dashboards/ecommerce'
      }
    ]
  },
  {
    icon: 'mdi:apps',
    title: 'Apps',
    children: [
      {
        title: 'Email',
        icon: 'mdi:email-outline',
        path: '/apps/email'
      },
      {
        title: 'Chat',
        icon: 'mdi:message-outline',
        path: '/apps/chat'
      },
      {
        title: 'Calendar',
        icon: 'mdi:calendar-blank-outline',
        path: '/apps/calendar'
      },
      {
        title: 'Invoice',
        icon: 'mdi:file-document-outline',
        children: [
          {
            title: 'List',
            path: '/apps/invoice/list'
          },
          {
            title: 'Preview',
            path: '/apps/invoice/preview'
          },
          {
            title: 'Edit',
            path: '/apps/invoice/edit'
          },
          {
            title: 'Add',
            path: '/apps/invoice/add'
          }
        ]
      },
      {
        title: 'User',
        icon: 'mdi:account-outline',
        children: [
          {
            title: 'List',
            path: '/apps/user/list'
          },
          {
            title: 'View',
            children: [
              {
                title: 'Overview',
                path: '/apps/user/view/overview'
              },
              {
                title: 'Security',
                path: '/apps/user/view/security'
              },
              {
                title: 'Billing & Plans',
                path: '/apps/user/view/billing-plan'
              },
              {
                title: 'Notifications',
                path: '/apps/user/view/notification'
              },
              {
                title: 'Connection',
                path: '/apps/user/view/connection'
              }
            ]
          }
        ]
      },
      {
        title: 'Roles & Permissions',
        icon: 'mdi:shield-outline',
        children: [
          {
            title: 'Roles',
            path: '/apps/roles'
          },
          {
            title: 'Permissions',
            path: '/apps/permissions'
          }
        ]
      }
    ]
  },


  {
    title: 'Others',
    icon: 'mdi:dots-horizontal',
    children: [
      {
        path: '/acl',
        action: 'read',
        subject: 'acl-page',
        icon: 'mdi:shield-outline',
        title: 'Access Control'
      },
      {
        title: 'Menu Levels',
        icon: 'mdi:menu',
        children: [
          {
            title: 'Menu Level 2.1'
          },
          {
            title: 'Menu Level 2.2',
            children: [
              {
                title: 'Menu Level 3.1'
              },
              {
                title: 'Menu Level 3.2'
              }
            ]
          }
        ]
      },
      {
        title: 'Disabled Menu',
        icon: 'mdi:eye-off-outline',
        disabled: true
      },
      {
        title: 'Raise Support',
        icon: 'mdi:lifebuoy',
        externalLink: true,
        openInNewTab: true,
        path: 'https://themeselection.com/support'
      },
      {
        title: 'Documentation',
        icon: 'mdi:file-document-outline',
        externalLink: true,
        openInNewTab: true,
        path: 'https://demos.themeselection.com/materio-mui-react-nextjs-admin-template/documentation'
      }
    ]
  }
]

mock.onGet('/api/horizontal-nav/data').reply(() => {
  return [200, navigation]
})
