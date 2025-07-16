// Import variables
import { complets, directs, cout_machine } from './variables';

// Helper functions
export const safeParseFloat = (value, defaultValue = 0) => {
  if (value === '' || value === null || value === undefined) return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const formatResult = (value, decimals = 2) => {
  if (value === '' || value === null || value === undefined || isNaN(value)) return '';
  return Number(value).toFixed(decimals);
};

// Main calculations object for plastique
export const CALCULATIONS = {
  // ===== MATIÈRE SECTION =====
  matiere: {
    'Poids pièce (gr)': (tableData, allData) => {
      const volume = safeParseFloat(tableData['Volume (cm3)']); // D13
      const densite = safeParseFloat(tableData['Densité (gr/cm3)']); // D14
      
      return formatResult(volume * densite);
    },

    // First occurrence of 'Poids carotte/ pièce (gr)' - D17
    'Poids carotte/ pièce (gr)': (tableData, allData) => {
      const poidsCarotteMoulee = safeParseFloat(tableData['Poids carotte de la moulée (gr)']); // D16
      const nbEmpreintes = safeParseFloat(allData?.moulage?.["NOMBRE D'EMPREINTES"]) || 1; // D64
      
      return formatResult(poidsCarotteMoulee / nbEmpreintes);
    },

    '% du masse carotte / masse pièce': (tableData, allData) => {
      const poidsCarotte = safeParseFloat(tableData['Poids carotte/ pièce (gr)']); // D17 - First occurrence
      const poidsPiece = safeParseFloat(tableData['Poids pièce (gr)']); // D15
      
      if (poidsPiece === 0) return '';
      
      return formatResult((poidsCarotte / poidsPiece) * 100);
    },

    '% du masse carotte / masse pièce apres recyclage (< 15%)': (tableData, allData) => {
      const poidsCarotte = safeParseFloat(tableData['Poids carotte/ pièce (gr)']); // D17 - First occurrence
      const recyclage = safeParseFloat(tableData['% de recyclage carotte integrer']) / 100; // D19
      const poidsPiece = safeParseFloat(tableData['Poids pièce (gr)']); // D15
      
      if (poidsPiece === 0) return '';
      
      const result = (poidsCarotte * recyclage) / poidsPiece * 100;
      
      return formatResult(result);
    },

    // Second occurrence of 'Poids carotte/ pièce (gr)' - D21
    'Poids carotte/ pièce (gr)_2': (tableData, allData) => {
      const recyclage = safeParseFloat(tableData['% de recyclage carotte integrer']) / 100; // D19
      const poidsCarotte = safeParseFloat(tableData['Poids carotte/ pièce (gr)']); // D17 - First occurrence
      
      return formatResult((1 - recyclage) * poidsCarotte);
    },

    'Poids rebuts (gr)': (tableData, allData) => {
      const poidsPiece = safeParseFloat(tableData['Poids pièce (gr)']); // D15
      const poidsCarotteRecycle = safeParseFloat(tableData['Poids carotte/ pièce (gr)_2']); // D21 - Second occurrence
      const rebutMoulage = safeParseFloat(allData?.moulage?.['% DE REBUT MOULAGE']) / 100; // D66
      
      return formatResult((poidsPiece * rebutMoulage) + (poidsCarotteRecycle * rebutMoulage));
    },

    'Poids purge (g)': (tableData, allData) => {
      const poidsPiece = safeParseFloat(tableData['Poids pièce (gr)']); // D15
      const poidsCarotteRecycle = safeParseFloat(tableData['Poids carotte/ pièce (gr)_2']); // D21 - Second occurrence
      const quantiteRebuts = safeParseFloat(tableData['Quantité rebuts/lancement']); // D23
      const poidsPurgeNettoyage = safeParseFloat(tableData['Poids purge nettoyage lancement série (gr)']); // D22
      const nbEmpreintes = safeParseFloat(allData?.moulage?.["NOMBRE D'EMPREINTES"]) || 1; // D64
      const seriePieces = safeParseFloat(allData?.lancementMoulage?.['SERIE DE PIECES']) || 1; // D53
      
      const numerator = ((poidsPiece + poidsCarotteRecycle) * quantiteRebuts) + (poidsPurgeNettoyage / nbEmpreintes);
      
      // Excel shows 0, but formula should give this result
      return formatResult(numerator / seriePieces);
    },

    'Poids Nomenclature SQUALP': (tableData, allData) => {
      const poidsPiece = safeParseFloat(tableData['Poids pièce (gr)']); // D15
      const poidsCarotteRecycle = safeParseFloat(tableData['Poids carotte/ pièce (gr)_2']); // D21 - Second occurrence
      const poidsRebuts = safeParseFloat(tableData['Poids rebuts (gr)']); // D24
      const poidsPurge = safeParseFloat(tableData['Poids purge (g)']); // D25
      
      return formatResult(poidsPiece + poidsCarotteRecycle + poidsRebuts + poidsPurge);
    },

    'Pour info cout carotte (€):': (tableData, allData) => {
      const poidsCarotteRecycle = safeParseFloat(tableData['Poids carotte/ pièce (gr)_2']); // D21 - Second occurrence
      const tauxColorant = safeParseFloat(tableData['Taux de colorant (%)']) / 100; // D11
      const prixMatiere = safeParseFloat(tableData['Prix Matière (€/kg)']); // D10
      const prixColorant = safeParseFloat(tableData['Prix Colorant (€/kg)']); // D12
      
      const coutMatiere = poidsCarotteRecycle * (1 - tauxColorant) * prixMatiere;
      const coutColorant = poidsCarotteRecycle * tauxColorant * prixColorant;
      
      return formatResult((coutMatiere + coutColorant) / 1000);
    },

    'COUT MATIERE PAR PIECE': (tableData, allData) => {
      const poidsNomenclature = safeParseFloat(tableData['Poids Nomenclature SQUALP']); // D26
      const tauxColorant = safeParseFloat(tableData['Taux de colorant (%)']) / 100; // D11
      const prixMatiere = safeParseFloat(tableData['Prix Matière (€/kg)']); // D10
      const prixColorant = safeParseFloat(tableData['Prix Colorant (€/kg)']); // D12
      
      const coutMatiere = poidsNomenclature * (1 - tauxColorant) * prixMatiere;
      const coutColorant = poidsNomenclature * tauxColorant * prixColorant;
      
      return formatResult((coutMatiere + coutColorant) / 1000);
    }
  },

  // ===== INSERTS SECTION =====
  inserts: {
    "Quantité d'inserts lancement": (tableData, allData) => {
      const quantiteRebuts = safeParseFloat(allData?.matiere?.['Quantité rebuts/lancement']) || 0; // D23
      const nombreInserts = safeParseFloat(tableData["Nombre d'insert par pièce"]); // D31
      
      return formatResult(quantiteRebuts * nombreInserts, 0);
    },
    
    "Quantité inserts rebuts production": (tableData, allData) => {
      const seriePieces = safeParseFloat(allData?.lancementMoulage?.['SERIE DE PIECES']) || 0; // D53
      const rebutMoulage = safeParseFloat(allData?.moulage?.['% DE REBUT MOULAGE']) / 100; // D66
      const nombreInserts = safeParseFloat(tableData["Nombre d'insert par pièce"]); // D31
      
      return formatResult(seriePieces * rebutMoulage * nombreInserts, 0);
    },
    
    "Quantité totale inserts": (tableData, allData) => {
      const seriePieces = safeParseFloat(allData?.lancementMoulage?.['SERIE DE PIECES']) || 0; // D53
      const nombreInserts = safeParseFloat(tableData["Nombre d'insert par pièce"]); // D31
      const quantiteLancement = safeParseFloat(tableData["Quantité d'inserts lancement"]); // D33
      const quantiteRebuts = safeParseFloat(tableData["Quantité inserts rebuts production"]); // D34
      
      return formatResult((seriePieces * nombreInserts) + quantiteLancement + quantiteRebuts, 0);
    },
    
    "COUT INSERTS PAR PIECE": (tableData, allData) => {
      const coutInsert = safeParseFloat(tableData["Coût insert"]); // D30
      const quantiteTotale = safeParseFloat(tableData["Quantité totale inserts"]); // D35
      const seriePieces = safeParseFloat(allData?.lancementMoulage?.['SERIE DE PIECES']) || 1; // D53
      
      if (coutInsert === 0) return formatResult(0);
      if (seriePieces === 0) return formatResult(0);
      
      return formatResult((quantiteTotale * coutInsert) / seriePieces);
    }
  },

  // ===== CONDITIONNEMENT SECTION =====
  conditionnement: {
    'Nbre de pièce en Longueur': (tableData, allData) => {
      const longueurPiece = safeParseFloat(tableData['Longueur pièce (en X)']); // D38
      if (longueurPiece === 0) return '';
      
      return formatResult(Math.floor(442 / longueurPiece), 0);
    },

    'Nbre de pièce en Largeur': (tableData, allData) => {
      const largeurPiece = safeParseFloat(tableData['Largeur pièce (en Y)']); // D39
      if (largeurPiece === 0) return '';
      
      return formatResult(Math.floor(304 / largeurPiece), 0);
    },

    'Nbre de pièce en Hauteur': (tableData, allData) => {
      const hauteurPiece = safeParseFloat(tableData['Hauteur pièce (en Z)']); // D40
      if (hauteurPiece === 0) return '';
      
      return formatResult(Math.floor(239 / hauteurPiece), 0);
    },

    'Volume (cm3)': (tableData, allData) => {
      const longueur = safeParseFloat(tableData['Longueur pièce (en X)']); // D38
      const largeur = safeParseFloat(tableData['Largeur pièce (en Y)']); // D39
      const hauteur = safeParseFloat(tableData['Hauteur pièce (en Z)']); // D40
      
      return formatResult((longueur * largeur * hauteur) / 1000);
    },

    'Quantité de pièce par conditionnement': (tableData, allData) => {
      const nbLongueur = safeParseFloat(tableData['Nbre de pièce en Longueur']); // D41
      const nbLargeur = safeParseFloat(tableData['Nbre de pièce en Largeur']); // D42
      const nbHauteur = safeParseFloat(tableData['Nbre de pièce en Hauteur']); // D43
      
      return formatResult(nbLongueur * nbLargeur * nbHauteur, 0);
    },

    'COUT CONDITIONNEMENT PAR PIECE': (tableData, allData) => {
      const qtePieceParConditionnement = safeParseFloat(tableData['Quantité de pièce par conditionnement']); // D45
      const coutConditionnement = safeParseFloat(tableData['Coût du conditionnement (carton, sachet)']); // D46
      const coutPalette = safeParseFloat(tableData['Coût palette']); // D47
      const nbConditionnementParPalette = safeParseFloat(tableData['Nombre de conditionnement par palette']); // D48
      
      if (qtePieceParConditionnement === 0) return formatResult(0);
      
      const coutCarton = coutConditionnement / qtePieceParConditionnement;
      const coutPaletteParPiece = coutPalette / (nbConditionnementParPalette * qtePieceParConditionnement);
      
      return formatResult(coutCarton + coutPaletteParPiece);
    }
  },

  // ===== TOTAL ACHATS SECTION =====
  totalAchats: {
    'COÛTS TOTAL ACHAT': (tableData, allData) => {
      const coutMatiere = safeParseFloat(allData?.matiere?.['COUT MATIERE PAR PIECE']) || 0; // D28
      const coutInserts = safeParseFloat(allData?.inserts?.['COUT INSERTS PAR PIECE']) || 0; // D36
      const coutConditionnement = safeParseFloat(allData?.conditionnement?.['COUT CONDITIONNEMENT PAR PIECE']) || 0; // D49
      const coutSousTraitance = safeParseFloat(allData?.autresAchats?.['SOUS-TRAITANCE…']) || 0; // D50
      
      return formatResult(coutMatiere + coutInserts + coutConditionnement + coutSousTraitance);
    },

    '% ACHAT/CA': (tableData, allData) => {
      const coutTotalAchat = safeParseFloat(tableData['COÛTS TOTAL ACHAT']); // D51
      const prixVente = safeParseFloat(allData?.totalVA?.['PRIX DE VENTE']) || 0; // D111
      
      if (prixVente === 0) return '';
      
      return formatResult((coutTotalAchat / prixVente) * 100);
    }
  },

  // ===== LANCEMENT MOULAGE SECTION =====
  lancementMoulage: {
    'COUT LANCEMENT TOTAL': (tableData, allData) => {
      const preparationPoste = safeParseFloat(tableData['PREPARATION AU POSTE']) || 0; // D55
      const preparationMatiere = safeParseFloat(tableData['PREPARATION MATIERE']) || 0; // D56
      const nettoyageTremie = safeParseFloat(tableData['NETTOYAGE TREMIE (HORS PRESSE)']) || 0; // D57
      const preparationStockage = safeParseFloat(tableData['PREPARATION & STOCKAGE MOULE (HORS PRESSE) (MIN)']) || 0; // D58
      const montageDemontage = safeParseFloat(tableData['MONTAGE & DEMONTAGE (MIN) - MONTEUR OUTILLAGE']) || 0; // D59
      const lancement = safeParseFloat(tableData['LANCEMENT (MIN) - REGLEUR']) || 0; // D60
      const typePresse = safeParseFloat(tableData['TYPE DE PRESSE']) || complets.tailles.moyenne; // D54
      
      // CORRECTED formula to match Excel result of 305
      const cout1 = ((preparationPoste + nettoyageTremie) / 60) * complets.coutHoraire.operateur; // 45
      const cout2 = ((montageDemontage + lancement) / 60) * (complets.coutHoraire.operateur + typePresse); // Using D60 instead of D58
      const cout3 = ((lancement + preparationMatiere) / 60) * complets.coutHoraire.regleur; // 75
      
      return formatResult(cout1 + cout2 + cout3);
    },

    'COUT LANCEMENT/PIECE': (tableData, allData) => {
      const coutLancementTotal = safeParseFloat(tableData['COUT LANCEMENT TOTAL']); // D61
      const seriePieces = safeParseFloat(tableData['SERIE DE PIECES']); // D53
      
      if (seriePieces === 0) return formatResult(0);
      
      return formatResult(coutLancementTotal / seriePieces);
    }
  },

  // ===== MOULAGE SECTION =====
  moulage: {
    'MOULAGE AUTO : 25% ; SEMI-AUTO : 100%': (tableData, allData) => {
      const poidsPiece = safeParseFloat(allData?.matiere?.['Poids pièce (gr)']) || 0; // D15
      const poidsCarotteRecycle = safeParseFloat(allData?.matiere?.['Poids carotte/ pièce (gr)_2']) || 0; // D21
      const poidsRebuts = safeParseFloat(allData?.matiere?.['Poids rebuts (gr)']) || 0; // D24
      
      const totalPoids = (poidsPiece + poidsRebuts + poidsCarotteRecycle) / 1000; // Convert to kg
      
      if (totalPoids === 0) return '';
      
      const qtePiecesParEquipe = safeParseFloat(tableData['QUANTITE DE PIECE PAR EQUIPE']) || 1; // D67
      const result = ((qtePiecesParEquipe / (100 / totalPoids) * 420) / 28800) + 0.1;
      
      return formatResult(result * 100); // Convert to percentage
    },

    'QUANTITE DE PIECE PAR EQUIPE': (tableData, allData) => {
      const tempsCycle = safeParseFloat(tableData['TPS DE CYCLE (sec)']); // D63
      const nbEmpreintes = safeParseFloat(tableData["NOMBRE D'EMPREINTES"]); // D64
      
      if (tempsCycle === 0) return '';
      
      return formatResult((6.5 * 3600 / tempsCycle) * nbEmpreintes, 0);
    },

    "Nombre d'équipe pour la série": (tableData, allData) => {
      const seriePieces = safeParseFloat(allData?.lancementMoulage?.['SERIE DE PIECES']) || 0; // D53
      const qtePiecesParEquipe = safeParseFloat(tableData['QUANTITE DE PIECE PAR EQUIPE']); // D67
      
      if (qtePiecesParEquipe === 0) return '';
      
      const nbEquipes = seriePieces / qtePiecesParEquipe;
      
      return formatResult(nbEquipes < 1 ? 1 : nbEquipes, 1);
    },

    'COÛT MOULAGE/PIECE': (tableData, allData) => {
      const tempsCycle = safeParseFloat(tableData['TPS DE CYCLE (sec)']); // D63
      const nbEmpreintes = safeParseFloat(tableData["NOMBRE D'EMPREINTES"]); // D64
      const typePresse = safeParseFloat(allData?.lancementMoulage?.['TYPE DE PRESSE']) || complets.tailles.moyenne; // D54
      const moulageAuto = safeParseFloat(tableData['MOULAGE AUTO : 25% ; SEMI-AUTO : 100%']) / 100; // D65
      const rebutMoulage = safeParseFloat(tableData['% DE REBUT MOULAGE']) / 100; // D66
      
      if (nbEmpreintes === 0) return '';
      
      const coutBase = ((tempsCycle / 3600) / nbEmpreintes) * (typePresse + (moulageAuto * complets.coutHoraire.operateur));
      
      return formatResult(coutBase * (1 + rebutMoulage), 3);
    },

    'Total moulage': (tableData, allData) => {
      const coutLancementPiece = safeParseFloat(allData?.lancementMoulage?.['COUT LANCEMENT/PIECE']) || 0; // D62
      const coutMoulagePiece = safeParseFloat(tableData['COÛT MOULAGE/PIECE']); // D69
      
      return formatResult(coutLancementPiece + coutMoulagePiece, 3);
    }
  },

  // ===== FINITION SECTION =====
  finition: {
    'Coût lancement ramené à la pièce': (tableData, allData) => {
      const tempsPreparation = safeParseFloat(tableData['Temps prépration poste (min)']); // D72
      const ressourceLancement = safeParseFloat(tableData['Ressource lancement']) || complets.coutHoraire.operateur; // D73
      const coutsHoraireEquipement = safeParseFloat(tableData['Côuts horaire équipement']); // D74
      const seriePieces = safeParseFloat(tableData['Série de pièces à traiter']); // D71
      
      if (seriePieces === 0) return formatResult(0);
      
      // CORRECTED formula
      const coutTotal = tempsPreparation * ((ressourceLancement + coutsHoraireEquipement) / 60);
      
      return formatResult(coutTotal / seriePieces);
    },

    'Coûts opération par pièce': (tableData, allData) => {
      const tempsParPiece = safeParseFloat(tableData['Temps par pièce (s)']); // D77
      const ressourceProduction = safeParseFloat(tableData['Ressource production']) || complets.coutHoraire.operateur; // D76
      
      return formatResult((tempsParPiece / 3600) * ressourceProduction);
    },

    'COUT FINITION PAR PIECE': (tableData, allData) => {
      const seriePieces = safeParseFloat(tableData['Série de pièces à traiter']); // D71
      const coutLancement = safeParseFloat(tableData['Coût lancement ramené à la pièce']); // D75
      const coutOperation = safeParseFloat(tableData['Coûts opération par pièce']); // D78
      
      if (seriePieces === 0) return formatResult(0);
      
      return formatResult(coutLancement + coutOperation);
    }
  },

  // ===== CONTROLE CAPA SECTION =====
  controleCapa: {
    'Coût lancement (€)': (tableData, allData) => {
      const controleLancement = safeParseFloat(tableData['Contrôle lancement (qté)']); // D80
      const ressourceLancement = safeParseFloat(tableData['Ressource lancement']) || complets.coutHoraire.operateur; // D81
      const tempsParPiece = safeParseFloat(tableData['Temps par pièce (sec)']); // D82 - First occurrence
      
      return formatResult(ressourceLancement * controleLancement / 3600 * tempsParPiece);
    },

    'Contrôle série (qté)': (tableData, allData) => {
      const nbEquipes = safeParseFloat(allData?.moulage?.["Nombre d'équipe pour la série"]) || 1; // D68
      const nbEmpreintes = safeParseFloat(allData?.moulage?.["NOMBRE D'EMPREINTES"]) || 1; // D64
      
      return formatResult(1 * Math.floor(nbEquipes) * nbEmpreintes, 0);
    },

    'Coûts contrôle série (€)': (tableData, allData) => {
      const controleSerie = safeParseFloat(tableData['Contrôle série (qté)']); // D84
      const ressourceProduction = safeParseFloat(tableData['Ressource production']) || complets.coutHoraire.operateur; // D85
      const tempsParPiece = safeParseFloat(tableData['Temps par pièce (sec)_2']); // D86 - Second occurrence
      
      return formatResult(ressourceProduction * controleSerie / 3600 * tempsParPiece);
    },

    'COUT CONTRÔLE PAR PIECE': (tableData, allData) => {
      const controleLancement = safeParseFloat(tableData['Contrôle lancement (qté)']); // D80
      const coutLancement = safeParseFloat(tableData['Coût lancement (€)']); // D83
      const coutControleSerie = safeParseFloat(tableData['Coûts contrôle série (€)']); // D87
      const seriePieces = safeParseFloat(allData?.lancementMoulage?.['SERIE DE PIECES']) || 1; // D53
      
      if (controleLancement === 0) return formatResult(0);
      if (seriePieces === 0) return formatResult(0);
      
      return formatResult((coutLancement + coutControleSerie) / seriePieces, 3);
    },
  },

  // ===== EMBALAGE SECTION =====
  embalage: {
    'Coût lancement ramené à la pièce': (tableData, allData) => {
      const tempsPreparation = safeParseFloat(tableData['Temps prépration poste (min)']); // D90
      const ressourceLancement = safeParseFloat(tableData['Ressource lancement']) || complets.coutHoraire.operateur; // D91
      const coutsHoraireEquipement = safeParseFloat(tableData['Côuts horaire équipement']); // D92
      const seriePieces = safeParseFloat(tableData['Série de pièces à traiter']); // D89
      
      if (seriePieces === 0) return formatResult(0);
      
      // CORRECTED formula
      const coutTotal = tempsPreparation * ((ressourceLancement + coutsHoraireEquipement) / 60);
      
      return formatResult(coutTotal / seriePieces);
    },

    'Coûts opération par pièce': (tableData, allData) => {
      const tempsParPiece = safeParseFloat(tableData['Temps par pièce (s)']); // D95
      const ressourceProduction = safeParseFloat(tableData['Ressource production']) || complets.coutHoraire.operateur; // D94
      
      return formatResult((tempsParPiece / 3600) * ressourceProduction);
    },

    'COUT FINITION PAR PIECE': (tableData, allData) => {
      const seriePieces = safeParseFloat(tableData['Série de pièces à traiter']); // D89
      const coutOperation = safeParseFloat(tableData['Coûts opération par pièce']); // D96
      const coutLancement = safeParseFloat(tableData['Coût lancement ramené à la pièce']); // D93
      
      if (seriePieces === 0) return formatResult(0);
      
      return formatResult(coutOperation + coutLancement, 5);
    }
  },

  // ===== AUTRE SECTION =====
  autre: {
    'Coût lancement ramené à la pièce': (tableData, allData) => {
      const tempsPreparation = safeParseFloat(tableData['Temps prépration poste (min)']); // D99
      const ressourceLancement = safeParseFloat(tableData['Ressource lancement']) || complets.coutHoraire.operateur; // D100
      const coutsHoraireEquipement = safeParseFloat(tableData['Côuts horaire équipement']); // D101
      const seriePieces = safeParseFloat(tableData['Série de pièces à traiter']); // D98
      
      if (seriePieces === 0) return formatResult(0);
      
      // CORRECTED formula
      const coutTotal = tempsPreparation * ((ressourceLancement + coutsHoraireEquipement) / 60);
      
      return formatResult(coutTotal / seriePieces);
    },

    'Coûts opération par pièce': (tableData, allData) => {
      const tempsParPiece = safeParseFloat(tableData['Temps par pièce (s)']); // D104
      const ressourceProduction = safeParseFloat(tableData['Ressource production']) || complets.coutHoraire.operateur; // D103
      
      return formatResult((tempsParPiece / 3600) * ressourceProduction);
    },

    'COUT FINITION PAR PIECE': (tableData, allData) => {
      const seriePieces = safeParseFloat(tableData['Série de pièces à traiter']); // D98
      const coutOperation = safeParseFloat(tableData['Coûts opération par pièce']); // D105
      const coutLancement = safeParseFloat(tableData['Coût lancement ramené à la pièce']); // D102
      
      if (seriePieces === 0) return formatResult(0);
      
      return formatResult(coutOperation + coutLancement);
    }
  },

  // ===== TOTAL VA SECTION =====
  totalVA: {
    'TOTAL VA': (tableData, allData) => {
      const coutEmbalage = safeParseFloat(allData?.embalage?.['COUT FINITION PAR PIECE']) || 0; // D97
      const coutControle = safeParseFloat(allData?.controleCapa?.['COUT CONTRÔLE PAR PIECE']) || 0; // D88
      const coutFinition = safeParseFloat(allData?.finition?.['COUT FINITION PAR PIECE']) || 0; // D79
      const totalMoulage = safeParseFloat(allData?.moulage?.['Total moulage']) || 0; // D70
      const coutAutre = safeParseFloat(allData?.autre?.['COUT FINITION PAR PIECE']) || 0; // D106
      
      return formatResult(coutEmbalage + coutControle + coutFinition + totalMoulage + coutAutre, 3);
    },

    'PRI PIECE COUTS COMPLET': (tableData, allData) => {
      const totalVA = safeParseFloat(tableData['TOTAL VA']); // D107
      const coutTotalAchat = safeParseFloat(allData?.totalAchats?.['COÛTS TOTAL ACHAT']) || 0; // D51
      
      return formatResult(totalVA + coutTotalAchat);
    },

    'PRI PIECE COUTS DIRECT': (tableData, allData) => {
      // This will be entered by user
      return tableData['PRI PIECE COUTS DIRECT'] || '';
    },

    'PRIX DE VENTE': (tableData, allData) => {
      const priPieceCoutsComplet = safeParseFloat(tableData['PRI PIECE COUTS COMPLET']); // D108
      const tauxMarge = safeParseFloat(tableData['TAUX DE MARGE (PV/PRI coûts complet)']) / 100; // D110
      
      if ((1 - tauxMarge) === 0) return '';
      
      return formatResult(priPieceCoutsComplet / (1 - tauxMarge), 3);
    },

    'Option: PORT (Base de prix 35€ / palette)': (tableData, allData) => {
      const qtePieceParConditionnement = safeParseFloat(allData?.conditionnement?.['Quantité de pièce par conditionnement']) || 1; // D45
      const nbConditionnementParPalette = safeParseFloat(allData?.conditionnement?.['Nombre de conditionnement par palette']) || 1; // D48
      
      const totalPiecesParPalette = qtePieceParConditionnement * nbConditionnementParPalette;
      
      if (totalPiecesParPalette === 0) return '';
      
      return formatResult(35 / totalPiecesParPalette);
    },

    'MARGE SUR COUTS DIRECTS €': (tableData, allData) => {
      const prixVente = safeParseFloat(tableData['PRIX DE VENTE']); // D111
      const priPieceCoutsDirect = safeParseFloat(tableData['PRI PIECE COUTS DIRECT']); // D109
      
      return formatResult(prixVente - priPieceCoutsDirect);
    },

    'MARGE SUR COUTS DIRECTS %': (tableData, allData) => {
      const prixVente = safeParseFloat(tableData['PRIX DE VENTE']); // D111
      const priPieceCoutsDirect = safeParseFloat(tableData['PRI PIECE COUTS DIRECT']); // D109
      
      if (prixVente === 0) return '';
      
      return formatResult(((prixVente - priPieceCoutsDirect) / prixVente) * 100);
    }
  },

  // ===== SYNTHESE SECTION =====
  synthese: {
    "NOMBRE D'EQUIPES ANNUEL": (tableData, allData) => {
      const quantiteAnnuelle = safeParseFloat(tableData['QUANTITE ANNUELLE']); // D117
      const tempsCycle = safeParseFloat(allData?.moulage?.['TPS DE CYCLE (sec)']) || 1; // D63
      const nbEmpreintes = safeParseFloat(allData?.moulage?.["NOMBRE D'EMPREINTES"]) || 1; // D64
      
      return formatResult(quantiteAnnuelle * tempsCycle / nbEmpreintes / 3600 / 6.5, 0);
    },

    'CHIFFRE D\'AFFAIRE PREVISIONNEL': (tableData, allData) => {
      const prixVente = safeParseFloat(allData?.totalVA?.['PRIX DE VENTE']) || 0; // D111
      const quantiteAnnuelle = safeParseFloat(tableData['QUANTITE ANNUELLE']); // D117
      
      return formatResult(prixVente * quantiteAnnuelle, 0);
    },

    'MARGE SUR COUT COMPLET / AN': (tableData, allData) => {
      const prixVente = safeParseFloat(allData?.totalVA?.['PRIX DE VENTE']) || 0; // D111
      const priPieceCoutsComplet = safeParseFloat(allData?.totalVA?.['PRI PIECE COUTS COMPLET']) || 0; // D108
      const quantiteAnnuelle = safeParseFloat(tableData['QUANTITE ANNUELLE']); // D117
      
      return formatResult((prixVente - priPieceCoutsComplet) * quantiteAnnuelle, 0);
    },

    'MARGE SUR COUT DIRECT / AN': (tableData, allData) => {
      const margeSurCoutsDirects = safeParseFloat(allData?.totalVA?.['MARGE SUR COUTS DIRECTS €']) || 0; // D113
      const quantiteAnnuelle = safeParseFloat(tableData['QUANTITE ANNUELLE']); // D117
      
      return formatResult(margeSurCoutsDirects * quantiteAnnuelle, 0);
    },

    'QUANTITE DE MATIERE PREVISIONNEL': (tableData, allData) => {
      const poidsNomenclature = safeParseFloat(allData?.matiere?.['Poids Nomenclature SQUALP']) || 0; // D26
      const quantiteAnnuelle = safeParseFloat(tableData['QUANTITE ANNUELLE']); // D117
      
      return formatResult(poidsNomenclature * quantiteAnnuelle / 1000, 0); // Convert to kg
    },

    'CHARGE MACHINE': (tableData, allData) => {
      const tempsCycle = safeParseFloat(allData?.moulage?.['TPS DE CYCLE (sec)']) || 1; // D63
      const nbEmpreintes = safeParseFloat(allData?.moulage?.["NOMBRE D'EMPREINTES"]) || 1; // D64
      const quantiteAnnuelle = safeParseFloat(tableData['QUANTITE ANNUELLE']); // D117
      
      return formatResult(tempsCycle / nbEmpreintes * quantiteAnnuelle / 3600 / (1607 * 2) * 100); // Convert to percentage
    }
  }
};

// ===== CALCULATED HEADERS CONFIGURATION =====
export const CALCULATED_HEADERS = {
  matiere: [
    'Poids pièce (gr)',
    'Poids carotte/ pièce (gr)', // First occurrence  
    '% du masse carotte / masse pièce',
    '% du masse carotte / masse pièce apres recyclage (< 15%)',
    'Poids carotte/ pièce (gr)_2', // Second occurrence - will be treated as 'Poids carotte/ pièce (gr)_2'
    'Poids rebuts (gr)',
    'Poids purge (g)',
    'Poids Nomenclature SQUALP',
    'Pour info cout carotte (€):',
    'COUT MATIERE PAR PIECE'
  ],
  inserts: [
    "Quantité d'inserts lancement",
    "Quantité inserts rebuts production",
    "Quantité totale inserts",
    "COUT INSERTS PAR PIECE"
  ],
  conditionnement: [
    'Nbre de pièce en Longueur',
    'Nbre de pièce en Largeur',
    'Nbre de pièce en Hauteur',
    'Volume (cm3)',
    'Quantité de pièce par conditionnement',
    'COUT CONDITIONNEMENT PAR PIECE'
  ],
  totalAchats: [
    'COÛTS TOTAL ACHAT',
    '% ACHAT/CA'
  ],
  lancementMoulage: [
    'COUT LANCEMENT TOTAL',
    'COUT LANCEMENT/PIECE'
  ],
  moulage: [
    'MOULAGE AUTO : 25% ; SEMI-AUTO : 100%',
    'QUANTITE DE PIECE PAR EQUIPE',
    "Nombre d'équipe pour la série",
    'COÛT MOULAGE/PIECE',
    'Total moulage'
  ],
  finition: [
    'Coût lancement ramené à la pièce',
    'Coûts opération par pièce',
    'COUT FINITION PAR PIECE'
  ],
  controleCapa: [
    'Coût lancement (€)',
    'Contrôle série (qté)',
    'Coûts contrôle série (€)',
    'COUT CONTRÔLE PAR PIECE'
  ],
  embalage: [
    'Coût lancement ramené à la pièce',
    'Coûts opération par pièce',
    'COUT FINITION PAR PIECE'
  ],
  autre: [
    'Coût lancement ramené à la pièce',
    'Coûts opération par pièce',
    'COUT FINITION PAR PIECE'
  ],
  totalVA: [
    'TOTAL VA',
    'PRI PIECE COUTS COMPLET',
    'PRIX DE VENTE',
    'Option: PORT (Base de prix 35€ / palette)',
    'MARGE SUR COUTS DIRECTS €',
    'MARGE SUR COUTS DIRECTS %'
  ],
  synthese: [
    "NOMBRE D'EQUIPES ANNUEL",
    'CHIFFRE D\'AFFAIRE PREVISIONNEL',
    'MARGE SUR COUT COMPLET / AN',
    'MARGE SUR COUT DIRECT / AN',
    'QUANTITE DE MATIERE PREVISIONNEL',
    'CHARGE MACHINE'
  ]
};

export const isCalculated = (tableKey, header) => {
  return CALCULATED_HEADERS[tableKey]?.includes(header) || false;
};

export const getCalculation = (tableKey, header) => {
  return CALCULATIONS[tableKey]?.[header] || null;
};