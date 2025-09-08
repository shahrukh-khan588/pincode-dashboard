
import Crm from './dashboards/crm/index'

const Home = () => {

  return <>
    <Crm />
  </>
}

// Set page properties for merchant approval protection
Home.authGuard = true
Home.merchantApprovalGuard = true

export default Home
