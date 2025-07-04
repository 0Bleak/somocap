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

const calculateDirectCosts = {
  // Mélange with direct costs
  melangeDirect: (tableData, allData) => {
    const poidsMelange = safeParseFloat(tableData['Poids du mélange (kg) multiple de 25kg']);
    const tempsPreparation = safeParseFloat(tableData['Temps préparation poste (min)']);
    const tempsBatch = safeParseFloat(tableData['Temps de mélange pour un batch (70 min/25kg)']);
    const ressource = safeParseFloat(tableData['Ressource préparation / Mélange']);
    const machine = safeParseFloat(tableData['Type de machine - Mélangeur à cylindre']);
    const seriePieces = safeParseFloat(allData?.lancementMoulage?.["SERIE DE PIECES"]) || 1;
    
    if (poidsMelange === 0 || seriePieces === 0) return 0;
    
    const coutPreparation = (tempsPreparation * (ressource + machine)) / 60;
    const coutBatch = (tempsBatch * (ressource + machine)) / 60;
    return (coutPreparation + coutBatch) / seriePieces;
  },

  // Ebauche with direct costs
  ebaucheDirect: (tableData, allData) => {
    const tempsPreparation = safeParseFloat(tableData['Temps prépration poste (min)']);
    const machine = directs.tailles.petite; // 6
    const tempsPiece = safeParseFloat(tableData['Temps par pièce (s)']);
    const ressource = directs.coutDirect.regleur; // 25
    const seriePieces = safeParseFloat(allData?.lancementMoulage?.["SERIE DE PIECES"]) || 1;
    const pourcentageRebut = safeParseFloat(allData?.moulage?.["% DE REBUT MOULAGE"]) / 100 || 0;
    
    const coutPreparation = (tempsPreparation * (machine + ressource)) / 60;
    const coutProduction = (tempsPiece * seriePieces * (1 + pourcentageRebut) * (machine + ressource)) / 3600;
    
    return (coutPreparation + coutProduction) / seriePieces;
  },

  // Lancement Moulage with direct costs
  lancementMoulageDirect: (tableData, allData) => {
    const preparation = safeParseFloat(tableData['PREPARATION & STOCKAGE MOULE (HORS PRESSE) (MIN)']);
    const montage = safeParseFloat(tableData['MONTAGE & DEMONTAGE (MIN)']);
    const lancement = safeParseFloat(tableData['LANCEMENT (MIN)']);
    const nettoyage = safeParseFloat(tableData['NETTOYAGE MACHINE']);
    const typePresse = directs.tailles.petite; // 6
    const coutRessourceMoule = directs.coutDirect.regleur; // 25
    const seriePieces = safeParseFloat(tableData['SERIE DE PIECES']) || 1;
    
    const coutPreparation = (preparation / 60) * coutRessourceMoule;
    const coutMontage = ((montage + lancement + nettoyage) / 60) * (coutRessourceMoule + typePresse);
    const coutTotal = coutPreparation + coutMontage;
    
    return coutTotal / seriePieces;
  },

  // Moulage with direct costs
  moulageDirect: (tableData, allData) => {
    const tempsCycle = safeParseFloat(tableData['TPS DE CYCLE (sec)']);
    const nombreEmpreintes = safeParseFloat(tableData["NOMBRE D'EMPREINTES"]);
    const autoSemi = safeParseFloat(tableData['MOULAGE AUTO : 25% ; SEMI-AUTO : 100%']) / 100;
    const pourcentageRebut = safeParseFloat(tableData['% DE REBUT MOULAGE']) / 100;
    const typePresse = directs.tailles.petite; // 6
    const coutOperateur = directs.coutDirect.operateur; // 25
    
    if (tempsCycle === 0 || nombreEmpreintes === 0) return 0;
    
    const tempsCycleParPiece = (tempsCycle / 3600) / nombreEmpreintes;
    return tempsCycleParPiece * (typePresse + (autoSemi * coutOperateur)) * (1 + pourcentageRebut);
  },

  // Ebavurage with direct costs
  ebavurageDirect: (tableData) => {
    const serie = safeParseFloat(tableData['Série de pièces à traiter']);
    const tempsPreparation = safeParseFloat(tableData['Temps prépration poste (min)']);
    const ressourceLancement = directs.coutDirect.regleur; // 25
    const equipement = directs.tailles.petite; // 6
    const tempsPiece = safeParseFloat(tableData['Temps par pièce (s)']);
    const ressourceProduction = directs.coutDirect.regleur; // 25
    
    if (serie === 0) return 0;
    
    const coutLancement = (tempsPreparation * (ressourceLancement + equipement)) / 60 / serie;
    const coutOperation = (tempsPiece / 3600) * ressourceProduction;
    
    return coutLancement + coutOperation;
  },

  // Etuvage with direct costs
  etuvageDirect: (tableData) => {
    const serie = safeParseFloat(tableData['Série de pièces à traiter']);
    const machine = directs.tailles.petite; // 6
    
    if (serie === 0) return 0;
    
    return machine / serie;
  },

  // Controle Capa with direct costs
  controleCapaDirect: (tableData, allData) => {
    const serie = safeParseFloat(tableData['Série de pièces à traiter']);
    const tempsPreparation = safeParseFloat(tableData['Temps prépration poste (min)']);
    const ressourceLancement = directs.coutDirect.regleur; // 25
    const equipement = directs.tailles.petite; // 6
    const tempsPiece = safeParseFloat(tableData['Temps par pièce (s)']);
    const ressourceProduction = directs.coutDirect.regleur; // 25
    const seriePrincipal = safeParseFloat(allData?.lancementMoulage?.["SERIE DE PIECES"]) || 1;
    
    if (serie === 0 || seriePrincipal === 0) return 0;
    
    const coutLancement = (tempsPreparation * (ressourceLancement + equipement)) / 60 / serie;
    const coutOperation = (tempsPiece / 3600) * ressourceProduction;
    const coutTotal = (coutLancement + coutOperation) * serie / seriePrincipal;
    
    return coutTotal;
  },

  // Embalage with direct costs
  embalageDirect: (tableData) => {
    const serie = safeParseFloat(tableData['Série de pièces à traiter']);
    const tempsPreparation = safeParseFloat(tableData['Temps prépration poste (min)']);
    const ressourceLancement = directs.coutDirect.regleur; // 25
    const equipement = directs.tailles.petite; // 6
    const tempsPiece = safeParseFloat(tableData['Temps par pièce (s)']);
    const ressourceProduction = directs.coutDirect.regleur; // 25
    
    if (serie === 0) return 0;
    
    const coutLancement = (tempsPreparation * (ressourceLancement + equipement)) / 60 / serie;
    const coutOperation = (tempsPiece / 3600) * ressourceProduction;
    
    return coutLancement + coutOperation;
  },

  // Autre with direct costs
  autreDirect: (tableData) => {
    const serie = safeParseFloat(tableData['Série de pièces à traiter']);
    const tempsPreparation = safeParseFloat(tableData['Temps prépration poste (min)']);
    const ressourceLancement = directs.coutDirect.regleur; // 25
    const equipement = directs.tailles.petite; // 6
    const tempsPiece = safeParseFloat(tableData['Temps par pièce (s)']);
    const ressourceProduction = directs.coutDirect.regleur; // 25
    
    if (serie === 0) return 0;
    
    const coutLancement = (tempsPreparation * (ressourceLancement + equipement)) / 60 / serie;
    const coutOperation = (tempsPiece / 3600) * ressourceProduction;
    
    return coutLancement + coutOperation;
  }
};

// Main calculations object
export const CALCULATIONS = {
  // ===== MATIÈRE SECTION =====
  matiere: {
    'Poids pièce (g)': (tableData, allData) => {
      const volume = safeParseFloat(tableData['Volume (cm3)']);
      const densite = safeParseFloat(tableData['Densité (gr/cm3)']);
      
      if (volume === 0 || densite === 0) return '';
      
      return formatResult(volume * densite);
    },
    
    'Poids perte (g)': (tableData, allData) => {
      const poidsPiece = safeParseFloat(tableData['Poids pièce (g)']);
      const quantiteRebuts = safeParseFloat(tableData['Quantité rebuts/lancement']);
      
      // Simplified formula based on Excel result
      return formatResult(poidsPiece * quantiteRebuts);
    },
    
    'Total matières lancements ramené à la pièce (g)': (tableData, allData) => {
      const poidsPiece = safeParseFloat(tableData['Poids pièce (g)']);
      const poidsCarotte = safeParseFloat(tableData['Poids carotte coupe gomme (g)']);
      const poidsPerte = safeParseFloat(tableData['Poids perte (g)']);
      
      const nombreEmpreintes = safeParseFloat(allData?.moulage?.["NOMBRE D'EMPREINTES"]) || 1;
      const pourcentageRebut = safeParseFloat(allData?.moulage?.["% DE REBUT MOULAGE"]) / 100 || 0;
      const seriePieces = safeParseFloat(allData?.lancementMoulage?.["SERIE DE PIECES"]) || 1;
      
      const poidsCarotteParPiece = poidsCarotte / nombreEmpreintes;
      const poidsUnitaire = poidsPiece + poidsCarotteParPiece;
      
      // Using the poidsPerte calculated above (27 instead of 39)
      const totalMatiere = (poidsUnitaire * pourcentageRebut * seriePieces + poidsPerte) / seriePieces;
      
      return formatResult(totalMatiere);
    },
    
    'Poids Nomenclature SQUALP': (tableData, allData) => {
      const poidsPiece = safeParseFloat(tableData['Poids pièce (g)']);
      const totalMatiere = safeParseFloat(tableData['Total matières lancements ramené à la pièce (g)']);
      
      // Simplified: just poidsPiece + totalMatiere
      return formatResult(poidsPiece + totalMatiere);
    },
    
    'COUT MATIERE PAR PIECE': (tableData, allData) => {
      const poidsPiece = safeParseFloat(tableData['Poids pièce (g)']);
      const poidsCarotte = safeParseFloat(tableData['Poids carotte coupe gomme (g)']);
      const totalMatiere = safeParseFloat(tableData['Total matières lancements ramené à la pièce (g)']);
      const prixMatiere = safeParseFloat(tableData['Prix Matière (€/kg)']);
      
      const nombreEmpreintes = safeParseFloat(allData?.moulage?.["NOMBRE D'EMPREINTES"]) || 1;
      
      const poidsCarotteParPiece = poidsCarotte / nombreEmpreintes;
      const poidsTotal = poidsPiece + poidsCarotteParPiece + totalMatiere;
      
      return formatResult(poidsTotal * (prixMatiere / 1000));
    },
  },

  // ===== INSERTS SECTION =====
  inserts: {
    "Quantité d'inserts lancement": (tableData, allData) => {
      const quantiteRebuts = safeParseFloat(allData?.matiere?.['Quantité rebuts/lancement']) || 0;
      const nombreInserts = safeParseFloat(tableData["Nombre d'insert par pièce"]);
      
      return formatResult(quantiteRebuts * nombreInserts, 0);
    },
    
    "Quantité inserts rebuts production": (tableData, allData) => {
      const seriePieces = safeParseFloat(allData?.lancementMoulage?.["SERIE DE PIECES"]) || 0;
      const pourcentageRebut = safeParseFloat(allData?.moulage?.["% DE REBUT MOULAGE"]) / 100 || 0;
      const nombreInserts = safeParseFloat(tableData["Nombre d'insert par pièce"]);
      
      return formatResult(seriePieces * pourcentageRebut * nombreInserts, 0);
    },
    
    "Quantité totale inserts": (tableData, allData) => {
      const seriePieces = safeParseFloat(allData?.lancementMoulage?.["SERIE DE PIECES"]) || 0;
      const nombreInserts = safeParseFloat(tableData["Nombre d'insert par pièce"]);
      const quantiteLancement = safeParseFloat(tableData["Quantité d'inserts lancement"]);
      const quantiteRebuts = safeParseFloat(tableData["Quantité inserts rebuts production"]);
      
      const quantiteNormale = seriePieces * nombreInserts;
      return formatResult(quantiteNormale + quantiteLancement + quantiteRebuts, 0);
    },
    
    "COUT INSERTS PAR PIECE": (tableData, allData) => {
      const coutInsert = safeParseFloat(tableData["Coût insert"]);
      const quantiteTotale = safeParseFloat(tableData["Quantité totale inserts"]);
      const controleInsert = safeParseFloat(tableData["Contrôle insert (sec)"]);
      const ressourceControleur = safeParseFloat(tableData["Ressource contrôleur (€)"]);
      const sablage = safeParseFloat(tableData["Sablage (sec)"]);
      const machineSablage = safeParseFloat(tableData["Machine sablage + Opérateur (€)"]);
      const adherisation = safeParseFloat(tableData["Adhérisation (sec)"]);
      const preparationPoste = safeParseFloat(tableData["Préparation au poste (min)"]);
      const machinePeinture = safeParseFloat(tableData["Machine de peinture + Opérateur (€)"]);
      const adherisationGr = safeParseFloat(tableData["Adhérisation (gr)"]);
      const coutAdherisation = safeParseFloat(tableData["Cout au kilo de l'agent d'adhérisation (€)"]);
      const nombreInserts = safeParseFloat(tableData["Nombre d'insert par pièce"]);
      
      const seriePieces = safeParseFloat(allData?.lancementMoulage?.["SERIE DE PIECES"]) || 1;
      
      let cout = 0;
      
      // Coût des inserts
      if (coutInsert === 0) {
        cout = 0;
      } else {
        cout = (quantiteTotale * coutInsert) / seriePieces;
      }
      
      // Add other costs
      cout += (controleInsert / 3600) * ressourceControleur;
      cout += (sablage / 3600) * machineSablage;
      cout += (adherisation / 3600) * machinePeinture;
      
      if (nombreInserts > 0 && seriePieces > 0) {
        cout += (preparationPoste / 60 * machinePeinture) / (nombreInserts * seriePieces);
      }
      
      cout += (coutAdherisation / 1000) * adherisationGr;
      
      return formatResult(cout);
    }
  },

  // ===== CONDITIONNEMENT SECTION =====

  conditionnement: {
    'Nbre de pièce en Longueur': (tableData) => {
      const longueur = safeParseFloat(tableData['Longueur pièce (en X)']);
      if (longueur === 0) return '';
      return Math.floor(442 / longueur).toString();
    },
    
    'Nbre de pièce en Largeur': (tableData) => {
      const largeur = safeParseFloat(tableData['Largeur pièce (en Y)']);
      if (largeur === 0) return '';
      return Math.floor(304 / largeur).toString();
    },
    
    'Nbre de pièce en Hauteur': (tableData) => {
      const hauteur = safeParseFloat(tableData['Hauteur pièce (en Z)']);
      if (hauteur === 0) return '';
      return Math.floor(239 / hauteur).toString();
    },
    
    'Volume (cm3)': (tableData) => {
      const longueur = safeParseFloat(tableData['Longueur pièce (en X)']);
      const largeur = safeParseFloat(tableData['Largeur pièce (en Y)']);
      const hauteur = safeParseFloat(tableData['Hauteur pièce (en Z)']);
      
      return formatResult((longueur * largeur * hauteur) / 1000);
    },
    
    'Quantité de pièce par conditionnement': (tableData) => {
      const nbreLongueur = safeParseFloat(tableData['Nbre de pièce en Longueur']);
      const nbreLargeur = safeParseFloat(tableData['Nbre de pièce en Largeur']);
      const nbreHauteur = safeParseFloat(tableData['Nbre de pièce en Hauteur']);
      
      return formatResult(nbreLongueur * nbreLargeur * nbreHauteur, 0);
    },
    
    'COUT CONDITIONNEMENT PAR PIECE': (tableData) => {
      const quantite = safeParseFloat(tableData['Quantité de pièce par conditionnement']);
      const coutConditionnement = safeParseFloat(tableData['Coût du conditionnement (carton, sachet)']);
      const coutPalette = safeParseFloat(tableData['Coût palette']);
      const nombreConditionnements = safeParseFloat(tableData['Nombre de conditionnement par palette']);
      
      if (quantite === 0) return '';
      
      let cout = coutConditionnement / quantite;
      
      if (nombreConditionnements > 0) {
        cout += coutPalette / (nombreConditionnements * quantite);
      }
      
      return formatResult(cout);
    }
  },

  // ===== TOTAL ACHATS SECTION =====
  totalAchats: {
    'COÛTS TOTAL ACHAT': (tableData, allData) => {
      const coutMatiere = safeParseFloat(allData?.matiere?.['COUT MATIERE PAR PIECE']) || 0;
      const coutInserts = safeParseFloat(allData?.inserts?.['COUT INSERTS PAR PIECE']) || 0;
      const coutConditionnement = safeParseFloat(allData?.conditionnement?.['COUT CONDITIONNEMENT PAR PIECE']) || 0;
      const sousTraitance = safeParseFloat(allData?.achats?.['SOUS-TRAITANCE']) || 0;
      
      return formatResult(coutMatiere + coutInserts + coutConditionnement + sousTraitance);
    },
    
    '% ACHAT/CA': (tableData, allData) => {
      const coutTotalAchat = safeParseFloat(tableData['COÛTS TOTAL ACHAT']);
      const prixVente = safeParseFloat(allData?.totalVA?.['PRIX DE VENTE']) || 0;
      
      if (coutTotalAchat === 0 || prixVente === 0) return '';
      
      return formatResult((coutTotalAchat / prixVente) * 100) + '%';
    }
  },

  // ===== MÉLANGE SECTION =====
  
  melange: {
    'Poids du mélange (kg) multiple de 25kg': (tableData, allData) => {
      const poidsPiece = safeParseFloat(allData?.matiere?.['Poids pièce (g)']) || 0;
      const totalMatiere = safeParseFloat(allData?.matiere?.['Total matières lancements ramené à la pièce (g)']) || 0;
      const poidsCarotte = safeParseFloat(allData?.matiere?.['Poids carotte coupe gomme (g)']) || 0;
      const nombreEmpreintes = safeParseFloat(allData?.moulage?.["NOMBRE D'EMPREINTES"]) || 1;
      const pourcentageRebut = safeParseFloat(allData?.moulage?.["% DE REBUT MOULAGE"]) / 100 || 0;
      const seriePieces = safeParseFloat(allData?.lancementMoulage?.["SERIE DE PIECES"]) || 0;
      
      if (seriePieces === 0) return '';
      
      const poidsCarotteParPiece = poidsCarotte / nombreEmpreintes;
      const poidsUnitaire = (poidsPiece + totalMatiere + poidsCarotteParPiece) * (1 + pourcentageRebut);
      const poidsTotal = (poidsUnitaire * seriePieces) / 1000;
      
      return (Math.ceil(poidsTotal / 25) * 25).toString();
    },
    
    'Quantité de pièces par mélange': (tableData, allData) => {
      const poidsMelange = safeParseFloat(tableData['Poids du mélange (kg) multiple de 25kg']);
      const poidsPiece = safeParseFloat(allData?.matiere?.['Poids pièce (g)']) || 0;
      const poidsCarotte = safeParseFloat(allData?.matiere?.['Poids carotte coupe gomme (g)']) || 0;
      const totalMatiere = safeParseFloat(allData?.matiere?.['Total matières lancements ramené à la pièce (g)']) || 0;
      const nombreEmpreintes = safeParseFloat(allData?.moulage?.["NOMBRE D'EMPREINTES"]) || 1;
      const pourcentageRebut = safeParseFloat(allData?.moulage?.["% DE REBUT MOULAGE"]) / 100 || 0;
      
      if (poidsMelange === 0) return '';
      
      const poidsCarotteParPiece = poidsCarotte / nombreEmpreintes;
      // Using the same formula as COUT MATIERE
      const poidsUnitaire = (poidsPiece + poidsCarotteParPiece + totalMatiere) * (1 + pourcentageRebut);
      
      return formatResult((poidsMelange * 1000) / poidsUnitaire, 0);
    },
    
    'COUT MELANGE PAR PIECE': (tableData, allData) => {
      const poidsMelange = safeParseFloat(tableData['Poids du mélange (kg) multiple de 25kg']);
      const tempsPreparation = safeParseFloat(tableData['Temps préparation poste (min)']);
      const tempsBatch = safeParseFloat(tableData['Temps de mélange pour un batch (70 min/25kg)']);
      const ressource = safeParseFloat(tableData['Ressource préparation / Mélange']);
      const machine = safeParseFloat(tableData['Type de machine - Mélangeur à cylindre']);
      const seriePieces = safeParseFloat(allData?.lancementMoulage?.["SERIE DE PIECES"]) || 1;
      
      if (poidsMelange === 0 || seriePieces === 0) return '';
      
      const coutPreparation = (tempsPreparation * (ressource + machine)) / 60;
      const coutBatch = (tempsBatch * (ressource + machine)) / 60;
      const coutTotal = (coutPreparation + coutBatch) / seriePieces;
      
      return formatResult(coutTotal);
    }
  },

  // ===== ÉBAUCHE SECTION =====
  ebauche: {
    'COUT FINITION PAR PIECE': (tableData, allData) => {
      const tempsPreparation = safeParseFloat(tableData['Temps prépration poste (min)']);
      const machine = safeParseFloat(tableData['Type de machine']);
      const tempsPiece = safeParseFloat(tableData['Temps par pièce (s)']);
      const ressource = safeParseFloat(tableData['Ressource production']);
      const seriePieces = safeParseFloat(allData?.lancementMoulage?.["SERIE DE PIECES"]) || 1;
      const pourcentageRebut = safeParseFloat(allData?.moulage?.["% DE REBUT MOULAGE"]) / 100 || 0;
      
      const coutPreparation = (tempsPreparation * (machine + ressource)) / 60;
      const coutProduction = (tempsPiece * seriePieces * (1 + pourcentageRebut) * (machine + ressource)) / 3600;
      
      return formatResult((coutPreparation + coutProduction) / seriePieces);
    }
  },

  // ===== LANCEMENT MOULAGE SECTION =====
  lancementMoulage: {
    'COUT LANCEMENT TOTAL': (tableData) => {
      const preparation = safeParseFloat(tableData['PREPARATION & STOCKAGE MOULE (HORS PRESSE) (MIN)']);
      const montage = safeParseFloat(tableData['MONTAGE & DEMONTAGE (MIN)']);
      const lancement = safeParseFloat(tableData['LANCEMENT (MIN)']);
      const nettoyage = safeParseFloat(tableData['NETTOYAGE MACHINE']);
      const typePresse = safeParseFloat(tableData['TYPE DE PRESSE']);
      
      // UPDATED: Use imported variable instead of hardcoded value
      const coutRessourceMoule = complets.coutHoraire.regleur;
      
      const coutPreparation = (preparation / 60) * coutRessourceMoule;
      const coutMontage = ((montage + lancement + nettoyage) / 60) * (coutRessourceMoule + typePresse);
      
      return formatResult(coutPreparation + coutMontage);
    },
    
    'COUT LANCEMENT/PIECE': (tableData) => {
      const seriePieces = safeParseFloat(tableData['SERIE DE PIECES']);
      const coutTotal = safeParseFloat(tableData['COUT LANCEMENT TOTAL']);
      
      if (seriePieces === 0) return '';
      
      return formatResult(coutTotal / seriePieces);
    }
  },

  // ===== MOULAGE SECTION =====
  moulage: {
    'QUANTITE DE PIECE PAR EQUIPE': (tableData) => {
      const tempsCycle = safeParseFloat(tableData['TPS DE CYCLE (sec)']);
      const nombreEmpreintes = safeParseFloat(tableData["NOMBRE D'EMPREINTES"]);
      
      if (tempsCycle === 0 || nombreEmpreintes === 0) return '';
      
      const heuresParEquipe = 6.5;
      const quantite = (heuresParEquipe * 3600 / tempsCycle) * nombreEmpreintes;
      
      return formatResult(quantite, 0);
    },
    
    "Nombre d'équipe pour la série": (tableData, allData) => {
      const seriePieces = safeParseFloat(allData?.lancementMoulage?.["SERIE DE PIECES"]) || 0;
      const quantiteParEquipe = safeParseFloat(tableData['QUANTITE DE PIECE PAR EQUIPE']);
      
      if (quantiteParEquipe === 0) return '';
      
      return formatResult(seriePieces / quantiteParEquipe);
    },
    
    'COÛT MOULAGE/PIECE': (tableData, allData) => {
      const tempsCycle = safeParseFloat(tableData['TPS DE CYCLE (sec)']);
      const nombreEmpreintes = safeParseFloat(tableData["NOMBRE D'EMPREINTES"]);
      const autoSemi = safeParseFloat(tableData['MOULAGE AUTO : 25% ; SEMI-AUTO : 100%']) / 100;
      const pourcentageRebut = safeParseFloat(tableData['% DE REBUT MOULAGE']) / 100;
      const typePresse = safeParseFloat(allData?.lancementMoulage?.['TYPE DE PRESSE']) || 0;
      
      if (tempsCycle === 0 || nombreEmpreintes === 0) return '';
      
      // UPDATED: Use imported variable instead of hardcoded value
      const coutOperateur = complets.coutHoraire.operateur;
      const tempsCycleParPiece = (tempsCycle / 3600) / nombreEmpreintes;
      const coutParPiece = tempsCycleParPiece * (typePresse + (autoSemi * coutOperateur)) * (1 + pourcentageRebut);
      
      return formatResult(coutParPiece);
    },
    
    'Total moulage': (tableData, allData) => {
      const coutLancement = safeParseFloat(allData?.lancementMoulage?.['COUT LANCEMENT/PIECE']) || 0;
      const coutMoulage = safeParseFloat(tableData['COÛT MOULAGE/PIECE']) || 0;
      const coutEbauche = safeParseFloat(allData?.ebauche?.['COUT FINITION PAR PIECE']) || 0;
      const coutMelange = safeParseFloat(allData?.melange?.['COUT MELANGE PAR PIECE']) || 0;
      
      return formatResult(coutLancement + coutMoulage + coutEbauche + coutMelange);
    }
  },

  // ===== EBAVURAGE SECTION =====
  ebavurage: {
    'Coût lancement ramené à la pièce': (tableData) => {
      const serie = safeParseFloat(tableData['Série de pièces à traiter']);
      const tempsPreparation = safeParseFloat(tableData['Temps prépration poste (min)']);
      const ressourceLancement = safeParseFloat(tableData['Ressource lancement']);
      const equipement = safeParseFloat(tableData['Côuts horaire équipement']);
      
      if (serie === 0) return '';
      
      const cout = (tempsPreparation * (ressourceLancement + equipement)) / 60 / serie;
      return formatResult(cout);
    },
    
    'Coûts opération par pièce': (tableData) => {
      const tempsPiece = safeParseFloat(tableData['Temps par pièce (s)']);
      const ressourceProduction = safeParseFloat(tableData['Ressource production']);
      
      const cout = (tempsPiece / 3600) * ressourceProduction;
      return formatResult(cout);
    },
    
    'COUT FINITION PAR PIECE': (tableData) => {
      const serie = safeParseFloat(tableData['Série de pièces à traiter']);
      const coutLancement = safeParseFloat(tableData['Coût lancement ramené à la pièce']);
      const coutOperation = safeParseFloat(tableData['Coûts opération par pièce']);
      
      if (serie === 0) return '';
      
      return formatResult(coutLancement + coutOperation);
    }
  },

  // ===== ETUVAGE SECTION =====
  etuvage: {
    'COUT ETUVAGE PAR PIECE': (tableData) => {
      const serie = safeParseFloat(tableData['Série de pièces à traiter']);
      const machine = safeParseFloat(tableData['Type de machine']);
      
      if (serie === 0) return '';
      
      return formatResult(machine / serie);
    }
  },

  // ===== CONTRÔLE CAPA SECTION =====
  controleCapa: {
    'Coût lancement ramené à la pièce': (tableData) => {
      const serie = safeParseFloat(tableData['Série de pièces à traiter']);
      const tempsPreparation = safeParseFloat(tableData['Temps prépration poste (min)']);
      const ressourceLancement = safeParseFloat(tableData['Ressource lancement']);
      const equipement = safeParseFloat(tableData['Côuts horaire équipement']);
      
      if (serie === 0) return '';
      
      const cout = (tempsPreparation * (ressourceLancement + equipement)) / 60 / serie;
      return formatResult(cout);
    },
    
    'Coûts opération par pièce': (tableData) => {
      const tempsPiece = safeParseFloat(tableData['Temps par pièce (s)']);
      const ressourceProduction = safeParseFloat(tableData['Ressource production']);
      
      const cout = (tempsPiece / 3600) * ressourceProduction;
      return formatResult(cout);
    },
    
    'COUT CONTRÔLE PAR PIECE': (tableData, allData) => {
      const serie = safeParseFloat(tableData['Série de pièces à traiter']);
      const coutLancement = safeParseFloat(tableData['Coût lancement ramené à la pièce']);
      const coutOperation = safeParseFloat(tableData['Coûts opération par pièce']);
      const seriePrincipal = safeParseFloat(allData?.lancementMoulage?.["SERIE DE PIECES"]) || 1;
      
      if (serie === 0 || seriePrincipal === 0) return '';
      
      const coutTotal = (coutLancement + coutOperation) * serie / seriePrincipal;
      return formatResult(coutTotal);
    }
  },

  // ===== EMBALLAGE SECTION =====
  embalage: {
    'Coût lancement ramené à la pièce': (tableData) => {
      const serie = safeParseFloat(tableData['Série de pièces à traiter']);
      const tempsPreparation = safeParseFloat(tableData['Temps prépration poste (min)']);
      const ressourceLancement = safeParseFloat(tableData['Ressource lancement']);
      const equipement = safeParseFloat(tableData['Côuts horaire équipement']);
      
      if (serie === 0) return '';
      
      const cout = (tempsPreparation * (ressourceLancement + equipement)) / 60 / serie;
      return formatResult(cout);
    },
    
    'Coûts opération par pièce': (tableData) => {
      const tempsPiece = safeParseFloat(tableData['Temps par pièce (s)']);
      const ressourceProduction = safeParseFloat(tableData['Ressource production']);
      
      const cout = (tempsPiece / 3600) * ressourceProduction;
      return formatResult(cout);
    },
    
    'COUT FINITION PAR PIECE': (tableData) => {
      const serie = safeParseFloat(tableData['Série de pièces à traiter']);
      const coutLancement = safeParseFloat(tableData['Coût lancement ramené à la pièce']);
      const coutOperation = safeParseFloat(tableData['Coûts opération par pièce']);
      
      if (serie === 0) return '';
      
      return formatResult(coutLancement + coutOperation);
    }
  },

  // ===== AUTRE SECTION =====
  autre: {
    'Coût lancement ramené à la pièce': (tableData) => {
      const serie = safeParseFloat(tableData['Série de pièces à traiter']);
      const tempsPreparation = safeParseFloat(tableData['Temps prépration poste (min)']);
      const ressourceLancement = safeParseFloat(tableData['Ressource lancement']);
      const equipement = safeParseFloat(tableData['Côuts horaire équipement']);
      
      if (serie === 0) return '';
      
      const cout = (tempsPreparation * (ressourceLancement + equipement)) / 60 / serie;
      return formatResult(cout);
    },
    
    'Coûts opération par pièce': (tableData) => {
      const tempsPiece = safeParseFloat(tableData['Temps par pièce (s)']);
      const ressourceProduction = safeParseFloat(tableData['Ressource production']);
      
      const cout = (tempsPiece / 3600) * ressourceProduction;
      return formatResult(cout);
    },
    
    'COUT FINITION PAR PIECE': (tableData) => {
      const serie = safeParseFloat(tableData['Série de pièces à traiter']);
      const coutLancement = safeParseFloat(tableData['Coût lancement ramené à la pièce']);
      const coutOperation = safeParseFloat(tableData['Coûts opération par pièce']);
      
      if (serie === 0) return '';
      
      return formatResult(coutLancement + coutOperation);
    }
  },

  // ===== TOTAL VA SECTION =====
  totalVA: {
    'TOTAL VA': (tableData, allData) => {
      const ebavurage = safeParseFloat(allData?.ebavurage?.['COUT FINITION PAR PIECE']) || 0;
      const etuvage = safeParseFloat(allData?.etuvage?.['COUT ETUVAGE PAR PIECE']) || 0;
      const controle = safeParseFloat(allData?.controleCapa?.['COUT CONTRÔLE PAR PIECE']) || 0;
      const embalage = safeParseFloat(allData?.embalage?.['COUT FINITION PAR PIECE']) || 0;
      const autre = safeParseFloat(allData?.autre?.['COUT FINITION PAR PIECE']) || 0;
      const moulageTotal = safeParseFloat(allData?.moulage?.['Total moulage']) || 0;
      
      return formatResult(ebavurage + etuvage + controle + embalage + autre + moulageTotal);
    },
    
    'PRI PIECE COUTS COMPLET': (tableData, allData) => {
      const totalVA = safeParseFloat(tableData['TOTAL VA']);
      const coutTotalAchat = safeParseFloat(allData?.totalAchats?.['COÛTS TOTAL ACHAT']) || 0;
      
      return formatResult(totalVA + coutTotalAchat);
    },
'PRI PIECE COUTS DIRECT': (tableData, allData) => {
  // Get COÛTS TOTAL ACHAT
  const coutTotalAchat = safeParseFloat(allData?.totalAchats?.['COÛTS TOTAL ACHAT']) || 0;
  
  const seriePieces = safeParseFloat(allData?.lancementMoulage?.["SERIE DE PIECES"]) || 1;
  const pourcentageRebut = safeParseFloat(allData?.moulage?.["% DE REBUT MOULAGE"]) / 100 || 0;
  
  // 3. LANCEMENT MOULAGE with direct costs
  const preparationLancement = safeParseFloat(allData?.lancementMoulage?.['PREPARATION & STOCKAGE MOULE (HORS PRESSE) (MIN)']) || 0;
  const montageLancement = safeParseFloat(allData?.lancementMoulage?.['MONTAGE & DEMONTAGE (MIN)']) || 0;
  const lancementTime = safeParseFloat(allData?.lancementMoulage?.['LANCEMENT (MIN)']) || 0;
  const nettoyageLancement = safeParseFloat(allData?.lancementMoulage?.['NETTOYAGE MACHINE']) || 0;
  
  const lancementDirectCost = seriePieces === 0 ? 0 :
    ((preparationLancement / 60) * directs.coutDirect.regleur + 
     ((montageLancement + lancementTime + nettoyageLancement) / 60) * (directs.coutDirect.regleur + directs.tailles.moyenne)) / seriePieces;
  
  // 4. MOULAGE with direct costs
  const tempsCycle = safeParseFloat(allData?.moulage?.['TPS DE CYCLE (sec)']) || 0;
  const nombreEmpreintes = safeParseFloat(allData?.moulage?.["NOMBRE D'EMPREINTES"]) || 1;
  const autoSemi = safeParseFloat(allData?.moulage?.['MOULAGE AUTO : 25% ; SEMI-AUTO : 100%']) / 100 || 0;
  
  const moulageDirectCost = (tempsCycle === 0 || nombreEmpreintes === 0) ? 0 :
    (tempsCycle / 3600 / nombreEmpreintes) * (directs.tailles.moyenne + (autoSemi * directs.coutDirect.operateur)) * (1 + pourcentageRebut);
  
  // TOTAL MOULAGE = lancement + moulage ONLY
  const totalMoulageDirectCost = lancementDirectCost + moulageDirectCost;
  
  // 5. EBAVURAGE with direct costs
  const serieEbavurage = safeParseFloat(allData?.ebavurage?.['Série de pièces à traiter']) || 1;
  const tempsPreparationEbavurage = safeParseFloat(allData?.ebavurage?.['Temps prépration poste (min)']) || 0;
  const tempsPieceEbavurage = safeParseFloat(allData?.ebavurage?.['Temps par pièce (s)']) || 0;
  
  const ebavurageDirectCost = serieEbavurage === 0 ? 0 :
    (tempsPreparationEbavurage * (directs.coutDirect.regleur + directs.tailles.petite)) / 60 / serieEbavurage +
    (tempsPieceEbavurage / 3600) * directs.coutDirect.regleur;
  
  // 6. ETUVAGE with direct costs
  const serieEtuvage = safeParseFloat(allData?.etuvage?.['Série de pièces à traiter']) || 1;
  const etuvageDirectCost = serieEtuvage === 0 ? 0 : directs.tailles.petite / serieEtuvage;
  
  // 7. CONTROLE CAPA with direct costs
  const serieControleCapa = safeParseFloat(allData?.controleCapa?.['Série de pièces à traiter']) || 1;
  const tempsPreparationControleCapa = safeParseFloat(allData?.controleCapa?.['Temps prépration poste (min)']) || 0;
  const tempsPieceControleCapa = safeParseFloat(allData?.controleCapa?.['Temps par pièce (s)']) || 0;
  
  const controleCapaDirectCost = (serieControleCapa === 0 || seriePieces === 0) ? 0 :
    ((tempsPreparationControleCapa * (directs.coutDirect.regleur + directs.tailles.petite)) / 60 / serieControleCapa +
     (tempsPieceControleCapa / 3600) * directs.coutDirect.regleur) * serieControleCapa / seriePieces;
  
  // 8. EMBALAGE with direct costs
  const serieEmbalage = safeParseFloat(allData?.embalage?.['Série de pièces à traiter']) || 1;
  const tempsPreparationEmbalage = safeParseFloat(allData?.embalage?.['Temps prépration poste (min)']) || 0;
  const tempsPieceEmbalage = safeParseFloat(allData?.embalage?.['Temps par pièce (s)']) || 0;
  
  const embalageDirectCost = serieEmbalage === 0 ? 0 :
    (tempsPreparationEmbalage * (directs.coutDirect.regleur + directs.tailles.petite)) / 60 / serieEmbalage +
    (tempsPieceEmbalage / 3600) * directs.coutDirect.regleur;
  
  // 9. AUTRE with direct costs
  const serieAutre = safeParseFloat(allData?.autre?.['Série de pièces à traiter']) || 1;
  const tempsPreparationAutre = safeParseFloat(allData?.autre?.['Temps prépration poste (min)']) || 0;
  const tempsPieceAutre = safeParseFloat(allData?.autre?.['Temps par pièce (s)']) || 0;
  
  const autreDirectCost = serieAutre === 0 ? 0 :
    (tempsPreparationAutre * (directs.coutDirect.regleur + directs.tailles.petite)) / 60 / serieAutre +
    (tempsPieceAutre / 3600) * directs.coutDirect.regleur;
  
  // FINAL CALCULATION: COÛTS TOTAL ACHAT + total moulage + all other finishing costs
  // DO NOT add melange and ebauche separately!
  const totalDirectCost = coutTotalAchat + totalMoulageDirectCost + ebavurageDirectCost + etuvageDirectCost + controleCapaDirectCost + embalageDirectCost + autreDirectCost;
  
  return formatResult(totalDirectCost);
},
'PRIX DE VENTE': (tableData) => {
      const priCoutComplet = safeParseFloat(tableData['PRI PIECE COUTS COMPLET']);
      const tauxMarge = safeParseFloat(tableData['TAUX DE MARGE (PV/PRI coûts complet)']) / 100;
      
      if (tauxMarge >= 1) return '';
      
      return formatResult(priCoutComplet / (1 - tauxMarge));
    },
    
    'Option: PORT (Base de prix 35€ / palette)': (tableData, allData) => {
      const quantiteConditionnement = safeParseFloat(allData?.conditionnement?.['Quantité de pièce par conditionnement']) || 0;
      const nombreConditionnements = safeParseFloat(allData?.conditionnement?.['Nombre de conditionnement par palette']) || 0;
      
      if (quantiteConditionnement === 0 || nombreConditionnements === 0) return '';
      
      return formatResult(35 / (quantiteConditionnement * nombreConditionnements));
    },
    
    'MARGE SUR COUTS DIRECTS €': (tableData) => {
      const prixVente = safeParseFloat(tableData['PRIX DE VENTE']);
      const priCoutDirect = safeParseFloat(tableData['PRI PIECE COUTS DIRECT']);
      
      return formatResult(prixVente - priCoutDirect);
    },
    
    'MARGE SUR COUTS DIRECTS %': (tableData) => {
      const prixVente = safeParseFloat(tableData['PRIX DE VENTE']);
      const priCoutDirect = safeParseFloat(tableData['PRI PIECE COUTS DIRECT']);
      
      if (prixVente === 0) return '';
      
      return formatResult(((prixVente - priCoutDirect) / prixVente) * 100) + '%';
    }
  },

  // ===== SYNTHÈSE SECTION =====
  synthese: {
    "NOMBRE D'EQUIPES ANNUEL": (tableData, allData) => {
      const quantiteAnnuelle = safeParseFloat(tableData['QUANTITE ANNUELLE']);
      const tempsCycle = safeParseFloat(allData?.moulage?.['TPS DE CYCLE (sec)']) || 0;
      const nombreEmpreintes = safeParseFloat(allData?.moulage?.["NOMBRE D'EMPREINTES"]) || 1;
      
      if (tempsCycle === 0 || nombreEmpreintes === 0) return '';
      
      const heuresAnnuelles = 6.5;
      const nombreEquipes = (quantiteAnnuelle * tempsCycle) / (nombreEmpreintes * 3600 * heuresAnnuelles);
      
      return formatResult(nombreEquipes);
    },
    
 'CHIFFRE D\'AFFAIRE PREVISIONNEL': (tableData, allData) => {
  const quantiteAnnuelle = safeParseFloat(tableData['QUANTITE ANNUELLE']);
  const prixVente = safeParseFloat(allData?.totalVA?.['PRIX DE VENTE']) || 0;
  
  // Check if this needs adjustment based on your Excel
  return formatResult(prixVente * quantiteAnnuelle);
},
    
    'MARGE SUR COUT COMPLET / AN': (tableData, allData) => {
      const quantiteAnnuelle = safeParseFloat(tableData['QUANTITE ANNUELLE']);
      const prixVente = safeParseFloat(allData?.totalVA?.['PRIX DE VENTE']) || 0;
      const priCoutComplet = safeParseFloat(allData?.totalVA?.['PRI PIECE COUTS COMPLET']) || 0;
      
      const margeUnitaire = prixVente - priCoutComplet;
      return formatResult(margeUnitaire * quantiteAnnuelle);
    },
    
    'MARGE SUR COUT DIRECT / AN': (tableData, allData) => {
      const quantiteAnnuelle = safeParseFloat(tableData['QUANTITE ANNUELLE']);
      const margeCoutDirect = safeParseFloat(allData?.totalVA?.['MARGE SUR COUTS DIRECTS €']) || 0;
      
      return formatResult(margeCoutDirect * quantiteAnnuelle);
    },
    
 'QUANTITE DE MATIERE PREVISIONNEL': (tableData, allData) => {
  const quantiteAnnuelle = safeParseFloat(tableData['QUANTITE ANNUELLE']);
  const poidsNomenclature = safeParseFloat(allData?.matiere?.['Poids Nomenclature SQUALP']) || 0;
  
  // Using Poids Nomenclature SQUALP
  return formatResult((poidsNomenclature * quantiteAnnuelle) / 1000);
},
    
    'CHARGE MACHINE': (tableData, allData) => {
      const quantiteAnnuelle = safeParseFloat(tableData['QUANTITE ANNUELLE']);
      const tempsCycle = safeParseFloat(allData?.moulage?.['TPS DE CYCLE (sec)']) || 0;
      const nombreEmpreintes = safeParseFloat(allData?.moulage?.["NOMBRE D'EMPREINTES"]) || 1;
      
      if (tempsCycle === 0 || nombreEmpreintes === 0) return '';
      
      const heuresAnnuellesDisponibles = 1607 * 2;
      const charge = (tempsCycle / nombreEmpreintes * quantiteAnnuelle) / 3600 / heuresAnnuellesDisponibles;
      
      return formatResult(charge * 100) + '%';
    }
  }
};










// ===== CALCULATED HEADERS CONFIGURATION =====
export const CALCULATED_HEADERS = {
  matiere: [
    'Poids pièce (g)', 
    'Poids perte (g)', 
    'Total matières lancements ramené à la pièce (g)', 
    'Poids Nomenclature SQUALP',
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
  achats: [],
  totalAchats: [
    'COÛTS TOTAL ACHAT',
    '% ACHAT/CA'
  ],
  melange: [
    'Poids du mélange (kg) multiple de 25kg',
    'Quantité de pièces par mélange',
    'COUT MELANGE PAR PIECE'
  ],
  ebauche: [
    'COUT FINITION PAR PIECE'
  ],
  lancementMoulage: [
    'COUT LANCEMENT TOTAL',
    'COUT LANCEMENT/PIECE'
  ],
  moulage: [
    'QUANTITE DE PIECE PAR EQUIPE',
    "Nombre d'équipe pour la série",
    'COÛT MOULAGE/PIECE',
    'Total moulage'
  ],
  ebavurage: [
    'Coût lancement ramené à la pièce',
    'Coûts opération par pièce',
    'COUT FINITION PAR PIECE'
  ],
  etuvage: [
    'COUT ETUVAGE PAR PIECE'
  ],
  controleCapa: [
    'Coût lancement ramené à la pièce',
    'Coûts opération par pièce',
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
    'PRI PIECE COUTS DIRECT',
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