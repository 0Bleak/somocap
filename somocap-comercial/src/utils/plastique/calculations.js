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
      const volume = safeParseFloat(tableData['Volume (cm3)']);
      const densite = safeParseFloat(tableData['Densité (gr/cm3)']);
      
      if (volume === 0 || densite === 0) return '';
      
      return formatResult(volume * densite);
    },

    'Poids carotte/ pièce (gr)': (tableData, allData) => {
      const poidsCarotteMoulee = safeParseFloat(tableData['Poids carotte de la moulée (gr)']);
      // For plastique, assume 1 empreinte if not specified
      return formatResult(poidsCarotteMoulee);
    },

    '% du masse carotte / masse pièce': (tableData, allData) => {
      const poidsPiece = safeParseFloat(tableData['Poids pièce (gr)']);
      const poidsCarotte = safeParseFloat(tableData['Poids carotte/ pièce (gr)']);
      
      if (poidsPiece === 0) return '';
      
      return formatResult((poidsCarotte / poidsPiece) * 100);
    },

    '% du masse carotte / masse pièce apres recyclage (< 15%)': (tableData, allData) => {
      const masseCrotteInitial = safeParseFloat(tableData['% du masse carotte / masse pièce']);
      const recyclage = safeParseFloat(tableData['% de recyclage carotte integrer']) / 100;
      
      const masseCarotteApresRecyclage = masseCrotteInitial * (1 - recyclage);
      
      return formatResult(Math.min(masseCarotteApresRecyclage, 15));
    },

    'Poids rebuts (gr)': (tableData, allData) => {
      const poidsPiece = safeParseFloat(tableData['Poids pièce (gr)']);
      const quantiteRebuts = safeParseFloat(tableData['Quantité rebuts/lancement']);
      
      return formatResult(poidsPiece * quantiteRebuts);
    },

    'Poids purge (g)': (tableData, allData) => {
      const poidsPurge = safeParseFloat(tableData['Poids purge nettoyage lancement série (gr)']);
      return formatResult(poidsPurge);
    },

    'Poids Nomenclature SQUALP': (tableData, allData) => {
      const poidsPiece = safeParseFloat(tableData['Poids pièce (gr)']);
      const poidsCarotte = safeParseFloat(tableData['Poids carotte/ pièce (gr)']);
      const poidsRebuts = safeParseFloat(tableData['Poids rebuts (gr)']);
      const poidsPurge = safeParseFloat(tableData['Poids purge (g)']);
      
      return formatResult(poidsPiece + poidsCarotte + poidsRebuts + poidsPurge);
    },

    'Pour info cout carotte (€):': (tableData, allData) => {
      const prixMatiere = safeParseFloat(tableData['Prix Matière (€/kg)']);
      const poidsCarotte = safeParseFloat(tableData['Poids carotte/ pièce (gr)']);
      const tauxColorant = safeParseFloat(tableData['Taux de colorant (%)']) / 100;
      const prixColorant = safeParseFloat(tableData['Prix Colorant (€/kg)']);
      
      const coutMatiere = (poidsCarotte / 1000) * prixMatiere;
      const coutColorant = (poidsCarotte / 1000) * tauxColorant * prixColorant;
      
      return formatResult(coutMatiere + coutColorant);
    },

    'COUT MATIERE PAR PIECE': (tableData, allData) => {
      const prixMatiere = safeParseFloat(tableData['Prix Matière (€/kg)']);
      const poidsNomenclature = safeParseFloat(tableData['Poids Nomenclature SQUALP']);
      const tauxColorant = safeParseFloat(tableData['Taux de colorant (%)']) / 100;
      const prixColorant = safeParseFloat(tableData['Prix Colorant (€/kg)']);
      
      const coutMatiere = (poidsNomenclature / 1000) * prixMatiere;
      const coutColorant = (poidsNomenclature / 1000) * tauxColorant * prixColorant;
      
      return formatResult(coutMatiere + coutColorant);
    }
  },

  // ===== INSERTS SECTION =====
  inserts: {
    "Quantité d'inserts lancement": (tableData, allData) => {
      const quantiteRebuts = safeParseFloat(allData?.matiere?.['Quantité rebuts/lancement']) || 0;
      const nombreInserts = safeParseFloat(tableData["Nombre d'insert par pièce"]);
      
      return formatResult(quantiteRebuts * nombreInserts, 0);
    },
    
    "Quantité inserts rebuts production": (tableData, allData) => {
      // For plastique, we'll assume 0 rebuts in production unless specified
      return formatResult(0, 0);
    },
    
    "Quantité totale inserts": (tableData, allData) => {
      const nombreInserts = safeParseFloat(tableData["Nombre d'insert par pièce"]);
      const quantiteLancement = safeParseFloat(tableData["Quantité d'inserts lancement"]);
      const quantiteRebuts = safeParseFloat(tableData["Quantité inserts rebuts production"]);
      
      // For plastique, assume we're calculating for 1 piece
      const quantiteNormale = nombreInserts;
      return formatResult(quantiteNormale + quantiteLancement + quantiteRebuts, 0);
    },
    
    "COUT INSERTS PAR PIECE": (tableData, allData) => {
      const coutInsert = safeParseFloat(tableData["Coût insert"]);
      const quantiteTotale = safeParseFloat(tableData["Quantité totale inserts"]);
      const controleInsert = safeParseFloat(tableData["Contrôle insert"]);
      
      if (coutInsert === 0) return formatResult(0);
      
      let cout = quantiteTotale * coutInsert;
      
      // Add control cost if specified (in hours, convert to cost)
      if (controleInsert > 0) {
        // Assume control cost is hourly rate * time
        cout += controleInsert * complets.coutHoraire.regleur;
      }
      
      return formatResult(cout);
    }
  }
};

// ===== CALCULATED HEADERS CONFIGURATION =====
export const CALCULATED_HEADERS = {
  matiere: [
    'Poids pièce (gr)',
    'Poids carotte/ pièce (gr)',
    '% du masse carotte / masse pièce',
    '% du masse carotte / masse pièce apres recyclage (< 15%)',
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
  ]
};

export const isCalculated = (tableKey, header) => {
  return CALCULATED_HEADERS[tableKey]?.includes(header) || false;
};

export const getCalculation = (tableKey, header) => {
  return CALCULATIONS[tableKey]?.[header] || null;
};