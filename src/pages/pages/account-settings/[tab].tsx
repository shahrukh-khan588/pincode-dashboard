// ** Next Import
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// ** Third Party Imports
import axios from 'axios'

// ** Types
import { PricingDataType } from 'src/@core/components/plan-details/types'

// ** Demo Components Imports
import AccountSettings from 'src/views/pages/account-settings/AccountSettings'

const AccountSettingsTab = ({ tab, apiPricingPlanData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <AccountSettings tab={tab} apiPricingPlanData={apiPricingPlanData} />
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'account' } },
      { params: { tab: 'security' } },
      { params: { tab: 'billing' } },
      { params: { tab: 'notifications' } },
      { params: { tab: 'connections' } }
    ],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  try {
    const res = await axios.get('/pages/pricing')
    const data: PricingDataType = res.data

    return {
      props: {
        tab: params?.tab,
        apiPricingPlanData: data.pricingPlans
      }
    }
  } catch (error) {
    // Fallback data if API is not available during build
    const fallbackData: PricingDataType = {
      pricingPlans: [
        {
          title: 'Basic',
          imgSrc: '/images/pages/pricing-basic.png',
          subtitle: 'A simple start for everyone',
          monthlyPrice: 0,
          currentPlan: false,
          yearlyPlan: {
            perMonth: 0,
            totalAnnual: 0
          },
          planBenefits: [
            'Up to 10,000 monthly visits',
            'Up to 30 team members',
            '40GB cloud storage',
            'Integration help',
            'Basic analytics',
            'Up to 600 team chat messages',
            'Basic admin and security features',
            'Community support'
          ],
          popularPlan: false
        }
      ],
      faq: [],
      pricingTable: {
        header: [],
        rows: []
      }
    }

    return {
      props: {
        tab: params?.tab,
        apiPricingPlanData: fallbackData.pricingPlans
      }
    }
  }
}

export default AccountSettingsTab
