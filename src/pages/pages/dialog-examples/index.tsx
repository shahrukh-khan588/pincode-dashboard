// ** Next Imports
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Components
import axios from 'axios'

// ** Type Import
import { PricingDataType } from 'src/@core/components/plan-details/types'

// ** Demo Components Imports
import DialogAddCard from 'src/views/pages/dialog-examples/DialogAddCard'
import DialogPricing from 'src/views/pages/dialog-examples/DialogPricing'
import DialogReferEarn from 'src/views/pages/dialog-examples/DialogReferEarn'
import DialogCreateApp from 'src/views/pages/dialog-examples/DialogCreateApp'
import DialogAddAddress from 'src/views/pages/dialog-examples/DialogAddAddress'
import DialogShareProject from 'src/views/pages/dialog-examples/DialogShareProject'
import DialogEditUserInfo from 'src/views/pages/dialog-examples/DialogEditUserInfo'
import DialogAuthentication from 'src/views/pages/dialog-examples/DialogAuthentication'

const DialogExamples = ({ apiPricingPlanData }: InferGetStaticPropsType<typeof getStaticProps>) => (
  <Grid container spacing={6} className='match-height'>
    <Grid item md={4} sm={6} xs={12}>
      <DialogShareProject />
    </Grid>
    <Grid item md={4} sm={6} xs={12}>
      <DialogAddCard />
    </Grid>
    <Grid item md={4} sm={6} xs={12}>
      <DialogPricing data={apiPricingPlanData} />
    </Grid>
    <Grid item md={4} sm={6} xs={12}>
      <DialogReferEarn />
    </Grid>
    <Grid item md={4} sm={6} xs={12}>
      <DialogAddAddress />
    </Grid>
    <Grid item md={4} sm={6} xs={12}>
      <DialogCreateApp />
    </Grid>
    <Grid item md={4} sm={6} xs={12}>
      <DialogAuthentication />
    </Grid>
    <Grid item md={4} sm={6} xs={12}>
      <DialogEditUserInfo />
    </Grid>
  </Grid>
)

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await axios.get('/pages/pricing')
    const data: PricingDataType = res.data

    return {
      props: {
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
        apiPricingPlanData: fallbackData.pricingPlans
      }
    }
  }
}

export default DialogExamples
