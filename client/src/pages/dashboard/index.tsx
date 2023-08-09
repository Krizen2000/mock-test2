import { Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { disableMock } from 'src/@fake-db/mock'

const Dashboard: React.FC = () => {
  const [username, setUsername] = useState('')

  useEffect(() => {
    const storedUsername = window.localStorage.getItem('username')
    if (!storedUsername) return
    setUsername(storedUsername)
    disableMock()
  }, [])

  return (
    <Grid>
      <Typography variant='h3' sx={{ mb: 2 }}>
        {`Welcome back! @${username}!`}
      </Typography>
    </Grid>
  )
}

export default Dashboard
