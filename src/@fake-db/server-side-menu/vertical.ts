// ** Mock Adapter
import mock from 'src/@fake-db/mock'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation: VerticalNavItemsType = [
  {
    title: 'Dashboards',
    icon: 'mdi:home-outline',
    badgeContent: 'new',
    badgeColor: 'error',
    children: [
      {
        title: 'CRM',
        path: '/dashboards/crm'
      },
      {
        title: 'Analytics',
        path: '/dashboards/analytics'
      },
      {
        title: 'eCommerce',
        path: '/dashboards/ecommerce'
      }
    ]
  },
  {
    sectionTitle: 'Apps & Pages'
  },
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
    title: 'Others',
    icon: 'mdi:dots-horizontal',
    children: [
      {
        title: 'Menu Levels',
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
        disabled: true
      },
      {
        title: 'Raise Support',
        externalLink: true,
        openInNewTab: true,
        path: 'https://themeselection.com/support'
      },
      {
        title: 'Documentation',
        externalLink: true,
        openInNewTab: true,
        path: 'https://demos.themeselection.com/materio-mui-react-nextjs-admin-template/documentation'
      }
    ]
  },

]

mock.onGet('/api/vertical-nav/data').reply(() => {
  return [200, navigation]
})
