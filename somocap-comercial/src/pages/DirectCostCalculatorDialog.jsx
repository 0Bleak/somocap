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
import { safeParseFloat, formatResult } from '../utils/calculations';
import { directs } from '../utils/variables';

const DirectCostCalculatorDialog = ({ open, onClose, mainData, columnIndex }) => {
  // Initialize state with values from mainData and default direct costs
  const [formData, setFormData] = useState({
    // ACHATS - will be populated from mainData
    totalAchats: 0,
    
    // LANCEMENT MOULAGE
    lancementMoulage: {
      preparationMoule: 0,
      montageDemontage: 0,
      lancement: 0,
      nettoyageMachine: 0,
      seriePieces: 1,
      // Editable direct costs
      coutRegleur: directs.coutDirect.regleur, // 25
      typePresse: directs.tailles.moyenne // 15
    },
    
    // MOULAGE
    moulage: {
      tempsCycle: 0,
      nombreEmpreintes: 1,
      autoSemi: 0,
      pourcentageRebut: 0,
      // Editable direct costs
      coutOperateur: directs.coutDirect.operateur, // 25
      typePresse: directs.tailles.moyenne // 15
    },
    
    // EBAVURAGE
    ebavurage: {
      serie: 1,
      tempsPreparation: 0,
      tempsPiece: 0,
      // Editable direct costs
      coutRegleur: directs.coutDirect.regleur, // 25
      equipement: directs.tailles.petite // 6
    },
    
    // ETUVAGE
    etuvage: {
      serie: 1,
      // Editable direct costs
      machine: directs.tailles.petite // 6
    },
    
    // CONTROLE CAPA
    controleCapa: {
      serie: 1,
      tempsPreparation: 0,
      tempsPiece: 0,
      // Editable direct costs
      coutRegleur: directs.coutDirect.regleur, // 25
      equipement: directs.tailles.petite // 6
    },
    
    // EMBALAGE
    embalage: {
      serie: 1,
      tempsPreparation: 0,
      tempsPiece: 0,
      // Editable direct costs
      coutRegleur: directs.coutDirect.regleur, // 25
      equipement: directs.tailles.petite // 6
    },
    
    // AUTRE
    autre: {
      serie: 1,
      tempsPreparation: 0,
      tempsPiece: 0,
      // Editable direct costs
      coutRegleur: directs.coutDirect.regleur, // 25
      equipement: directs.tailles.petite // 6
    }
  });

  const [calculatedCost, setCalculatedCost] = useState(0);

  // Populate form data from mainData when dialog opens
  useEffect(() => {
    if (open && mainData && columnIndex !== undefined) {
      const colData = mainData[columnIndex];
      
      setFormData(prev => ({
        ...prev,
        // Get COÛTS TOTAL ACHAT value
        totalAchats: safeParseFloat(colData?.totalAchats?.['COÛTS TOTAL ACHAT']) || 0,
        
        // LANCEMENT MOULAGE
        lancementMoulage: {
          ...prev.lancementMoulage,
          preparationMoule: safeParseFloat(colData?.lancementMoulage?.['PREPARATION & STOCKAGE MOULE (HORS PRESSE) (MIN)']) || 0,
          montageDemontage: safeParseFloat(colData?.lancementMoulage?.['MONTAGE & DEMONTAGE (MIN)']) || 0,
          lancement: safeParseFloat(colData?.lancementMoulage?.['LANCEMENT (MIN)']) || 0,
          nettoyageMachine: safeParseFloat(colData?.lancementMoulage?.['NETTOYAGE MACHINE']) || 0,
          seriePieces: safeParseFloat(colData?.lancementMoulage?.['SERIE DE PIECES']) || 1
        },
        
        // MOULAGE
        moulage: {
          ...prev.moulage,
          tempsCycle: safeParseFloat(colData?.moulage?.['TPS DE CYCLE (sec)']) || 0,
          nombreEmpreintes: safeParseFloat(colData?.moulage?.["NOMBRE D'EMPREINTES"]) || 1,
          autoSemi: safeParseFloat(colData?.moulage?.['MOULAGE AUTO : 25% ; SEMI-AUTO : 100%']) || 0,
          pourcentageRebut: safeParseFloat(colData?.moulage?.['% DE REBUT MOULAGE']) || 0
        },
        
        // EBAVURAGE
        ebavurage: {
          ...prev.ebavurage,
          serie: safeParseFloat(colData?.ebavurage?.['Série de pièces à traiter']) || 1,
          tempsPreparation: safeParseFloat(colData?.ebavurage?.['Temps prépration poste (min)']) || 0,
          tempsPiece: safeParseFloat(colData?.ebavurage?.['Temps par pièce (s)']) || 0
        },
        
        // ETUVAGE
        etuvage: {
          ...prev.etuvage,
          serie: safeParseFloat(colData?.etuvage?.['Série de pièces à traiter']) || 1
        },
        
        // CONTROLE CAPA
        controleCapa: {
          ...prev.controleCapa,
          serie: safeParseFloat(colData?.controleCapa?.['Série de pièces à traiter']) || 1,
          tempsPreparation: safeParseFloat(colData?.controleCapa?.['Temps prépration poste (min)']) || 0,
          tempsPiece: safeParseFloat(colData?.controleCapa?.['Temps par pièce (s)']) || 0
        },
        
        // EMBALAGE
        embalage: {
          ...prev.embalage,
          serie: safeParseFloat(colData?.embalage?.['Série de pièces à traiter']) || 1,
          tempsPreparation: safeParseFloat(colData?.embalage?.['Temps prépration poste (min)']) || 0,
          tempsPiece: safeParseFloat(colData?.embalage?.['Temps par pièce (s)']) || 0
        },
        
        // AUTRE
        autre: {
          ...prev.autre,
          serie: safeParseFloat(colData?.autre?.['Série de pièces à traiter']) || 1,
          tempsPreparation: safeParseFloat(colData?.autre?.['Temps prépration poste (min)']) || 0,
          tempsPiece: safeParseFloat(colData?.autre?.['Temps par pièce (s)']) || 0
        }
      }));
    }
  }, [open, mainData, columnIndex]);

  // Calculate direct cost whenever formData changes
  useEffect(() => {
    calculateDirectCost();
  }, [formData]);

  const calculateDirectCost = () => {
    const { 
      totalAchats,
      lancementMoulage, 
      moulage, 
      ebavurage, 
      etuvage, 
      controleCapa, 
      embalage, 
      autre 
    } = formData;
    
    const seriePieces = lancementMoulage.seriePieces || 1;
    const pourcentageRebut = moulage.pourcentageRebut / 100 || 0;
    
    // LANCEMENT MOULAGE
    const lancementDirectCost = seriePieces === 0 ? 0 :
      ((lancementMoulage.preparationMoule / 60) * (lancementMoulage.coutRegleur || 0) + 
       ((lancementMoulage.montageDemontage + lancementMoulage.lancement + lancementMoulage.nettoyageMachine) / 60) * 
       ((lancementMoulage.coutRegleur || 0) + (lancementMoulage.typePresse || 0))) / seriePieces;
    
    // MOULAGE
    const moulageDirectCost = (moulage.tempsCycle === 0 || moulage.nombreEmpreintes === 0) ? 0 :
      (moulage.tempsCycle / 3600 / moulage.nombreEmpreintes) * 
      ((moulage.typePresse || 0) + ((moulage.autoSemi / 100) * (moulage.coutOperateur || 0))) * 
      (1 + pourcentageRebut);
    
    const totalMoulageDirectCost = lancementDirectCost + moulageDirectCost;
    
    // EBAVURAGE
    const ebavurageDirectCost = ebavurage.serie === 0 ? 0 :
      (ebavurage.tempsPreparation * ((ebavurage.coutRegleur || 0) + (ebavurage.equipement || 0))) / 60 / ebavurage.serie +
      (ebavurage.tempsPiece / 3600) * (ebavurage.coutRegleur || 0);
    
    // ETUVAGE
    const etuvageDirectCost = etuvage.serie === 0 ? 0 : (etuvage.machine || 0) / etuvage.serie;
    
    // CONTROLE CAPA
    const controleCapaDirectCost = (controleCapa.serie === 0 || seriePieces === 0) ? 0 :
      ((controleCapa.tempsPreparation * ((controleCapa.coutRegleur || 0) + (controleCapa.equipement || 0))) / 60 / controleCapa.serie +
       (controleCapa.tempsPiece / 3600) * (controleCapa.coutRegleur || 0)) * controleCapa.serie / seriePieces;
    
    // EMBALAGE
    const embalageDirectCost = embalage.serie === 0 ? 0 :
      (embalage.tempsPreparation * ((embalage.coutRegleur || 0) + (embalage.equipement || 0))) / 60 / embalage.serie +
      (embalage.tempsPiece / 3600) * (embalage.coutRegleur || 0);
    
    // AUTRE
    const autreDirectCost = autre.serie === 0 ? 0 :
      (autre.tempsPreparation * ((autre.coutRegleur || 0) + (autre.equipement || 0))) / 60 / autre.serie +
      (autre.tempsPiece / 3600) * (autre.coutRegleur || 0);
    
    // TOTAL
    const total = (totalAchats || 0) + totalMoulageDirectCost + ebavurageDirectCost + 
                  etuvageDirectCost + controleCapaDirectCost + embalageDirectCost + autreDirectCost;
    
    setCalculatedCost(total);
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value === '' ? '' : safeParseFloat(value)
      }
    }));
  };

  const handleDirectInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? '' : safeParseFloat(value)
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h5">Calculateur de Coûts Directs</Typography>
        <Typography variant="body2" color="textSecondary">
          Modifiez les valeurs ci-dessous pour calculer le PRI PIECE COUTS DIRECT
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ p: 2 }}>
          {/* TOTAL ACHATS */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#ede7f6' }}>
            <Typography variant="h6" gutterBottom color="#512da8">
              Total Achats
            </Typography>
            <TextField
              fullWidth
              label="COÛTS TOTAL ACHAT"
              value={formData.totalAchats}
              onChange={(e) => handleDirectInputChange('totalAchats', e.target.value)}
              type="number"
              inputProps={{ step: 0.01 }}
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
          </Paper>

          {/* LANCEMENT MOULAGE */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#fffde7' }}>
            <Typography variant="h6" gutterBottom color="#f9a825">
              Lancement Moulage
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Préparation & Stockage Moule (min)"
                  value={formData.lancementMoulage.preparationMoule}
                  onChange={(e) => handleInputChange('lancementMoulage', 'preparationMoule', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Montage & Démontage (min)"
                  value={formData.lancementMoulage.montageDemontage}
                  onChange={(e) => handleInputChange('lancementMoulage', 'montageDemontage', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Lancement (min)"
                  value={formData.lancementMoulage.lancement}
                  onChange={(e) => handleInputChange('lancementMoulage', 'lancement', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Nettoyage Machine"
                  value={formData.lancementMoulage.nettoyageMachine}
                  onChange={(e) => handleInputChange('lancementMoulage', 'nettoyageMachine', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Série de Pièces"
                  value={formData.lancementMoulage.seriePieces}
                  onChange={(e) => handleInputChange('lancementMoulage', 'seriePieces', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>Coûts Directs (modifiables)</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Coût Régleur (€/h)"
                  value={formData.lancementMoulage.coutRegleur}
                  onChange={(e) => handleInputChange('lancementMoulage', 'coutRegleur', e.target.value)}
                  type="number"
                  inputProps={{ step: 0.01 }}
                  sx={{ backgroundColor: '#fff9c4' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Type de Presse (€/h)"
                  value={formData.lancementMoulage.typePresse}
                  onChange={(e) => handleInputChange('lancementMoulage', 'typePresse', e.target.value)}
                  type="number"
                  inputProps={{ step: 0.01 }}
                  sx={{ backgroundColor: '#fff9c4' }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* MOULAGE */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#ede7f6' }}>
            <Typography variant="h6" gutterBottom color="#512da8">
              Moulage
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Temps de Cycle (sec)"
                  value={formData.moulage.tempsCycle}
                  onChange={(e) => handleInputChange('moulage', 'tempsCycle', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Nombre d'Empreintes"
                  value={formData.moulage.nombreEmpreintes}
                  onChange={(e) => handleInputChange('moulage', 'nombreEmpreintes', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Moulage Auto/Semi (%)"
                  value={formData.moulage.autoSemi}
                  onChange={(e) => handleInputChange('moulage', 'autoSemi', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="% de Rebut Moulage"
                  value={formData.moulage.pourcentageRebut}
                  onChange={(e) => handleInputChange('moulage', 'pourcentageRebut', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>Coûts Directs (modifiables)</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Coût Opérateur (€/h)"
                  value={formData.moulage.coutOperateur}
                  onChange={(e) => handleInputChange('moulage', 'coutOperateur', e.target.value)}
                  type="number"
                  inputProps={{ step: 0.01 }}
                  sx={{ backgroundColor: '#e1bee7' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Type de Presse (€/h)"
                  value={formData.moulage.typePresse}
                  onChange={(e) => handleInputChange('moulage', 'typePresse', e.target.value)}
                  type="number"
                  inputProps={{ step: 0.01 }}
                  sx={{ backgroundColor: '#e1bee7' }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* EBAVURAGE */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#f1f8e9' }}>
            <Typography variant="h6" gutterBottom color="#33691e">
              Ebavurage
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Série de pièces à traiter"
                  value={formData.ebavurage.serie}
                  onChange={(e) => handleInputChange('ebavurage', 'serie', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Temps préparation poste (min)"
                  value={formData.ebavurage.tempsPreparation}
                  onChange={(e) => handleInputChange('ebavurage', 'tempsPreparation', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Temps par pièce (s)"
                  value={formData.ebavurage.tempsPiece}
                  onChange={(e) => handleInputChange('ebavurage', 'tempsPiece', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>Coûts Directs (modifiables)</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Coût Régleur (€/h)"
                  value={formData.ebavurage.coutRegleur}
                  onChange={(e) => handleInputChange('ebavurage', 'coutRegleur', e.target.value)}
                  type="number"
                  inputProps={{ step: 0.01 }}
                  sx={{ backgroundColor: '#dcedc8' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Coût Équipement (€/h)"
                  value={formData.ebavurage.equipement}
                  onChange={(e) => handleInputChange('ebavurage', 'equipement', e.target.value)}
                  type="number"
                  inputProps={{ step: 0.01 }}
                  sx={{ backgroundColor: '#dcedc8' }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* ETUVAGE */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#fbe9e7' }}>
            <Typography variant="h6" gutterBottom color="#bf360c">
              Etuvage
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Série de pièces à traiter"
                  value={formData.etuvage.serie}
                  onChange={(e) => handleInputChange('etuvage', 'serie', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>Coûts Directs (modifiables)</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Coût Machine (€/h)"
                  value={formData.etuvage.machine}
                  onChange={(e) => handleInputChange('etuvage', 'machine', e.target.value)}
                  type="number"
                  inputProps={{ step: 0.01 }}
                  sx={{ backgroundColor: '#ffccbc' }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* CONTROLE CAPA */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#ede7f6' }}>
            <Typography variant="h6" gutterBottom color="#512da8">
              Contrôle CAPA
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Série de pièces à traiter"
                  value={formData.controleCapa.serie}
                  onChange={(e) => handleInputChange('controleCapa', 'serie', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Temps préparation poste (min)"
                  value={formData.controleCapa.tempsPreparation}
                  onChange={(e) => handleInputChange('controleCapa', 'tempsPreparation', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Temps par pièce (s)"
                  value={formData.controleCapa.tempsPiece}
                  onChange={(e) => handleInputChange('controleCapa', 'tempsPiece', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>Coûts Directs (modifiables)</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Coût Régleur (€/h)"
                  value={formData.controleCapa.coutRegleur}
                  onChange={(e) => handleInputChange('controleCapa', 'coutRegleur', e.target.value)}
                  type="number"
                  inputProps={{ step: 0.01 }}
                  sx={{ backgroundColor: '#e1bee7' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Coût Équipement (€/h)"
                  value={formData.controleCapa.equipement}
                  onChange={(e) => handleInputChange('controleCapa', 'equipement', e.target.value)}
                  type="number"
                  inputProps={{ step: 0.01 }}
                  sx={{ backgroundColor: '#e1bee7' }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* EMBALAGE */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#fff3e0' }}>
            <Typography variant="h6" gutterBottom color="#ef6c00">
              Emballage
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Série de pièces à traiter"
                  value={formData.embalage.serie}
                  onChange={(e) => handleInputChange('embalage', 'serie', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Temps préparation poste (min)"
                  value={formData.embalage.tempsPreparation}
                  onChange={(e) => handleInputChange('embalage', 'tempsPreparation', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Temps par pièce (s)"
                  value={formData.embalage.tempsPiece}
                  onChange={(e) => handleInputChange('embalage', 'tempsPiece', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>Coûts Directs (modifiables)</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Coût Régleur (€/h)"
                  value={formData.embalage.coutRegleur}
                  onChange={(e) => handleInputChange('embalage', 'coutRegleur', e.target.value)}
                  type="number"
                  inputProps={{ step: 0.01 }}
                  sx={{ backgroundColor: '#ffe0b2' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Coût Équipement (€/h)"
                  value={formData.embalage.equipement}
                  onChange={(e) => handleInputChange('embalage', 'equipement', e.target.value)}
                  type="number"
                  inputProps={{ step: 0.01 }}
                  sx={{ backgroundColor: '#ffe0b2' }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* AUTRE */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#f3e5f5' }}>
            <Typography variant="h6" gutterBottom color="#6a1b9a">
              Autre
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Série de pièces à traiter"
                  value={formData.autre.serie}
                  onChange={(e) => handleInputChange('autre', 'serie', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Temps préparation poste (min)"
                  value={formData.autre.tempsPreparation}
                  onChange={(e) => handleInputChange('autre', 'tempsPreparation', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Temps par pièce (s)"
                  value={formData.autre.tempsPiece}
                  onChange={(e) => handleInputChange('autre', 'tempsPiece', e.target.value)}
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>Coûts Directs (modifiables)</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Coût Régleur (€/h)"
                  value={formData.autre.coutRegleur}
                  onChange={(e) => handleInputChange('autre', 'coutRegleur', e.target.value)}
                  type="number"
                  inputProps={{ step: 0.01 }}
                  sx={{ backgroundColor: '#f8bbd0' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Coût Équipement (€/h)"
                  value={formData.autre.equipement}
                  onChange={(e) => handleInputChange('autre', 'equipement', e.target.value)}
                  type="number"
                  inputProps={{ step: 0.01 }}
                  sx={{ backgroundColor: '#f8bbd0' }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* RESULT */}
          <Paper elevation={3} sx={{ p: 3, backgroundColor: '#e8f5e9', border: '2px solid #4caf50' }}>
            <Typography variant="h4" align="center" color="#2e7d32" gutterBottom>
              PRI PIECE COUTS DIRECT
            </Typography>
            <Typography variant="h3" align="center" color="#1b5e20" fontWeight="bold">
              {formatResult(calculatedCost)} €
            </Typography>
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

export default DirectCostCalculatorDialog;