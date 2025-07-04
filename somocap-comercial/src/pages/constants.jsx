import LayersIcon from '@mui/icons-material/Layers';

export const MATIERE_HEADERS = [
  'Matière',
  'Désignation',
  'Prix Matière (€/kg)',
  'Volume (cm3)',
  'Densité (gr/cm3)',
  'Poids pièce (g)',
  'Poids carotte coupe gomme (g)',
  'Poids purge nettoyage lancement (g)',
  'Quantité rebuts/lancement',
  'Poids perte (g)',
  'Total matières lancements ramené à la pièce (g)',
  'Poids Nomenclature SQUALP',
  'COUT MATIERE PAR PIECE'
];

export const INSERTS_HEADERS = [
  "Coût insert",
  "Nombre d'insert par pièce",
  "Contrôle insert (sec)",
  "Ressource contrôleur (€)",
  "Sablage (sec)",
  "Machine sablage + Opérateur (€)",
  "Adhérisation (sec)",
  "Préparation au poste (min)",
  "Machine de peinture + Opérateur (€)",
  "Adhérisation (gr)",
  "Cout au kilo de l'agent d'adhérisation (€)",
  "Quantité d'inserts lancement",
  "Quantité inserts rebuts production",
  "Quantité totale inserts",
  "COUT INSERTS PAR PIECE"
];

export const CONDITIONNEMENT_HEADERS = [
  'Référence Squalp',
  'Longueur pièce (en X)',
  'Largeur pièce (en Y)',
  'Hauteur pièce (en Z)',
  'Nbre de pièce en Longueur',
  'Nbre de pièce en Largeur',
  'Nbre de pièce en Hauteur',
  'Volume (cm3)',
  'Quantité de pièce par conditionnement',
  'Coût du conditionnement (carton, sachet)',
  'Coût palette',
  'Nombre de conditionnement par palette',
  'COUT CONDITIONNEMENT PAR PIECE'
];

export const ACHATS_HEADER = ['SOUS-TRAITANCE'];

export const TOTAL_ACHATS_HEADERS = ['COÛTS TOTAL ACHAT', '% ACHAT/CA'];

export const MELANGE_HEADERS = [
  'Poids du mélange (kg) multiple de 25kg',
  'Quantité de pièces par mélange',
  'Temps préparation poste (min)',
  'Temps de mélange pour un batch (70 min/25kg)',
  'Ressource préparation / Mélange',
  'Type de machine - Mélangeur à cylindre',
  'COUT MELANGE PAR PIECE',
];

export const EBAUCHE_HEADERS = [
  'Temps prépration poste (min)',
  'Type de machine',
  'Temps par pièce (s)',
  'Ressource production',
  'COUT FINITION PAR PIECE'
];

export const LANCEMENT_MOULAGE_HEADERS = [
  'SERIE DE PIECES',
  'TYPE DE PRESSE',
  'PREPARATION & STOCKAGE MOULE (HORS PRESSE) (MIN)',
  'MONTAGE & DEMONTAGE (MIN)',
  'LANCEMENT (MIN)',
  'NETTOYAGE MACHINE',
  'COUT LANCEMENT TOTAL',
  'COUT LANCEMENT/PIECE'
];

export const MOULAGE_HEADERS = [
  'TPS DE CYCLE (sec)',
  "NOMBRE D'EMPREINTES",
  'MOULAGE AUTO : 25% ; SEMI-AUTO : 100%',
  '% DE REBUT MOULAGE',
  'QUANTITE DE PIECE PAR EQUIPE',
  "Nombre d'équipe pour la série",
  'COÛT MOULAGE/PIECE',
  'Total moulage'
];

export const EBAVURAGE_HEADERS = [
  'Série de pièces à traiter',
  'Temps prépration poste (min)',
  'Ressource lancement',
  'Côuts horaire équipement',
  'Coût lancement ramené à la pièce',
  'Ressource production',
  'Temps par pièce (s)',
  'Coûts opération par pièce',
  'COUT FINITION PAR PIECE'
];

export const ETUVAGE_HEADERS = [
  'Série de pièces à traiter',
  'Type de machine',
  'COUT ETUVAGE PAR PIECE'
];

export const CONTROLE_CAPA_HEADERS = [
  'Série de pièces à traiter',
  'Temps prépration poste (min)',
  'Ressource lancement',
  'Côuts horaire équipement',
  'Coût lancement ramené à la pièce',
  'Ressource production',
  'Temps par pièce (s)',
  'Coûts opération par pièce',
  'COUT CONTRÔLE PAR PIECE'
];

export const EMBALAGE_HEADERS = [
  'Série de pièces à traiter',
  'Temps prépration poste (min)',
  'Ressource lancement',
  'Côuts horaire équipement',
  'Coût lancement ramené à la pièce',
  'Ressource production',
  'Temps par pièce (s)',
  'Coûts opération par pièce',
  'COUT FINITION PAR PIECE'
];

export const AUTRE_HEADERS = [
  'Série de pièces à traiter',
  'Temps prépration poste (min)',
  'Ressource lancement',
  'Côuts horaire équipement',
  'Coût lancement ramené à la pièce',
  'Ressource production',
  'Temps par pièce (s)',
  'Coûts opération par pièce',
  'COUT FINITION PAR PIECE'
];

export const TOTAL_VA_HEADERS = [
  'TOTAL VA',
  'PRI PIECE COUTS COMPLET',
  'PRI PIECE COUTS DIRECT',
  'TAUX DE MARGE (PV/PRI coûts complet)',
  'PRIX DE VENTE',
  'Option: PORT (Base de prix 35€ / palette)',
  'MARGE SUR COUTS DIRECTS €',
  'MARGE SUR COUTS DIRECTS %',
];


export const SYNTHESE_HEADERS = [
  'QUANTITE ANNUELLE',
  "NOMBRE D'EQUIPES ANNUEL",
  'CHIFFRE D\'AFFAIRE PREVISIONNEL',
  'MARGE SUR COUT COMPLET / AN',
  'MARGE SUR COUT DIRECT / AN',
  'QUANTITE DE MATIERE PREVISIONNEL',
  'CHARGE MACHINE'
];

export const TABLES = [
  { key: 'matiere', title: 'Matière', headers: MATIERE_HEADERS, bgColor: '#f9fbe7', textColor: '#33691e', borderColor: '#c5e1a5', icon: <LayersIcon /> },
  { key: 'inserts', title: 'Inserts', headers: INSERTS_HEADERS, bgColor: '#e1f5fe', textColor: '#01579b', borderColor: '#81d4fa', icon: <LayersIcon /> },
  { key: 'conditionnement', title: 'Conditionnement', headers: CONDITIONNEMENT_HEADERS, bgColor: '#fff3e0', textColor: '#ef6c00', borderColor: '#ffcc80', icon: <LayersIcon /> },
  { key: 'achats', title: 'Achats', headers: ACHATS_HEADER, bgColor: '#f3e5f5', textColor: '#6a1b9a', borderColor: '#ce93d8', icon: <LayersIcon /> },
  { key: 'totalAchats', title: 'Total Achats', headers: TOTAL_ACHATS_HEADERS, bgColor: '#ede7f6', textColor: '#512da8', borderColor: '#b39ddb', icon: <LayersIcon /> },
  { key: 'melange', title: 'Mélange', headers: MELANGE_HEADERS, bgColor: '#e0f7fa', textColor: '#006064', borderColor: '#4dd0e1', icon: <LayersIcon /> },
  { key: 'ebauche', title: 'Ebauche', headers: EBAUCHE_HEADERS, bgColor: '#fce4ec', textColor: '#880e4f', borderColor: '#f48fb1', icon: <LayersIcon /> },
  { key: 'lancementMoulage', title: 'Lancement Moulage', headers: LANCEMENT_MOULAGE_HEADERS, bgColor: '#fffde7', textColor: '#f9a825', borderColor: '#fff59d', icon: <LayersIcon /> },
  { key: 'moulage', title: 'Moulage', headers: MOULAGE_HEADERS, bgColor: '#ede7f6', textColor: '#512da8', borderColor: '#b39ddb', icon: <LayersIcon /> },
  { key: 'ebavurage', title: 'Ebavurage', headers: EBAVURAGE_HEADERS, bgColor: '#f1f8e9', textColor: '#33691e', borderColor: '#aed581', icon: <LayersIcon /> },
  { key: 'etuvage', title: 'Etuvage', headers: ETUVAGE_HEADERS, bgColor: '#fbe9e7', textColor: '#bf360c', borderColor: '#ffab91', icon: <LayersIcon /> },
  { key: 'controleCapa', title: 'Contrôle CAPA', headers: CONTROLE_CAPA_HEADERS, bgColor: '#ede7f6', textColor: '#512da8', borderColor: '#b39ddb', icon: <LayersIcon /> },
  { key: 'embalage', title: 'Emballage', headers: EMBALAGE_HEADERS, bgColor: '#fff3e0', textColor: '#ef6c00', borderColor: '#ffcc80', icon: <LayersIcon /> },
  { key: 'autre', title: 'Autre', headers: AUTRE_HEADERS, bgColor: '#f3e5f5', textColor: '#6a1b9a', borderColor: '#ce93d8', icon: <LayersIcon /> },
  { key: 'totalVA', title: 'Total VA', headers: TOTAL_VA_HEADERS, bgColor: '#e1f5fe', textColor: '#01579b', borderColor: '#81d4fa', icon: <LayersIcon /> },
  { key: 'synthese', title: 'Synthèse', headers: SYNTHESE_HEADERS, bgColor: '#f9fbe7', textColor: '#33691e', borderColor: '#c5e1a5', icon: <LayersIcon /> },
];