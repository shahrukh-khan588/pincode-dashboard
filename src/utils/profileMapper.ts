import { MerchantProfile } from '@/store/api/v1/types'
import {
  ConnectionsTabType,
  ProfileConnectionsType,
  ProfileTabCommonType,
  ProfileTabType,
  ProfileTeamsTechType,
  ProfileTeamsType,
  ProjectsTabType,
  TeamsTabType
} from 'src/@fake-db/types'

const pick = <T extends object, K extends keyof T>(obj: T | undefined, key: K, fallback: T[K]): T[K] => {
  if (!obj) return fallback
  const value = obj[key]

  return (value === undefined || value === null ? fallback : value) as T[K]
}

const formatCurrency = (amount: number | undefined): string => {
  const val = typeof amount === 'number' ? amount : 0

  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(val)
}

const avatar = (n: number) => `/images/avatars/${((n - 1) % 8) + 1}.png`

export const mapMerchantToProfileTab = (merchant?: MerchantProfile): ProfileTabType => {
  const about: ProfileTabCommonType[] = [
    { icon: 'mdi:account-badge-outline', property: 'merchant', value: pick(merchant, 'merchantId', 'N/A') },
    {
      icon: 'mdi:account-outline',
      property: 'full name',
      value: `${pick(merchant, 'firstName', 'John')} ${pick(merchant, 'lastName', 'Doe')}`.trim()
    },
    { icon: 'mdi:store-outline', property: 'business', value: pick(merchant, 'businessName', 'Demo Business') },
    { icon: 'mdi:card-account-details-outline', property: 'tax id', value: pick(merchant, 'taxId', 'N/A') },
    { icon: 'mdi:shield-check-outline', property: 'status', value: pick(merchant, 'verificationStatus', 'pending') },
    {
      icon: 'mdi:calendar-clock',
      property: 'joined',
      value: merchant?.createdAt ? new Date(merchant.createdAt).toDateString() : new Date().toDateString()
    }
  ]

  const contacts: ProfileTabCommonType[] = [
    { icon: 'mdi:email-outline', property: 'email', value: pick(merchant, 'email', 'merchant@example.com') },
    { icon: 'mdi:phone-outline', property: 'phone', value: pick(merchant, 'phoneNumber', '+92 300 0000000') },
    {
      icon: 'mdi:map-marker-outline',
      property: 'address',
      value: pick(merchant, 'businessAddress', 'Main Bazaar, Lahore, Pakistan')
    }
  ]

  const overview: ProfileTabCommonType[] = [
    {
      icon: 'mdi:wallet-outline',
      property: 'available',
      value: formatCurrency(merchant?.walletBalance?.availableBalance)
    },
    { icon: 'mdi:timer-sand', property: 'pending', value: formatCurrency(merchant?.walletBalance?.pendingBalance) },
    {
      icon: 'mdi:trending-up',
      property: 'total earnings',
      value: formatCurrency(merchant?.walletBalance?.totalEarnings)
    },
    {
      icon: 'mdi:bank-outline',
      property: 'bank',
      value: merchant?.bankAccountDetails?.bankName || 'MCB Bank Limited'
    }
  ]

  const teams: ProfileTeamsType[] = [
    { icon: 'mdi:credit-card-outline', property: 'payments', value: 'enabled', color: 'success' },
    { icon: 'mdi:truck-outline', property: 'logistics', value: 'standard', color: 'primary' },
    { icon: 'mdi:headset', property: 'support', value: 'priority', color: 'info' }
  ]

  const teamsTech: ProfileTeamsTechType[] = [
    { title: 'Sales', avatar: avatar(1), members: 12, chipText: 'Active', ChipColor: 'success' },
    { title: 'Inventory', avatar: avatar(2), members: 6, chipText: 'Attention', ChipColor: 'warning' },
    { title: 'Finance', avatar: avatar(3), members: 4, chipText: 'On Track', ChipColor: 'info' }
  ]

  const connections: ProfileConnectionsType[] = [
    { name: 'Ahmed Khan', avatar: avatar(4), isFriend: true, connections: '120' },
    { name: 'Fatima Noor', avatar: avatar(5), isFriend: false, connections: '98' },
    { name: 'Ali Raza', avatar: avatar(6), isFriend: false, connections: '76' }
  ]

  return { about, contacts, overview, teams, teamsTech, connections }
}

export const mapMerchantToTeamsTab = (_merchant?: MerchantProfile): TeamsTabType[] => {
  return [
    {
      title: 'Electronics',
      avatar: avatar(7),
      description: 'Handles mobile phones, accessories and gadgets.',
      extraMembers: 5,
      chips: [
        { title: 'Retail', color: 'primary' },
        { title: 'Devices', color: 'info' }
      ],
      avatarGroup: [
        { name: 'Muhammad', avatar: avatar(1) },
        { name: 'Malik', avatar: avatar(2) },
        { name: 'Saleem', avatar: avatar(3) }
      ]
    },
    {
      title: 'Repair & Service',
      avatar: avatar(8),
      description: 'Repairing mobiles and electronics.',
      extraMembers: 3,
      chips: [
        { title: 'Warranty', color: 'success' },
        { title: 'Support', color: 'secondary' }
      ],
      avatarGroup: [
        { name: 'Aslam', avatar: avatar(4) },
        { name: 'Haris', avatar: avatar(5) }
      ]
    },
    {
      title: 'Accounts',
      avatar: avatar(1),
      description: 'Billing, payouts and reconciliation.',
      extraMembers: 2,
      chips: [
        { title: 'Finance', color: 'warning' }
      ],
      avatarGroup: [
        { name: 'Ayesha', avatar: avatar(6) },
        { name: 'Bilal', avatar: avatar(7) }
      ]
    }
  ]
}

export const mapMerchantToProjectsTab = (_merchant?: MerchantProfile): ProjectsTabType[] => {
  return [
    {
      title: 'POS Rollout',
      client: 'In-House',
      description: 'Deploy POS to all counters and train staff.',
      hours: '120h',
      tasks: '45',
      budget: 'PKR 300,000',
      budgetSpent: 'PKR 120,000',
      startDate: '2025-07-01',
      deadline: '2025-09-30',
      daysLeft: 38,
      comments: 12,
      members: 'Muhammad, Malik',
      totalTask: 60,
      completedTask: 28,
      avatar: '',
      avatarGroup: [
        { name: 'Muhammad', avatar: avatar(1) },
        { name: 'Malik', avatar: avatar(2) }
      ],
      chipColor: 'info'
    },
    {
      title: 'E-Commerce Launch',
      client: 'Local',
      description: 'Launch online store with payment gateway.',
      hours: '200h',
      tasks: '80',
      budget: 'PKR 1,200,000',
      budgetSpent: 'PKR 450,000',
      startDate: '2025-06-10',
      deadline: '2025-11-15',
      daysLeft: 94,
      comments: 34,
      members: 'Team A',
      totalTask: 100,
      completedTask: 55,
      avatar: '/images/logos/shopify.png',
      avatarGroup: [
        { name: 'Ahsan', avatar: avatar(3) },
        { name: 'Sara', avatar: avatar(4) },
        { name: 'Hina', avatar: avatar(5) }
      ],
      chipColor: 'success'
    },
    {
      title: 'Inventory Audit',
      client: 'Internal',
      description: 'Full stock reconciliation across branches.',
      hours: '60h',
      tasks: '20',
      budget: 'PKR 150,000',
      budgetSpent: 'PKR 40,000',
      startDate: '2025-08-01',
      deadline: '2025-09-10',
      daysLeft: 18,
      comments: 7,
      members: 'Team B',
      totalTask: 30,
      completedTask: 12,
      avatar: '',
      avatarGroup: [
        { name: 'Usman', avatar: avatar(6) },
        { name: 'Hassan', avatar: avatar(7) }
      ],
      chipColor: 'warning'
    }
  ]
}

export const mapMerchantToConnectionsTab = (_merchant?: MerchantProfile): ConnectionsTabType[] => {
  const toConn = (c: ProfileConnectionsType): ConnectionsTabType => ({
    name: c.name,
    avatar: c.avatar,
    designation: c.isFriend ? 'Customer' : 'Supplier',
    isConnected: c.isFriend,
    connections: c.connections,
    projects: `${Math.floor(Math.random() * 15) + 1}`,
    tasks: `${Math.floor(Math.random() * 40) + 5}`,
    chips: [
      { title: 'Retail', color: 'primary' },
      { title: 'Loyal', color: 'success' }
    ]
  })

  const base: ProfileConnectionsType[] = [
    { name: 'Ahmed Khan', avatar: avatar(4), isFriend: true, connections: '120' },
    { name: 'Fatima Noor', avatar: avatar(5), isFriend: false, connections: '98' },
    { name: 'Ali Raza', avatar: avatar(6), isFriend: false, connections: '76' },
    { name: 'Zainab Iqbal', avatar: avatar(7), isFriend: true, connections: '142' }
  ]

  return base.map(toConn)
}

export const buildUserProfileTabs = (merchant?: MerchantProfile) => {
  const profile = mapMerchantToProfileTab(merchant)
  const teams = mapMerchantToTeamsTab(merchant)
  const projects = mapMerchantToProjectsTab(merchant)
  const connections = mapMerchantToConnectionsTab(merchant)

  return { profile, teams, projects, connections }
}


