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
    // D9 - COÛTS TOTAL ACHAT
    totalAchats: 0,
    
    // LANCEMENT MOULAGE
    seriePieces: 1, // D10
    typePresse: directs.tailles.moyenne || 10, // D11 - user entered (default: moyenne)
    preparationMoule: 0, // D12
    montageLancement: 0, // D13
    coutLancementTotal: 0, // D14 - calculated
    coutLancementPiece: 0, // D15 - calculated
    
    // MOULAGE
    tempsCycle: 0, // D16
    nombreEmpreintes: 1, // D17
    moulageAutoSemi: 0, // D18
    pourcentageRebut: 0, // D19
    qtePiecesEquipe: 0, // D20
    nombreEquipes: 0, // D21
    coutMoulagePiece: 0, // D22 - calculated
    totalMoulage: 0, // D23 - calculated
    
    // FINITION
    finitionSerie: 1, // D24
    finitionTempsPrep: 0, // D25
    finitionRessourceLancement: directs.coutDirect.operateur || 25, // D26 - user entered
    finitionCoutsEquipement: directs.tailles.petite || 6, // D27 - user entered
    finitionCoutLancementPiece: 0, // D28 - calculated
    finitionRessourceProduction: directs.coutDirect.operateur || 25, // D29 - user entered
    finitionTempsPiece: 0, // D30
    finitionCoutOperationPiece: 0, // D31 - calculated
    finitionCoutPiece: 0, // D32 - calculated
    
    // CONTROLE CAPA
    controleLancement: 1, // D33
    controleRessourceLancement: directs.coutDirect.operateur || 25, // D34 - user entered
    controleTempsPieceLancement: 0, // D35
    controleCoutLancement: 0, // D36 - calculated
    controleSerie: 1, // D37
    controleRessourceProduction: directs.coutDirect.operateur || 25, // D38 - user entered
    controleTempsPieceSerie: 0, // D39
    controleCoutSerie: 0, // D40 - calculated
    controleCoutPiece: 0, // D41 - calculated
    
    // EMBALLAGE
    emballageSerie: 1, // D42
    emballageTempsPrep: 0, // D43
    emballageRessourceLancement: directs.coutDirect.operateur || 25, // D44 - user entered
    emballageCoutsEquipement: directs.tailles.petite || 6, // D45 - user entered
    emballageCoutLancementPiece: 0, // D46 - calculated
    emballageRessourceProduction: directs.coutDirect.operateur || 25, // D47 - user entered
    emballageTempsPiece: 0, // D48
    emballageCoutOperationPiece: 0, // D49 - calculated
    emballageCoutPiece: 0, // D50 - calculated
    
    // AUTRE
    autreSerie: 1, // D51
    autreTempsPrep: 0, // D52
    autreRessourceLancement: directs.coutDirect.operateur || 25, // D53 - user entered
    autreCoutsEquipement: directs.tailles.petite || 6, // D54 - user entered
    autreCoutLancementPiece: 0, // D55 - calculated
    autreRessourceProduction: directs.coutDirect.operateur || 25, // D56 - user entered
    autreTempsPiece: 0, // D57
    autreCoutOperationPiece: 0, // D58 - calculated
    autreCoutPiece: 0, // D59 - calculated
    
    // Constants
    P2: 25 // P2 constant = 25
  });

  const [calculatedCost, setCalculatedCost] = useState(0); // D60

  // Auto-populate from mainData when dialog opens
  useEffect(() => {
    if (open && mainData && columnIndex !== undefined) {
      const colData = mainData[columnIndex];
      
      setFormData(prev => ({
        ...prev,
        // D9 - COÛTS TOTAL ACHAT
        totalAchats: safeParseFloat(colData?.totalAchats?.['COÛTS TOTAL ACHAT']) || 0,
        
        // LANCEMENT MOULAGE
        seriePieces: safeParseFloat(colData?.lancementMoulage?.['SERIE DE PIECES']) || 1,
        preparationMoule: safeParseFloat(colData?.lancementMoulage?.['PREPARATION & STOCKAGE MOULE (HORS PRESSE) (MIN)']) || 0,
        montageLancement: safeParseFloat(colData?.lancementMoulage?.['LANCEMENT (MIN) - REGLEUR']) || 0,
        
        // MOULAGE
        tempsCycle: safeParseFloat(colData?.moulage?.['TPS DE CYCLE (sec)']) || 0,
        nombreEmpreintes: safeParseFloat(colData?.moulage?.["NOMBRE D'EMPREINTES"]) || 1,
        moulageAutoSemi: safeParseFloat(colData?.moulage?.['MOULAGE AUTO : 25% ; SEMI-AUTO : 100%']) || 0,
        pourcentageRebut: safeParseFloat(colData?.moulage?.['% DE REBUT MOULAGE']) || 0,
        qtePiecesEquipe: safeParseFloat(colData?.moulage?.['QUANTITE DE PIECE PAR EQUIPE']) || 0,
        nombreEquipes: safeParseFloat(colData?.moulage?.["Nombre d'équipe pour la série"]) || 0,
        
        // FINITION
        finitionSerie: safeParseFloat(colData?.finition?.['Série de pièces à traiter']) || 1,
        finitionTempsPrep: safeParseFloat(colData?.finition?.['Temps prépration poste (min)']) || 0,
        finitionTempsPiece: safeParseFloat(colData?.finition?.['Temps par pièce (s)']) || 0,
        
        // CONTROLE CAPA
        controleLancement: safeParseFloat(colData?.controleCapa?.['Contrôle lancement (qté)']) || 1,
        controleTempsPieceLancement: safeParseFloat(colData?.controleCapa?.['Temps par pièce (sec)']) || 0,
        controleSerie: safeParseFloat(colData?.controleCapa?.['Contrôle série (qté)']) || 1,
        controleTempsPieceSerie: safeParseFloat(colData?.controleCapa?.['Temps par pièce (sec)_2']) || 0,
        
        // EMBALLAGE
        emballageSerie: safeParseFloat(colData?.embalage?.['Série de pièces à traiter']) || 1,
        emballageTempsPrep: safeParseFloat(colData?.embalage?.['Temps prépration poste (min)']) || 0,
        emballageTempsPiece: safeParseFloat(colData?.embalage?.['Temps par pièce (s)']) || 0,
        
        // AUTRE
        autreSerie: safeParseFloat(colData?.autre?.['Série de pièces à traiter']) || 1,
        autreTempsPrep: safeParseFloat(colData?.autre?.['Temps prépration poste (min)']) || 0,
        autreTempsPiece: safeParseFloat(colData?.autre?.['Temps par pièce (s)']) || 0
      }));
    }
  }, [open, mainData, columnIndex]);

  // Calculate using the exact formulas provided
  useEffect(() => {
    const d = formData;
    
    // D14: COUT LANCEMENT TOTAL = (D12/60)*P2+(D13/60)*(P2+D11)
    const coutLancementTotal = (d.preparationMoule / 60) * d.P2 + (d.montageLancement / 60) * (d.P2 + d.typePresse);
    
    // D15: COUT LANCEMENT/PIECE = IF(D10="",0,D14/D10)
    const coutLancementPiece = d.seriePieces === 0 ? 0 : coutLancementTotal / d.seriePieces;
    
    // D22: COÛT MOULAGE/PIECE = (((D16/3600)/D17)*(D11+(D18*P2)))*(1+D19)
    // Note: D18 is NOT divided by 100 - it's the raw percentage value
    const coutMoulagePiece = d.nombreEmpreintes === 0 ? 0 :
      (((d.tempsCycle / 3600) / d.nombreEmpreintes) * (d.typePresse + (d.moulageAutoSemi * d.P2))) * (1 + d.pourcentageRebut / 100);
    
    // D23: TOTAL MOULAGE = D15+D22
    const totalMoulage = coutLancementPiece + coutMoulagePiece;
    
    // D28: Coût lancement ramené à la pièce = (D25*((D26+D27)/60))/D24
    const finitionCoutLancementPiece = d.finitionSerie === 0 ? 0 :
      (d.finitionTempsPrep * ((d.finitionRessourceLancement + d.finitionCoutsEquipement) / 60)) / d.finitionSerie;
    
    // D31: Coûts opération par pièce = (D30/3600)*D29
    const finitionCoutOperationPiece = (d.finitionTempsPiece / 3600) * d.finitionRessourceProduction;
    
    // D32: COUT FINITION PAR PIECE = IF(D24=0,0,D28+D31)
    const finitionCoutPiece = d.finitionSerie === 0 ? 0 : finitionCoutLancementPiece + finitionCoutOperationPiece;
    
    // D36: Coût lancement = D35*D33/3600*D34
    const controleCoutLancement = d.controleTempsPieceLancement * d.controleLancement / 3600 * d.controleRessourceLancement;
    
    // D40: Coûts contrôle série = D39*D37/3600*D38
    const controleCoutSerie = d.controleTempsPieceSerie * d.controleSerie / 3600 * d.controleRessourceProduction;
    
    // D41: COUT CONTRÔLE PAR PIECE = D36+D40
    const controleCoutPiece = controleCoutLancement + controleCoutSerie;
    
    // D46: Coût lancement ramené à la pièce = (D43*((D44+D45)/60))/D42
    const emballageCoutLancementPiece = d.emballageSerie === 0 ? 0 :
      (d.emballageTempsPrep * ((d.emballageRessourceLancement + d.emballageCoutsEquipement) / 60)) / d.emballageSerie;
    
    // D49: Coûts opération par pièce = (D48/3600)*D47
    const emballageCoutOperationPiece = (d.emballageTempsPiece / 3600) * d.emballageRessourceProduction;
    
    // D50: COUT FINITION PAR PIECE = IF(D42=0,0,D49+D46)
    const emballageCoutPiece = d.emballageSerie === 0 ? 0 : emballageCoutOperationPiece + emballageCoutLancementPiece;
    
    // D55: Coût lancement ramené à la pièce = (D52*((D53+D54)/60))/D51
    const autreCoutLancementPiece = d.autreSerie === 0 ? 0 :
      (d.autreTempsPrep * ((d.autreRessourceLancement + d.autreCoutsEquipement) / 60)) / d.autreSerie;
    
    // D58: Coûts opération par pièce = (D57/3600)*D56
    const autreCoutOperationPiece = (d.autreTempsPiece / 3600) * d.autreRessourceProduction;
    
    // D59: COUT FINITION PAR PIECE = IF(D51=0,0,D58+D55)
    const autreCoutPiece = d.autreSerie === 0 ? 0 : autreCoutOperationPiece + autreCoutLancementPiece;
    
    // D60: TOTAL DIRECT = D50+D41+D32+D23+D59+D9
    const total = emballageCoutPiece + controleCoutPiece + finitionCoutPiece + totalMoulage + autreCoutPiece + d.totalAchats;
    
    // Update calculated values
    setFormData(prev => ({
      ...prev,
      coutLancementTotal,
      coutLancementPiece,
      coutMoulagePiece,
      totalMoulage,
      finitionCoutLancementPiece,
      finitionCoutOperationPiece,
      finitionCoutPiece,
      controleCoutLancement,
      controleCoutSerie,
      controleCoutPiece,
      emballageCoutLancementPiece,
      emballageCoutOperationPiece,
      emballageCoutPiece,
      autreCoutLancementPiece,
      autreCoutOperationPiece,
      autreCoutPiece
    }));
    
    setCalculatedCost(total);
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? '' : safeParseFloat(value)
    }));
  };

  const handleSaveToMainTable = () => {
    // Save the calculated direct cost back to the main table
    if (mainData && columnIndex !== undefined) {
      mainData[columnIndex].totalVA['PRI PIECE COUTS DIRECT'] = formatResult(calculatedCost);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h5">Calculateur de Coûts Directs - Plastique</Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ p: 2 }}>
          {/* D9 - Total Achats */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#ede7f6' }}>
            <Typography variant="h6" gutterBottom>D9 - COÛTS TOTAL ACHAT</Typography>
            <TextField fullWidth value={formatResult(formData.totalAchats)} disabled />
          </Paper>

          {/* Lancement Moulage */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#fffde7' }}>
            <Typography variant="h6" gutterBottom>Lancement Moulage</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth label="D10 - SERIE DE PIECES" value={formData.seriePieces} disabled />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  label="D11 - TYPE DE PRESSE" 
                  value={formData.typePresse} 
                  onChange={(e) => handleInputChange('typePresse', e.target.value)}
                  type="number"
                  sx={{ backgroundColor: '#fff9c4' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="D12 - PREPARATION MOULE (MIN)" value={formData.preparationMoule} disabled />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="D13 - MONTAGE ET DE LANCEMENT (MIN)" value={formData.montageLancement} disabled />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="D14 - COUT LANCEMENT TOTAL" value={formatResult(formData.coutLancementTotal)} disabled sx={{ backgroundColor: '#ffe6e6' }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="D15 - COUT LANCEMENT/PIECE" value={formatResult(formData.coutLancementPiece)} disabled sx={{ backgroundColor: '#ffe6e6' }} />
              </Grid>
            </Grid>
          </Paper>

          {/* Moulage */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#ede7f6' }}>
            <Typography variant="h6" gutterBottom>Moulage</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth label="D16 - TPS DE CYCLE (sec)" value={formData.tempsCycle} disabled />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="D17 - NOMBRE D'EMPREINTES" value={formData.nombreEmpreintes} disabled />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="D18 - MOULAGE AUTO/SEMI (%)" value={formData.moulageAutoSemi} disabled />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="D19 - % DE REBUT MOULAGE" value={formData.pourcentageRebut} disabled />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="D20 - QTÉ PIÈCES PAR ÉQUIPE" value={formData.qtePiecesEquipe} disabled />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="D21 - NOMBRE D'ÉQUIPE POUR LA SÉRIE" value={formData.nombreEquipes} disabled />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="D22 - COÛT MOULAGE/PIECE" value={formatResult(formData.coutMoulagePiece)} disabled sx={{ backgroundColor: '#ffe6e6' }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="D23 - TOTAL MOULAGE" value={formatResult(formData.totalMoulage)} disabled sx={{ backgroundColor: '#ffe6e6' }} />
              </Grid>
            </Grid>
          </Paper>

          {/* Finition */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#f1f8e9' }}>
            <Typography variant="h6" gutterBottom>Finition</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField fullWidth label="D24 - Série de pièces" value={formData.finitionSerie} disabled />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label="D25 - Temps préparation (min)" value={formData.finitionTempsPrep} disabled />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label="D30 - Temps par pièce (s)" value={formData.finitionTempsPiece} disabled />
              </Grid>
              <Grid item xs={4}>
                <TextField 
                  fullWidth 
                  label="D26 - Ressource lancement" 
                  value={formData.finitionRessourceLancement} 
                  onChange={(e) => handleInputChange('finitionRessourceLancement', e.target.value)}
                  type="number"
                  sx={{ backgroundColor: '#dcedc8' }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField 
                  fullWidth 
                  label="D27 - Coûts équipement" 
                  value={formData.finitionCoutsEquipement} 
                  onChange={(e) => handleInputChange('finitionCoutsEquipement', e.target.value)}
                  type="number"
                  sx={{ backgroundColor: '#dcedc8' }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField 
                  fullWidth 
                  label="D29 - Ressource production" 
                  value={formData.finitionRessourceProduction} 
                  onChange={(e) => handleInputChange('finitionRessourceProduction', e.target.value)}
                  type="number"
                  sx={{ backgroundColor: '#dcedc8' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="D32 - COUT FINITION PAR PIECE" value={formatResult(formData.finitionCoutPiece)} disabled sx={{ backgroundColor: '#ffe6e6' }} />
              </Grid>
            </Grid>
          </Paper>

          {/* Controle CAPA */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#e3f2fd' }}>
            <Typography variant="h6" gutterBottom>Contrôle CAPA</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth label="D33 - Contrôle lancement" value={formData.controleLancement} disabled />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="D35 - Temps par pièce (sec)" value={formData.controleTempsPieceLancement} disabled />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="D37 - Contrôle série" value={formData.controleSerie} disabled />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="D39 - Temps par pièce (sec)" value={formData.controleTempsPieceSerie} disabled />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  label="D34 - Ressource lancement" 
                  value={formData.controleRessourceLancement} 
                  onChange={(e) => handleInputChange('controleRessourceLancement', e.target.value)}
                  type="number"
                  sx={{ backgroundColor: '#bbdefb' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  label="D38 - Ressource production" 
                  value={formData.controleRessourceProduction} 
                  onChange={(e) => handleInputChange('controleRessourceProduction', e.target.value)}
                  type="number"
                  sx={{ backgroundColor: '#bbdefb' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="D41 - COUT CONTRÔLE PAR PIECE" value={formatResult(formData.controleCoutPiece)} disabled sx={{ backgroundColor: '#ffe6e6' }} />
              </Grid>
            </Grid>
          </Paper>

          {/* Emballage */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#fff3e0' }}>
            <Typography variant="h6" gutterBottom>Emballage</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField fullWidth label="D42 - Série de pièces" value={formData.emballageSerie} disabled />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label="D43 - Temps préparation (min)" value={formData.emballageTempsPrep} disabled />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label="D48 - Temps par pièce (s)" value={formData.emballageTempsPiece} disabled />
              </Grid>
              <Grid item xs={4}>
                <TextField 
                  fullWidth 
                  label="D44 - Ressource lancement" 
                  value={formData.emballageRessourceLancement} 
                  onChange={(e) => handleInputChange('emballageRessourceLancement', e.target.value)}
                  type="number"
                  sx={{ backgroundColor: '#ffe0b2' }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField 
                  fullWidth 
                  label="D45 - Coûts équipement" 
                  value={formData.emballageCoutsEquipement} 
                  onChange={(e) => handleInputChange('emballageCoutsEquipement', e.target.value)}
                  type="number"
                  sx={{ backgroundColor: '#ffe0b2' }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField 
                  fullWidth 
                  label="D47 - Ressource production" 
                  value={formData.emballageRessourceProduction} 
                  onChange={(e) => handleInputChange('emballageRessourceProduction', e.target.value)}
                  type="number"
                  sx={{ backgroundColor: '#ffe0b2' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="D50 - COUT EMBALLAGE PAR PIECE" value={formatResult(formData.emballageCoutPiece)} disabled sx={{ backgroundColor: '#ffe6e6' }} />
              </Grid>
            </Grid>
          </Paper>

          {/* Autre */}
          <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#f3e5f5' }}>
            <Typography variant="h6" gutterBottom>Autre</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField fullWidth label="D51 - Série de pièces" value={formData.autreSerie} disabled />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label="D52 - Temps préparation (min)" value={formData.autreTempsPrep} disabled />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label="D57 - Temps par pièce (s)" value={formData.autreTempsPiece} disabled />
              </Grid>
              <Grid item xs={4}>
                <TextField 
                  fullWidth 
                  label="D53 - Ressource lancement" 
                  value={formData.autreRessourceLancement} 
                  onChange={(e) => handleInputChange('autreRessourceLancement', e.target.value)}
                  type="number"
                  sx={{ backgroundColor: '#f8bbd0' }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField 
                  fullWidth 
                  label="D54 - Coûts équipement" 
                  value={formData.autreCoutsEquipement} 
                  onChange={(e) => handleInputChange('autreCoutsEquipement', e.target.value)}
                  type="number"
                  sx={{ backgroundColor: '#f8bbd0' }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField 
                  fullWidth 
                  label="D56 - Ressource production" 
                  value={formData.autreRessourceProduction} 
                  onChange={(e) => handleInputChange('autreRessourceProduction', e.target.value)}
                  type="number"
                  sx={{ backgroundColor: '#f8bbd0' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="D59 - COUT AUTRE PAR PIECE" value={formatResult(formData.autreCoutPiece)} disabled sx={{ backgroundColor: '#ffe6e6' }} />
              </Grid>
            </Grid>
          </Paper>

          {/* RESULT */}
          <Paper elevation={3} sx={{ p: 3, backgroundColor: '#e8f5e9', border: '2px solid #4caf50' }}>
            <Typography variant="h4" align="center" color="#2e7d32" gutterBottom>
              D60 - TOTAL DIRECT
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
        <Button onClick={handleSaveToMainTable} color="primary" variant="contained">
          Sauvegarder dans le tableau principal
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlastiqueDirectCostCalculatorDialog;