// ** Next Import
import { useRouter } from 'next/router'

// ** Demo Components Imports
import UserProfile from 'src/views/pages/user-profile/UserProfile'
import { useGetMerchantProfileQuery } from 'src/store/api/v1/endpoints/merchant'
import { MerchantProfile } from '@/store/api/v1/types'

const UserProfileTab = () => {
  const router = useRouter()
  const tabParam = typeof router.query.tab === 'string' ? router.query.tab : 'profile'
  const { data } = useGetMerchantProfileQuery()


  return <UserProfile tab={tabParam} data={data as MerchantProfile} />
}

export default UserProfileTab
