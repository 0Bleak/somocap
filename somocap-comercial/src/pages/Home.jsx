import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, MenuItem, Link } from '@mui/material'
import { useState } from 'react'

export default function Home() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    codePostal: '',
    ville: '',
    secteurActivite: '',
    societe: '',
    objetDemande: '',
    message: '',
    accepteConfidentialite: false
  })

  const objetOptions = [
    'Étude nouveau Projet Thermoplastique',
    'Étude nouveau Projet Élastomère',
    'Étude nouveau Projet Silicone',
    'Étude nouveau Projet Composite',
    'Étude Nouveau Projet Usinage',
    'Chiffrage Produits Propres',
    'Autre'
  ]

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 6,
        px: 2,
        mt:10
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: 'white',
          padding: { xs: 3, md: 5 },
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          maxWidth: '700px',
          width: '100%',
          border: '1px solid #e5e5e5'
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4, 
            color: '#1a1a1a', 
            fontWeight: 600,
            textAlign: 'center'
          }}
        >
          nouveau devis
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            label="Nom"
            variant="outlined"
            fullWidth
            required
            value={formData.nom}
            onChange={handleInputChange('nom')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#2196f3' }
              }
            }}
          />
          <TextField
            label="Prénom"
            variant="outlined"
            fullWidth
            required
            value={formData.prenom}
            onChange={handleInputChange('prenom')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#2196f3' }
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 3, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            label="Téléphone"
            variant="outlined"
            fullWidth
            value={formData.telephone}
            onChange={handleInputChange('telephone')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#2196f3' }
              }
            }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#2196f3' }
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 3, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            label="Code postal"
            variant="outlined"
            fullWidth
            value={formData.codePostal}
            onChange={handleInputChange('codePostal')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#2196f3' }
              }
            }}
          />
          <TextField
            label="Ville"
            variant="outlined"
            fullWidth
            value={formData.ville}
            onChange={handleInputChange('ville')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#2196f3' }
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 3, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            label="Secteur d'activité"
            variant="outlined"
            fullWidth
            value={formData.secteurActivite}
            onChange={handleInputChange('secteurActivite')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#2196f3' }
              }
            }}
          />
          <TextField
            label="Société"
            variant="outlined"
            fullWidth
            value={formData.societe}
            onChange={handleInputChange('societe')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#2196f3' }
              }
            }}
          />
        </Box>

           <TextField
          select
          label="Objet de la demande"
          variant="outlined"
          fullWidth
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': { borderColor: '#2196f3' }
            }
          }}
          value={formData.objetDemande}
          onChange={handleInputChange('objetDemande')}
        >
          {objetOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Message"
          variant="outlined"
          fullWidth
          multiline
          rows={5}
          required
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': { borderColor: '#2196f3' }
            }
          }}
          value={formData.message}
          onChange={handleInputChange('message')}
        />

        <Box sx={{ textAlign: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#ff5722',
              '&:hover': {
                backgroundColor: '#e64a19',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(255, 87, 34, 0.3)'
              },
              padding: '14px 40px',
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 600,
              transition: 'all 0.2s ease-in-out'
            }}
          >
            confirmer
          </Button>
        </Box>
      </Box>
    </Box>
  )
}