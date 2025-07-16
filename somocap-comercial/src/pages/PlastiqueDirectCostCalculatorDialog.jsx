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
    const P2 = 25; // Constant value as specified
    
    const [formData, setFormData] = useState({
      // TOTAL ACHATS
      totalAchats: 0,
      
      // LANCEMENT MOULAGE
      lancementMoulage: {
        seriePieces: 1,
        typePresse: 28, // Default moyenne
        preparationMoule: 0,
        montageEtLancement: 0,
      },
      
      // MOULAGE
      moulage: {
        tempsCycle: 0,
        nombreEmpreintes: 1,
        moulageAutoSemi: 0,
        pourcentageRebut: 0,
        qttePiecesParEquipe: 0,
        nombreEquipesSerie: 0,
      },
      
      // FINITION
      finition: {
        seriePieces: 1,
        tempsPreparation: 0,
        ressourceLancement: directs.coutDirect.operateur,
        coutHoraireEquipement: 0,
        ressourceProduction: directs.coutDirect.operateur,
        tempsPiece: 0,
      },
      
      // CONTROLE CAPA
      controleCapa: {
        controleLancementQte: 0,
        ressourceLancement: directs.coutDirect.operateur,
        tempsPieceLancement: 0,
        controleSerieQte: 0,
        ressourceProduction: directs.coutDirect.operateur,
        tempsPieceSerie: 0,
      },
      
      // EMBALLAGE
      emballage: {
        seriePieces: 1,
        tempsPreparation: 0,
        ressourceLancement: directs.coutDirect.operateur,
        coutHoraireEquipement: 0,
        ressourceProduction: directs.coutDirect.operateur,
        tempsPiece: 0,
      },
      
      // AUTRE
      autre: {
        seriePieces: 1,
        tempsPreparation: 0,
        ressourceLancement: directs.coutDirect.operateur,
        coutHoraireEquipement: 0,
        ressourceProduction: directs.coutDirect.operateur,
        tempsPiece: 0,
      }
    });

    const [calculatedValues, setCalculatedValues] = useState({
      coutLancementTotal: 0,
      coutLancementPiece: 0,
      coutMoulagePiece: 0,
      totalMoulage: 0,
      finitionCoutLancement: 0,
      finitionCoutOperation: 0,
      coutFinitionPiece: 0,
      controleCoutLancement: 0,
      controleCoutSerie: 0,
      coutControlePiece: 0,
      emballageCoutLancement: 0,
      emballageCoutOperation: 0,
      coutEmballagePiece: 0,
      autreCoutLancement: 0,
      autreCoutOperation: 0,
      coutAutrePiece: 0,
      totalDirect: 0
    });

    // Populate form data from mainData when dialog opens
    useEffect(() => {
      if (open && mainData && columnIndex !== undefined) {
        const colData = mainData[columnIndex];
        
        setFormData(prev => ({
          ...prev,
          // TOTAL ACHATS
          totalAchats: safeParseFloat(colData?.totalAchats?.['COÛTS TOTAL ACHAT']) || 0,
          
          // LANCEMENT MOULAGE
          lancementMoulage: {
            ...prev.lancementMoulage,
            seriePieces: safeParseFloat(colData?.lancementMoulage?.['SERIE DE PIECES']) || 1,
            typePresse: safeParseFloat(colData?.lancementMoulage?.['TYPE DE PRESSE']) || 28,
            preparationMoule: safeParseFloat(colData?.lancementMoulage?.['PREPARATION & STOCKAGE MOULE (HORS PRESSE) (MIN)']) || 0,
            montageEtLancement: safeParseFloat(colData?.lancementMoulage?.['MONTAGE & DEMONTAGE (MIN) - MONTEUR OUTILLAGE']) || 0,
          },
          
          // MOULAGE
          moulage: {
            ...prev.moulage,
            tempsCycle: safeParseFloat(colData?.moulage?.['TPS DE CYCLE (sec)']) || 0,
            nombreEmpreintes: safeParseFloat(colData?.moulage?.["NOMBRE D'EMPREINTES"]) || 1,
            moulageAutoSemi: safeParseFloat(colData?.moulage?.['MOULAGE AUTO : 25% ; SEMI-AUTO : 100%']) || 0,
            pourcentageRebut: safeParseFloat(colData?.moulage?.['% DE REBUT MOULAGE']) || 0,
            qttePiecesParEquipe: safeParseFloat(colData?.moulage?.['QUANTITE DE PIECE PAR EQUIPE']) || 0,
            nombreEquipesSerie: safeParseFloat(colData?.moulage?.["Nombre d'équipe pour la série"]) || 0,
          },
          
          // FINITION
          finition: {
            ...prev.finition,
            seriePieces: safeParseFloat(colData?.finition?.['Série de pièces à traiter']) || 1,
            tempsPreparation: safeParseFloat(colData?.finition?.['Temps prépration poste (min)']) || 0,
            ressourceLancement: safeParseFloat(colData?.finition?.['Ressource lancement']) || directs.coutDirect.operateur,
            coutHoraireEquipement: safeParseFloat(colData?.finition?.['Côuts horaire équipement']) || 0,
            ressourceProduction: safeParseFloat(colData?.finition?.['Ressource production']) || directs.coutDirect.operateur,
            tempsPiece: safeParseFloat(colData?.finition?.['Temps par pièce (s)']) || 0,
          },
          
          // CONTROLE CAPA
          controleCapa: {
            ...prev.controleCapa,
            controleLancementQte: safeParseFloat(colData?.controleCapa?.['Contrôle lancement (qté)']) || 0,
            ressourceLancement: safeParseFloat(colData?.controleCapa?.['Ressource lancement']) || directs.coutDirect.operateur,
            tempsPieceLancement: safeParseFloat(colData?.controleCapa?.['Temps par pièce (sec)']) || 0,
            controleSerieQte: safeParseFloat(colData?.controleCapa?.['Contrôle série (qté)']) || 0,
            ressourceProduction: safeParseFloat(colData?.controleCapa?.['Ressource production']) || directs.coutDirect.operateur,
            tempsPieceSerie: safeParseFloat(colData?.controleCapa?.['Temps par pièce (sec)_2']) || 0,
          },
          
          // EMBALLAGE
          emballage: {
            ...prev.emballage,
            seriePieces: safeParseFloat(colData?.embalage?.['Série de pièces à traiter']) || 1,
            tempsPreparation: safeParseFloat(colData?.embalage?.['Temps prépration poste (min)']) || 0,
            ressourceLancement: safeParseFloat(colData?.embalage?.['Ressource lancement']) || directs.coutDirect.operateur,
            coutHoraireEquipement: safeParseFloat(colData?.embalage?.['Côuts horaire équipement']) || 0,
            ressourceProduction: safeParseFloat(colData?.embalage?.['Ressource production']) || directs.coutDirect.operateur,
            tempsPiece: safeParseFloat(colData?.embalage?.['Temps par pièce (s)']) || 0,
          },
          
          // AUTRE
          autre: {
            ...prev.autre,
            seriePieces: safeParseFloat(colData?.autre?.['Série de pièces à traiter']) || 1,
            tempsPreparation: safeParseFloat(colData?.autre?.['Temps prépration poste (min)']) || 0,
            ressourceLancement: safeParseFloat(colData?.autre?.['Ressource lancement']) || directs.coutDirect.operateur,
            coutHoraireEquipement: safeParseFloat(colData?.autre?.['Côuts horaire équipement']) || 0,
            ressourceProduction: safeParseFloat(colData?.autre?.['Ressource production']) || directs.coutDirect.operateur,
            tempsPiece: safeParseFloat(colData?.autre?.['Temps par pièce (s)']) || 0,
          }
        }));
      }
    }, [open, mainData, columnIndex]);

    // Calculate all values when formData changes
    useEffect(() => {
      calculateAllValues();
    }, [formData]);

    const calculateAllValues = () => {
      const { totalAchats, lancementMoulage, moulage, finition, controleCapa, emballage, autre } = formData;
      
      // LANCEMENT MOULAGE CALCULATIONS
      // D14 = (D12/60)*$P$2+(D13/60)*($P$2+D11)
      const coutLancementTotal = (lancementMoulage.preparationMoule / 60) * P2 + 
                                (lancementMoulage.montageEtLancement / 60) * (P2 + lancementMoulage.typePresse);
      
      // D15 = IF(D10="",0,D14/D10)
      const coutLancementPiece = lancementMoulage.seriePieces === 0 ? 0 : coutLancementTotal / lancementMoulage.seriePieces;
      
      // MOULAGE CALCULATIONS
      // D22 = (((D16/3600)/D17)*(D11+(D18*$P$2)))*(1+D19)
      const coutMoulagePiece = moulage.nombreEmpreintes === 0 ? 0 :
        (((moulage.tempsCycle / 3600) / moulage.nombreEmpreintes) * 
        (lancementMoulage.typePresse + (moulage.moulageAutoSemi * P2))) * 
        (1 + moulage.pourcentageRebut / 100);
      
      // D23 = D15+D22
      const totalMoulage = coutLancementPiece + coutMoulagePiece;
      
      // FINITION CALCULATIONS
      // D28 = (D25*((D26+D27)/60))/D24
      const finitionCoutLancement = finition.seriePieces === 0 ? 0 :
        (finition.tempsPreparation * ((finition.ressourceLancement + finition.coutHoraireEquipement) / 60)) / finition.seriePieces;
      
      // D31 = (D30/3600)*D29
      const finitionCoutOperation = (finition.tempsPiece / 3600) * finition.ressourceProduction;
      
      // D32 = IF(D24=0,0,D28+D31)
      const coutFinitionPiece = finition.seriePieces === 0 ? 0 : finitionCoutLancement + finitionCoutOperation;
      
      // CONTROLE CAPA CALCULATIONS
      // D36 = D35*D33/3600*D34
      const controleCoutLancement = (controleCapa.tempsPieceLancement * controleCapa.controleLancementQte / 3600) * 
                                    controleCapa.ressourceLancement;
      
      // D40 = D39*D37/3600*D38
      const controleCoutSerie = (controleCapa.tempsPieceSerie * controleCapa.controleSerieQte / 3600) * 
                                controleCapa.ressourceProduction;
      
      // D41 = same (you didn't specify, assuming it's the sum)
      const coutControlePiece = controleCoutLancement + controleCoutSerie;
      
      // EMBALLAGE CALCULATIONS
      // D46 = (D43*((D44+D45)/60))/D42
      const emballageCoutLancement = emballage.seriePieces === 0 ? 0 :
        (emballage.tempsPreparation * ((emballage.ressourceLancement + emballage.coutHoraireEquipement) / 60)) / emballage.seriePieces;
      
      // D49 = (D48/3600)*D47
      const emballageCoutOperation = (emballage.tempsPiece / 3600) * emballage.ressourceProduction;
      
      // D50 = IF(D42=0,0,D49+D46)
      const coutEmballagePiece = emballage.seriePieces === 0 ? 0 : emballageCoutOperation + emballageCoutLancement;
      
      // AUTRE CALCULATIONS
      // D55 = (D52*((D53+D54)/60))/D51
      const autreCoutLancement = autre.seriePieces === 0 ? 0 :
        (autre.tempsPreparation * ((autre.ressourceLancement + autre.coutHoraireEquipement) / 60)) / autre.seriePieces;
      
      // D58 = (D57/3600)*D56
      const autreCoutOperation = (autre.tempsPiece / 3600) * autre.ressourceProduction;
      
      // D59 = IF(D51=0,0,D58+D55)
      const coutAutrePiece = autre.seriePieces === 0 ? 0 : autreCoutOperation + autreCoutLancement;
      
      // D60 = D50+D41+D32+D23+D59+D9
      const totalDirect = coutEmballagePiece + coutControlePiece + coutFinitionPiece + 
                          totalMoulage + coutAutrePiece + totalAchats;
      
      setCalculatedValues({
        coutLancementTotal,
        coutLancementPiece,
        coutMoulagePiece,
        totalMoulage,
        finitionCoutLancement,
        finitionCoutOperation,
        coutFinitionPiece,
        controleCoutLancement,
        controleCoutSerie,
        coutControlePiece,
        emballageCoutLancement,
        emballageCoutOperation,
        coutEmballagePiece,
        autreCoutLancement,
        autreCoutOperation,
        coutAutrePiece,
        totalDirect
      });
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
          <Typography variant="h5">Calculateur de Coûts coutDirect - Plastique</Typography>
          <Typography variant="body2" color="textSecondary">
            Calcul automatique selon les formules Excel spécifiées
          </Typography>
        </DialogTitle>
        
        <DialogContent dividers>
          <Box sx={{ p: 2 }}>
            {/* TOTAL ACHATS */}
            <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#ede7f6' }}>
              <Typography variant="h6" gutterBottom color="#512da8">
                Total Achats (D9)
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
                    label="SERIE DE PIECES (D10)"
                    value={formData.lancementMoulage.seriePieces}
                    onChange={(e) => handleInputChange('lancementMoulage', 'seriePieces', e.target.value)}
                    type="number"
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="TYPE DE PRESSE (D11)"
                    value={formData.lancementMoulage.typePresse}
                    onChange={(e) => handleInputChange('lancementMoulage', 'typePresse', e.target.value)}
                    type="number"
                    sx={{ backgroundColor: '#fff9c4' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="PREPARATION MOULE (MIN) (D12)"
                    value={formData.lancementMoulage.preparationMoule}
                    onChange={(e) => handleInputChange('lancementMoulage', 'preparationMoule', e.target.value)}
                    type="number"
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="MONTAGE ET DE LANCEMENT (D13)"
                    value={formData.lancementMoulage.montageEtLancement}
                    onChange={(e) => handleInputChange('lancementMoulage', 'montageEtLancement', e.target.value)}
                    type="number"
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>Valeurs Calculées:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="COUT LANCEMENT TOTAL (D14)"
                    value={formatResult(calculatedValues.coutLancementTotal)}
                    disabled
                    sx={{ backgroundColor: '#ffecb3' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="COUT LANCEMENT/PIECE (D15)"
                    value={formatResult(calculatedValues.coutLancementPiece)}
                    disabled
                    sx={{ backgroundColor: '#ffecb3' }}
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
                    label="TPS DE CYCLE (sec) (D16)"
                    value={formData.moulage.tempsCycle}
                    onChange={(e) => handleInputChange('moulage', 'tempsCycle', e.target.value)}
                    type="number"
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="NOMBRE D'EMPREINTES (D17)"
                    value={formData.moulage.nombreEmpreintes}
                    onChange={(e) => handleInputChange('moulage', 'nombreEmpreintes', e.target.value)}
                    type="number"
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="MOULAGE AUTO/SEMI (D18)"
                    value={formData.moulage.moulageAutoSemi}
                    onChange={(e) => handleInputChange('moulage', 'moulageAutoSemi', e.target.value)}
                    type="number"
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="% DE REBUT MOULAGE (D19)"
                    value={formData.moulage.pourcentageRebut}
                    onChange={(e) => handleInputChange('moulage', 'pourcentageRebut', e.target.value)}
                    type="number"
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>Valeurs Calculées:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="COÛT MOULAGE/PIECE (D22)"
                    value={formatResult(calculatedValues.coutMoulagePiece)}
                    disabled
                    sx={{ backgroundColor: '#e1bee7' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="TOTAL MOULAGE (D23)"
                    value={formatResult(calculatedValues.totalMoulage)}
                    disabled
                    sx={{ backgroundColor: '#e1bee7' }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* FINITION */}
            <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#f1f8e9' }}>
              <Typography variant="h6" gutterBottom color="#33691e">
                Finition
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Série de pièces à traiter (D24)"
                    value={formData.finition.seriePieces}
                    onChange={(e) => handleInputChange('finition', 'seriePieces', e.target.value)}
                    type="number"
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Temps préparation poste (min) (D25)"
                    value={formData.finition.tempsPreparation}
                    onChange={(e) => handleInputChange('finition', 'tempsPreparation', e.target.value)}
                    type="number"
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Ressource lancement (D26)"
                    value={formData.finition.ressourceLancement}
                    onChange={(e) => handleInputChange('finition', 'ressourceLancement', e.target.value)}
                    type="number"
                    inputProps={{ step: 0.01 }}
                    sx={{ backgroundColor: '#dcedc8' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Coûts horaire équipement (D27)"
                    value={formData.finition.coutHoraireEquipement}
                    onChange={(e) => handleInputChange('finition', 'coutHoraireEquipement', e.target.value)}
                    type="number"
                    inputProps={{ step: 0.01 }}
                    sx={{ backgroundColor: '#dcedc8' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Ressource production (D29)"
                    value={formData.finition.ressourceProduction}
                    onChange={(e) => handleInputChange('finition', 'ressourceProduction', e.target.value)}
                    type="number"
                    inputProps={{ step: 0.01 }}
                    sx={{ backgroundColor: '#dcedc8' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Temps par pièce (s) (D30)"
                    value={formData.finition.tempsPiece}
                    onChange={(e) => handleInputChange('finition', 'tempsPiece', e.target.value)}
                    type="number"
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>Valeurs Calculées:</Typography>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Coût lancement/pièce (D28)"
                    value={formatResult(calculatedValues.finitionCoutLancement)}
                    disabled
                    sx={{ backgroundColor: '#c5e1a5' }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Coûts opération/pièce (D31)"
                    value={formatResult(calculatedValues.finitionCoutOperation)}
                    disabled
                    sx={{ backgroundColor: '#c5e1a5' }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="COUT FINITION PAR PIECE (D32)"
                    value={formatResult(calculatedValues.coutFinitionPiece)}
                    disabled
                    sx={{ backgroundColor: '#aed581' }}
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
                    label="Contrôle lancement (qté) (D33)"
                    value={formData.controleCapa.controleLancementQte}
                    onChange={(e) => handleInputChange('controleCapa', 'controleLancementQte', e.target.value)}
                    type="number"
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Ressource lancement (D34)"
                    value={formData.controleCapa.ressourceLancement}
                    onChange={(e) => handleInputChange('controleCapa', 'ressourceLancement', e.target.value)}
                    type="number"
                    inputProps={{ step: 0.01 }}
                    sx={{ backgroundColor: '#e1bee7' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Temps par pièce (sec) (D35)"
                    value={formData.controleCapa.tempsPieceLancement}
                    onChange={(e) => handleInputChange('controleCapa', 'tempsPieceLancement', e.target.value)}
                    type="number"
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Coût lancement (€) (D36)"
                    value={formatResult(calculatedValues.controleCoutLancement)}
                    disabled
                    sx={{ backgroundColor: '#e1bee7' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Contrôle série (qté) (D37)"
                    value={formData.controleCapa.controleSerieQte}
                    onChange={(e) => handleInputChange('controleCapa', 'controleSerieQte', e.target.value)}
                    type="number"
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Ressource production (D38)"
                    value={formData.controleCapa.ressourceProduction}
                    onChange={(e) => handleInputChange('controleCapa', 'ressourceProduction', e.target.value)}
                    type="number"
                    inputProps={{ step: 0.01 }}
                    sx={{ backgroundColor: '#e1bee7' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Temps par pièce (sec) (D39)"
                    value={formData.controleCapa.tempsPieceSerie}
                    onChange={(e) => handleInputChange('controleCapa', 'tempsPieceSerie', e.target.value)}
                    type="number"
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Coûts contrôle série (€) (D40)"
                    value={formatResult(calculatedValues.controleCoutSerie)}
                    disabled
                    sx={{ backgroundColor: '#e1bee7' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="COUT CONTRÔLE PAR PIECE (D41)"
                    value={formatResult(calculatedValues.coutControlePiece)}
                    disabled
                    sx={{ backgroundColor: '#b39ddb' }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* EMBALLAGE */}
            <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#fff3e0' }}>
              <Typography variant="h6" gutterBottom color="#ef6c00">
                Emballage
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Série de pièces à traiter (D42)"
                    value={formData.emballage.seriePieces}
                    onChange={(e) => handleInputChange('emballage', 'seriePieces', e.target.value)}
                    type="number"
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Temps préparation poste (min) (D43)"
                    value={formData.emballage.tempsPreparation}
                    onChange={(e) => handleInputChange('emballage', 'tempsPreparation', e.target.value)}
                    type="number"
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Ressource lancement (D44)"
                    value={formData.emballage.ressourceLancement}
                    onChange={(e) => handleInputChange('emballage', 'ressourceLancement', e.target.value)}
                    type="number"
                    inputProps={{ step: 0.01 }}
                    sx={{ backgroundColor: '#ffe0b2' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Coûts horaire équipement (D45)"
                    value={formData.emballage.coutHoraireEquipement}
                    onChange={(e) => handleInputChange('emballage', 'coutHoraireEquipement', e.target.value)}
                    type="number"
                    inputProps={{ step: 0.01 }}
                    sx={{ backgroundColor: '#ffe0b2' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Ressource production (D47)"
                    value={formData.emballage.ressourceProduction}
                    onChange={(e) => handleInputChange('emballage', 'ressourceProduction', e.target.value)}
                    type="number"
                    inputProps={{ step: 0.01 }}
                    sx={{ backgroundColor: '#ffe0b2' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Temps par pièce (s) (D48)"
                    value={formData.emballage.tempsPiece}
                    onChange={(e) => handleInputChange('emballage', 'tempsPiece', e.target.value)}
                    type="number"
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>Valeurs Calculées:</Typography>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Coût lancement/pièce (D46)"
                    value={formatResult(calculatedValues.emballageCoutLancement)}
                    disabled
                    sx={{ backgroundColor: '#ffcc80' }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Coûts opération/pièce (D49)"
                    value={formatResult(calculatedValues.emballageCoutOperation)}
                    disabled
                    sx={{ backgroundColor: '#ffcc80' }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="COUT FINITION PAR PIECE (D50)"
                    value={formatResult(calculatedValues.coutEmballagePiece)}
                    disabled
                    sx={{ backgroundColor: '#ffb74d' }}
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
                    label="Série de pièces à traiter (D51)"
                    value={formData.autre.seriePieces}
                    onChange={(e) => handleInputChange('autre', 'seriePieces', e.target.value)}
                    type="number"
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Temps préparation poste (min) (D52)"
                    value={formData.autre.tempsPreparation}
                    onChange={(e) => handleInputChange('autre', 'tempsPreparation', e.target.value)}
                    type="number"
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Ressource lancement (D53)"
                    value={formData.autre.ressourceLancement}
                    onChange={(e) => handleInputChange('autre', 'ressourceLancement', e.target.value)}
                    type="number"
                    inputProps={{ step: 0.01 }}
                    sx={{ backgroundColor: '#f8bbd0' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Coûts horaire équipement (D54)"
                    value={formData.autre.coutHoraireEquipement}
                    onChange={(e) => handleInputChange('autre', 'coutHoraireEquipement', e.target.value)}
                    type="number"
                    inputProps={{ step: 0.01 }}
                    sx={{ backgroundColor: '#f8bbd0' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Ressource production (D56)"
                    value={formData.autre.ressourceProduction}
                    onChange={(e) => handleInputChange('autre', 'ressourceProduction', e.target.value)}
                    type="number"
                    inputProps={{ step: 0.01 }}
                    sx={{ backgroundColor: '#f8bbd0' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Temps par pièce (s) (D57)"
                    value={formData.autre.tempsPiece}
                    onChange={(e) => handleInputChange('autre', 'tempsPiece', e.target.value)}
                    type="number"
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>Valeurs Calculées:</Typography>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Coût lancement/pièce (D55)"
                    value={formatResult(calculatedValues.autreCoutLancement)}
                    disabled
                    sx={{ backgroundColor: '#e1bee7' }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Coûts opération/pièce (D58)"
                    value={formatResult(calculatedValues.autreCoutOperation)}
                    disabled
                    sx={{ backgroundColor: '#e1bee7' }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="COUT FINITION PAR PIECE (D59)"
                    value={formatResult(calculatedValues.coutAutrePiece)}
                    disabled
                    sx={{ backgroundColor: '#ce93d8' }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* RESULT */}
            <Paper elevation={3} sx={{ p: 3, backgroundColor: '#e8f5e9', border: '2px solid #4caf50' }}>
              <Typography variant="h4" align="center" color="#2e7d32" gutterBottom>
                TOTAL DIRECT (D60)
              </Typography>
              <Typography variant="h3" align="center" color="#1b5e20" fontWeight="bold">
                {formatResult(calculatedValues.totalDirect)} €
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="#2e7d32" align="center">
                  Formule: D50 + D41 + D32 + D23 + D59 + D9
                </Typography>
                <Typography variant="body2" color="#2e7d32" align="center">
                  = {formatResult(calculatedValues.coutEmballagePiece)} + 
                  {formatResult(calculatedValues.coutControlePiece)} + 
                  {formatResult(calculatedValues.coutFinitionPiece)} + 
                  {formatResult(calculatedValues.totalMoulage)} + 
                  {formatResult(calculatedValues.coutAutrePiece)} + 
                  {formatResult(formData.totalAchats)}
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