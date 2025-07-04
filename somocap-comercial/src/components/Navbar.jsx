import { Box, Typography, Button, Stack } from '@mui/material'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: 'linear-gradient(90deg, #0f2027, #203a43, #2c5364)',
        padding: '10px 30px',
        borderRadius: '20px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: '60%',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: '#fff',
          fontWeight: 'bold',
          textTransform: 'lowercase',
          letterSpacing: 1.2,
        }}
      >
        somocap
      </Typography>

      <Stack direction="row" spacing={2}>
        <NavButton to="/" label="Home" />
        <NavButton to="/documents" label="Documents" />
      </Stack>
    </Box>
  )
}

function NavButton({ to, label }) {
  return (
    <Button
      component={Link}
      to={to}
      sx={{
        color: '#ffffff',
        fontWeight: 'bold',
        textTransform: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
        },
      }}
    >
      {label}
    </Button>
  )
}