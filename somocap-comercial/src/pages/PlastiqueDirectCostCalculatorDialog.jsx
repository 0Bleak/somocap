import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Divider,
  Grid
} from '@mui/material';
import { safeParseFloat, formatResult } from '../utils/plastique/calculations';
import { directs } from '../utils/plastique/variables';

const PlastiqueDirectCostCalculatorDialog = ({ open, onClose, mainData, columnIndex }) => {
  const [formData, setFormData] = useState({
    // MATIERE costs
    coutMatiere: 0,
    
    // INSERTS costs  
    coutInserts: 0,
    
    // Direct production costs (simplified for plastique)
    tempsProductionMinutes: 0,
    tauxHoraire: directs.coutDirect.operateur, // 25
    coutOutillage: directs.tailles.moyenne, // 10
  });

  const [calculatedCost, setCalculatedCost] = useState(0);

  // Populate form data from mainData when dialog opens
  useEffect(() => {
    if (open && mainData && columnIndex !== undefined) {
      const colData = mainData[columnIndex];
      
      setFormData(prev => ({
        ...prev,
        coutMatiere: safeParseFloat(colData?.matiere?.['COUT MATIERE PAR PIECE']) || 0,
        coutInserts: safeParseFloat(colData?.inserts?.['COUT INSERTS PAR PIECE']) || 0,
      }));
    }
  }, [open, mainData, columnIndex]);

  // Calculate direct cost whenever formData changes
  useEffect(() => {
    calculateDirectCost();
  }, [formData]);

  const calculateDirectCost = () => {
    const { 
      coutMatiere,
      coutInserts,
      tempsProductionMinutes,
      tauxHoraire,
      coutOutillage
    } = formData;
    
    // Production cost calculation
    const coutProduction = (tempsProductionMinutes / 60) * (tauxHoraire + coutOutillage);
    
    // Total cost
    const total = coutMatiere + coutInserts + coutProduction;
    
    setCalculatedCost(total);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? '' : safeParseFloat(value)
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5">Calculateur de Coûts Directs - Plastique</Typography>
        <Typography variant="body2" color="textSecondary">
          Calculez le coût direct de production pour plastique
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ p: 2 }}>
          {/* MATIERE */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#f9fbe7' }}>
            <Typography variant="h6" gutterBottom color="#33691e">
              Coût Matière
            </Typography>
            <TextField
              fullWidth
              label="COUT MATIERE PAR PIECE (€)"
              value={formData.coutMatiere}
              onChange={(e) => handleInputChange('coutMatiere', e.target.value)}
              type="number"
              inputProps={{ step: 0.01 }}
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
          </Paper>

          {/* INSERTS */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#e1f5fe' }}>
            <Typography variant="h6" gutterBottom color="#01579b">
              Coût Inserts
            </Typography>
            <TextField
              fullWidth
              label="COUT INSERTS PAR PIECE (€)"
              value={formData.coutInserts}
              onChange={(e) => handleInputChange('coutInserts', e.target.value)}
              type="number"
              inputProps={{ step: 0.01 }}
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
          </Paper>

          {/* PRODUCTION */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#fff3e0' }}>
            <Typography variant="h6" gutterBottom color="#ef6c00">
              Coûts de Production
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Temps de production (minutes)"
                  value={formData.tempsProductionMinutes}
                  onChange={(e) => handleInputChange('tempsProductionMinutes', e.target.value)}
                  type="number"
                  inputProps={{ step: 0.1 }}
                  sx={{ backgroundColor: '#ffe0b2' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Taux horaire opérateur (€/h)"
                  value={formData.tauxHoraire}
                  onChange={(e) => handleInputChange('tauxHoraire', e.target.value)}
                  type="number"
                  inputProps={{ step: 0.01 }}
                  sx={{ backgroundColor: '#ffe0b2' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Coût outillage (€/h)"
                  value={formData.coutOutillage}
                  onChange={(e) => handleInputChange('coutOutillage', e.target.value)}
                  type="number"
                  inputProps={{ step: 0.01 }}
                  sx={{ backgroundColor: '#ffe0b2' }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* RESULT */}
          <Paper elevation={3} sx={{ p: 3, backgroundColor: '#e8f5e9', border: '2px solid #4caf50' }}>
            <Typography variant="h4" align="center" color="#2e7d32" gutterBottom>
              COÛT DIRECT PLASTIQUE
            </Typography>
            <Typography variant="h3" align="center" color="#1b5e20" fontWeight="bold">
              {formatResult(calculatedCost)} €
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="#2e7d32">
                Détail: Matière ({formatResult(formData.coutMatiere)}€) + 
                Inserts ({formatResult(formData.coutInserts)}€) + 
                Production ({formatResult((formData.tempsProductionMinutes / 60) * (formData.tauxHoraire + formData.coutOutillage))}€)
              </Typography>
            </Box>
          </Paper>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlastiqueDirectCostCalculatorDialog;