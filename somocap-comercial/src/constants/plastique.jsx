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

export const CONDITIONNEMENT_HEADERS = [
  'Référence Squalp',
  'Longueur pièce (en X)',
  'Largeur pièce (en Y)',
  'Hauteur pièce (en Z)',
  'Nbre de pièce en Longueur', // CALCULATED
  'Nbre de pièce en Largeur', // CALCULATED
  'Nbre de pièce en Hauteur', // CALCULATED
  'Volume (cm3)', // CALCULATED
  'Quantité de pièce par conditionnement', // CALCULATED
  'Coût du conditionnement (carton, sachet)',
  'Coût palette',
  'Nombre de conditionnement par palette',
  'COUT CONDITIONNEMENT PAR PIECE' // CALCULATED
];

export const AUTRES_ACHATS_HEADERS = [
  'SOUS-TRAITANCE…'
];

export const TOTAL_ACHATS_HEADERS = [
  'COÛTS TOTAL ACHAT', // CALCULATED
  '% ACHAT/CA' // CALCULATED
];

export const LANCEMENT_MOULAGE_HEADERS = [
  'SERIE DE PIECES',
  'TYPE DE PRESSE', // DROPDOWN
  'PREPARATION AU POSTE',
  'PREPARATION MATIERE',
  'NETTOYAGE TREMIE (HORS PRESSE)',
  'PREPARATION & STOCKAGE MOULE (HORS PRESSE) (MIN)',
  'MONTAGE & DEMONTAGE (MIN) - MONTEUR OUTILLAGE',
  'LANCEMENT (MIN) - REGLEUR',
  'COUT LANCEMENT TOTAL', // CALCULATED
  'COUT LANCEMENT/PIECE' // CALCULATED
];

export const MOULAGE_HEADERS = [
  'TPS DE CYCLE (sec)',
  "NOMBRE D'EMPREINTES",
  'MOULAGE AUTO : 25% ; SEMI-AUTO : 100%',
  '% DE REBUT MOULAGE',
  'QUANTITE DE PIECE PAR EQUIPE', // CALCULATED
  "Nombre d'équipe pour la série", // CALCULATED
  'COÛT MOULAGE/PIECE', // CALCULATED
  'Total moulage' // CALCULATED
];

export const FINITION_HEADERS = [
  'Série de pièces à traiter',
  'Temps prépration poste (min)',
  'Ressource lancement', // DROPDOWN
  'Côuts horaire équipement',
  'Coût lancement ramené à la pièce', // CALCULATED
  'Ressource production', // DROPDOWN
  'Temps par pièce (s)',
  'Coûts opération par pièce', // CALCULATED
  'COUT FINITION PAR PIECE' // CALCULATED
];

export const CONTROLE_CAPA_HEADERS = [
  'Contrôle lancement (qté)',
  'Ressource lancement', // DROPDOWN
  'Temps par pièce (sec)',
  'Coût lancement (€)', // CALCULATED
  'Contrôle série (qté)',
  'Ressource production', // DROPDOWN
  'Temps par pièce (sec)',
  'Coûts contrôle série (€)', // CALCULATED
  'COUT CONTRÔLE PAR PIECE' // CALCULATED
];

export const EMBALAGE_HEADERS = [
  'Série de pièces à traiter',
  'Temps prépration poste (min)',
  'Ressource lancement', // DROPDOWN
  'Côuts horaire équipement',
  'Coût lancement ramené à la pièce', // CALCULATED
  'Ressource production', // DROPDOWN
  'Temps par pièce (s)',
  'Coûts opération par pièce', // CALCULATED
  'COUT FINITION PAR PIECE' // CALCULATED
];

export const AUTRE_HEADERS = [
  'Série de pièces à traiter',
  'Temps prépration poste (min)',
  'Ressource lancement', // DROPDOWN
  'Côuts horaire équipement',
  'Coût lancement ramené à la pièce', // CALCULATED
  'Ressource production', // DROPDOWN
  'Temps par pièce (s)',
  'Coûts opération par pièce', // CALCULATED
  'COUT FINITION PAR PIECE' // CALCULATED
];

export const TOTAL_VA_HEADERS = [
  'TOTAL VA', // CALCULATED
  'PRI PIECE COUTS COMPLET', // CALCULATED
  'PRI PIECE COUTS DIRECT', // CALCULATED
  'TAUX DE MARGE (PV/PRI coûts complet)',
  'PRIX DE VENTE', // CALCULATED
  'Option: PORT (Base de prix 35€ / palette)', // CALCULATED
  'MARGE SUR COUTS DIRECTS €', // CALCULATED
  'MARGE SUR COUTS DIRECTS %' // CALCULATED
];

export const SYNTHESE_HEADERS = [
  'QUANTITE ANNUELLE',
  "NOMBRE D'EQUIPES ANNUEL", // CALCULATED
  'CHIFFRE D\'AFFAIRE PREVISIONNEL', // CALCULATED
  'MARGE SUR COUT COMPLET / AN', // CALCULATED
  'MARGE SUR COUT DIRECT / AN', // CALCULATED
  'QUANTITE DE MATIERE PREVISIONNEL', // CALCULATED
  'CHARGE MACHINE' // CALCULATED
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
  },
  { 
    key: 'conditionnement', 
    title: 'Conditionnement', 
    headers: CONDITIONNEMENT_HEADERS, 
    bgColor: '#fff3e0', 
    textColor: '#ef6c00', 
    borderColor: '#ffcc80', 
    icon: <LayersIcon /> 
  },
  { 
    key: 'autresAchats', 
    title: 'Autres Achats', 
    headers: AUTRES_ACHATS_HEADERS, 
    bgColor: '#f3e5f5', 
    textColor: '#6a1b9a', 
    borderColor: '#ce93d8', 
    icon: <LayersIcon /> 
  },
  { 
    key: 'totalAchats', 
    title: 'Total Achats', 
    headers: TOTAL_ACHATS_HEADERS, 
    bgColor: '#ede7f6', 
    textColor: '#512da8', 
    borderColor: '#b39ddb', 
    icon: <LayersIcon /> 
  },
  { 
    key: 'lancementMoulage', 
    title: 'Lancement Moulage', 
    headers: LANCEMENT_MOULAGE_HEADERS, 
    bgColor: '#fffde7', 
    textColor: '#f9a825', 
    borderColor: '#fff59d', 
    icon: <LayersIcon /> 
  },
  { 
    key: 'moulage', 
    title: 'Moulage', 
    headers: MOULAGE_HEADERS, 
    bgColor: '#ede7f6', 
    textColor: '#512da8', 
    borderColor: '#b39ddb', 
    icon: <LayersIcon /> 
  },
  { 
    key: 'finition', 
    title: 'Finition', 
    headers: FINITION_HEADERS, 
    bgColor: '#f1f8e9', 
    textColor: '#33691e', 
    borderColor: '#aed581', 
    icon: <LayersIcon /> 
  },
  { 
    key: 'controleCapa', 
    title: 'Contrôle CAPA', 
    headers: CONTROLE_CAPA_HEADERS, 
    bgColor: '#ede7f6', 
    textColor: '#512da8', 
    borderColor: '#b39ddb', 
    icon: <LayersIcon /> 
  },
  { 
    key: 'embalage', 
    title: 'Emballage', 
    headers: EMBALAGE_HEADERS, 
    bgColor: '#fff3e0', 
    textColor: '#ef6c00', 
    borderColor: '#ffcc80', 
    icon: <LayersIcon /> 
  },
  { 
    key: 'autre', 
    title: 'Autre', 
    headers: AUTRE_HEADERS, 
    bgColor: '#f3e5f5', 
    textColor: '#6a1b9a', 
    borderColor: '#ce93d8', 
    icon: <LayersIcon /> 
  },
  { 
    key: 'totalVA', 
    title: 'Total VA', 
    headers: TOTAL_VA_HEADERS, 
    bgColor: '#e1f5fe', 
    textColor: '#01579b', 
    borderColor: '#81d4fa', 
    icon: <LayersIcon /> 
  },
  { 
    key: 'synthese', 
    title: 'Synthèse', 
    headers: SYNTHESE_HEADERS, 
    bgColor: '#f9fbe7', 
    textColor: '#33691e', 
    borderColor: '#c5e1a5', 
    icon: <LayersIcon /> 
  }
];