// ** React Imports

// ** MUI Imports
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface TableHeaderProps {
  value: string
  handleFilter: (val: string) => void
  toggle: () => void
}

const TableHeader = (props: TableHeaderProps) => {
  const { toggle } = props

  return (
    <CardHeader
      title='Transactions'
      action={
        <Button
          variant='contained'
          onClick={toggle}
          startIcon={<Icon icon='mdi:plus' />}
        >
          Check Transaction Status
        </Button>
      }
    />
  )
}

export default TableHeader
