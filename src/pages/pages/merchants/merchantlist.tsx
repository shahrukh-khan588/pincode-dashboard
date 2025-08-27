// ** React Imports
import { useState, useEffect, MouseEvent, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'


// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'


// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
// import { fetchData, deleteUser } from 'src/store/apps/user'
import { useGetMerchantsQuery } from 'src/store/api/v1/endpoints/admin'

// ** Third Party Components


// ** Types Imports

import { AdminMerchantItem } from 'src/store/api/v1/types'


// ** Custom Table Components Imports
import TableHeader from './compoents/tableheader'
import AddUserDrawer from './compoents/addMerchantDrwawer'

interface CellType {
  row: AdminMerchantItem
}

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

// Merchant icon variants similar to userRoleObj
const merchantIconObj: { [key: string]: { icon: string; color: string } } = {
  verified: { icon: 'mdi:store-check-outline', color: 'success.main' },
  pending: { icon: 'mdi:store-clock-outline', color: 'warning.main' },
  rejected: { icon: 'mdi:store-remove-outline', color: 'error.main' }
}

// ** renders client column
const renderClient = (row: AdminMerchantItem) => {
  const name = row.businessName || `${row.firstName} ${row.lastName}`

  return (
    <CustomAvatar
      skin='light'
      color={'primary'}
      sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}
    >
      {getInitials(name)}
    </CustomAvatar>
  )
}

const RowOptions = ({ id }: { id: number | string }) => {
  // ** Hooks
  void id

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleRowOptionsClose}
          href='/apps/user/view/overview/'
        >
          <Icon icon='mdi:eye-outline' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

const columns = [
  {
    flex: 0.2,
    minWidth: 230,
    field: 'businessName',
    headerName: 'Merchant',
    renderCell: ({ row }: CellType) => {
      const fullName = row.businessName || `${row.firstName} ${row.lastName}`

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <LinkStyled href='/apps/user/view/overview/'>{fullName}</LinkStyled>
            <Typography noWrap variant='caption'>{row.merchantId}</Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: 'email',
    headerName: 'Email',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap variant='body2'>
          {row.email}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: 'role',
    headerName: 'Role',
    renderCell: ({ row }: CellType) => {
      const variant = merchantIconObj[row.verificationStatus] || { icon: 'mdi:store-outline', color: 'primary.main' }

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3, color: variant.color } }}>
          <Icon icon={variant.icon} fontSize={20} />
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            merchant
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'verificationStatus',
    headerName: 'Verification',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          skin='light'
          size='small'
          label={row.verificationStatus}
          color={row.verificationStatus === 'verified' ? 'success' : row.verificationStatus === 'rejected' ? 'error' : 'warning'}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
  }
]

const UserList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [page] = useState<number>(1)

  // ** Hooks
  const { data, isLoading } = useGetMerchantsQuery({ page, limit: pageSize, search: value })

  useEffect(() => {
    // no-op: RTK Query handles fetching via useGetMerchantsQuery
  }, [page, pageSize, value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleStatusChange = useCallback((e: SelectChangeEvent) => {
    setValue(e.target.value)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>

      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='status-select'>Verification</InputLabel>
                  <Select
                    fullWidth
                    value={value}
                    id='select-status'
                    label='Verification'
                    labelId='status-select'
                    onChange={handleStatusChange}
                    inputProps={{ placeholder: 'Verification' }}
                  >
                    <MenuItem value=''>All</MenuItem>
                    <MenuItem value='pending'>Pending</MenuItem>
                    <MenuItem value='verified'>Verified</MenuItem>
                    <MenuItem value='rejected'>Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          <Box sx={{ width: '100%', overflowX: 'hidden' }}>
            <DataGrid
              autoHeight
              rows={(data?.items as any) || []}
              columns={columns}
              checkboxSelection
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50]}
              onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
              loading={isLoading}
            />
          </Box>
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}

export default UserList
