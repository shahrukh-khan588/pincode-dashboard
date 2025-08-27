// ** Type Imports
import { NavLink, NavGroup, LayoutProps, NavSectionTitle } from 'src/@core/layouts/types'
import { useAuth } from 'src/hooks/useAuth'

// ** Custom Menu Components
import VerticalNavLink from './VerticalNavLink'
import VerticalNavGroup from './VerticalNavGroup'
import VerticalNavSectionTitle from './VerticalNavSectionTitle'

interface Props {
  parent?: NavGroup
  navHover?: boolean
  navVisible?: boolean
  groupActive: string[]
  isSubToSub?: NavGroup
  currentActiveGroup: string[]
  navigationBorderWidth: number
  settings: LayoutProps['settings']
  saveSettings: LayoutProps['saveSettings']
  setGroupActive: (value: string[]) => void
  setCurrentActiveGroup: (item: string[]) => void
  verticalNavItems?: LayoutProps['verticalLayoutProps']['navMenu']['navItems']
}

const resolveNavItemComponent = (item: NavGroup | NavLink | NavSectionTitle) => {
  if ((item as NavSectionTitle).sectionTitle) return VerticalNavSectionTitle
  if ((item as NavGroup).children) return VerticalNavGroup

  return VerticalNavLink
}

const VerticalNavItems = (props: Props) => {
  // ** Props
  const { verticalNavItems } = props

  // ** Auth
  const { user } = useAuth() as any

  // Determine current role: 'admin' or 'merchant'
  const currentRole: 'admin' | 'merchant' | undefined =
    user && (user as any).merchantId
      ? 'merchant'
      : user && (user as any).adminId
        ? 'admin'
        : undefined

  // Role-based filter with deep handling for groups
  const isAllowed = (item: NavGroup | NavLink | NavSectionTitle) => {
    const access = (item as any).accessTo as Array<'admin' | 'merchant'> | undefined
    if (!access || access.length === 0) return true
    if (!currentRole) return false

    return access.includes(currentRole)
  }

  const filterItems = (
    items: (NavGroup | NavLink | NavSectionTitle)[] | undefined
  ): (NavGroup | NavLink | NavSectionTitle)[] | undefined => {
    if (!items) return items

    return items
      .map(item => {
        // If group, enforce parent access and then filter its children recursively
        if ((item as NavGroup).children) {
          const group = item as NavGroup

          // Hide entire group if current role is not allowed by the group
          if (!isAllowed(group)) {
            return null as any
          }

          const filteredChildren = filterItems(group.children)

          return { ...group, children: filteredChildren } as NavGroup
        }

        // Section titles or links
        return isAllowed(item) ? item : (null as any)
      })
      .filter(Boolean) as (NavGroup | NavLink | NavSectionTitle)[]
  }

  const filteredNavItems = currentRole ? filterItems(verticalNavItems) : verticalNavItems

  const RenderMenuItems = filteredNavItems?.map((item: NavGroup | NavLink | NavSectionTitle, index: number) => {
    const TagName: any = resolveNavItemComponent(item)

    return <TagName {...props} key={index} item={item} />
  })

  return <>{RenderMenuItems}</>
}

export default VerticalNavItems
