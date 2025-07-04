import LayersIcon from '@mui/icons-material/Layers';

export const MATIERE_HEADERS = [
  'Matière',
  'Désignation',
  'Référence Squalp',
  'Prix Matière (€/kg)',
  'Taux de colorant (%)',
  'Prix Colorant (€/kg)',
  'Volume (cm3)',
  'Densité (gr/cm3)',
  'Poids pièce (gr)', // CALCULATED
  'Poids carotte de la moulée (gr)',
  'Poids carotte/ pièce (gr)', // CALCULATED
  '% du masse carotte / masse pièce', // CALCULATED
  '% de recyclage carotte integrer',
  '% du masse carotte / masse pièce apres recyclage (< 15%)', // CALCULATED
  'Poids carotte/ pièce (gr)', // CALCULATED (duplicate field)
  'Poids purge nettoyage lancement série (gr)',
  'Quantité rebuts/lancement',
  'Poids rebuts (gr)', // CALCULATED
  'Poids purge (g)', // CALCULATED
  'Poids Nomenclature SQUALP', // CALCULATED
  'Pour info cout carotte (€):', // CALCULATED
  'COUT MATIERE PAR PIECE' // CALCULATED
];

export const INSERTS_HEADERS = [
  'Référence Squalp',
  'Coût insert',
  'Nombre d\'insert par pièce',
  'Contrôle insert',
  'Quantité d\'inserts lancement', // CALCULATED
  'Quantité inserts rebuts production', // CALCULATED
  'Quantité totale inserts', // CALCULATED
  'COUT INSERTS PAR PIECE' // CALCULATED
];

export const TABLES = [
  { 
    key: 'matiere', 
    title: 'Matière', 
    headers: MATIERE_HEADERS, 
    bgColor: '#f9fbe7', 
    textColor: '#33691e', 
    borderColor: '#c5e1a5', 
    icon: <LayersIcon /> 
  },
  { 
    key: 'inserts', 
    title: 'Inserts', 
    headers: INSERTS_HEADERS, 
    bgColor: '#e1f5fe', 
    textColor: '#01579b', 
    borderColor: '#81d4fa', 
    icon: <LayersIcon /> 
  }
];