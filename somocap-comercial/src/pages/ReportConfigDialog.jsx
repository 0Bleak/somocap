// ReportConfigDialog.js
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Grid, Box, Typography, IconButton
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';

const ReportConfigDialog = ({ open, onClose, onGenerate, documentName }) => {
  const [config, setConfig] = useState({
    clientName: 'Mme DENIS',
    clientCompany: 'société GDP',
    contactName: 'Kévin GUY',
    contactEmail: 'k.guy@somocap.com',
    contactPhone: '06.14.49.26.05',
    indice: 'A',
    logoImage: null
  });

  const handleInputChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setConfig(prev => ({
          ...prev,
          logoImage: {
            buffer: e.target.result,
            name: file.name
          }
        }));
      };
      reader.readAsArrayBuffer(file);
    }
    event.target.value = '';
  };

  const removeLogo = () => {
    setConfig(prev => ({ ...prev, logoImage: null }));
  };

  const handleGenerate = () => {
    onGenerate({ ...config, filename: documentName });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Configuration du Rapport</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Client Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Informations Client
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Nom du client"
              value={config.clientName}
              onChange={(e) => handleInputChange('clientName', e.target.value)}
              placeholder="Ex: Mme DENIS"
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Société"
              value={config.clientCompany}
              onChange={(e) => handleInputChange('clientCompany', e.target.value)}
              placeholder="Ex: société GDP"
            />
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Personne qui suit l'affaire
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Nom du contact"
              value={config.contactName}
              onChange={(e) => handleInputChange('contactName', e.target.value)}
              placeholder="Ex: Kévin GUY"
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Email"
              value={config.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              placeholder="Ex: k.guy@somocap.com"
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Téléphone"
              value={config.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              placeholder="Ex: 06.14.49.26.05"
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Indice"
              value={config.indice}
              onChange={(e) => handleInputChange('indice', e.target.value.toUpperCase())}
              placeholder="Ex: A, B, C..."
              inputProps={{ maxLength: 3 }}
            />
          </Grid>

          {/* Logo Upload */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Logo (optionnel)
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCameraIcon />}
              >
                Choisir un logo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </Button>
              
              {config.logoImage && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">
                    {config.logoImage.name}
                  </Typography>
                  <IconButton size="small" onClick={removeLogo} color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleGenerate} variant="contained">
          Générer le Rapport
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportConfigDialog;