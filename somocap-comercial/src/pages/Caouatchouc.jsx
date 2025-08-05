import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Button, Paper, Typography, TextField,
  MenuItem, Select, FormControl, InputLabel, AppBar, Toolbar, Chip, Badge, IconButton,
  Alert, Breadcrumbs, Link
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import ImageIcon from '@mui/icons-material/Image';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import CalculateIcon from '@mui/icons-material/Calculate';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { TABLES } from './constants';
import { isCalculated, getCalculation } from '../utils/calculations';
import { complets, directs, cout_machine } from '../utils/variables';
import { generateWordReport, downloadBlob } from '../utils/wordExport';
import DirectCostCalculatorDialog from '../pages/DirectCostCalculatorDialog';
import ReportConfigDialog from './ReportConfigDialog';

const DROPDOWN_OPTIONS = {
  ebauche: {
    'Type de machine': [
      { label: 'barwel', value: cout_machine },
      { label: 'trancheuse', value: cout_machine },
      { label: 'massicot', value: cout_machine }
    ],
    'Ressource production': [
      { label: 'operateur', value: complets.coutHoraire.operateur },
      { label: 'regleur', value: complets.coutHoraire.regleur }
    ]
  },
  lancementMoulage: {
    'TYPE DE PRESSE': [
      { label: 'Compression Petite (P4 P5 P6 P11 P12)', value: complets.tailles.petite },
      { label: 'Compression Grosse (P10)', value: complets.tailles.grosse },
      { label: 'Injection Petite (REP4 REP6 REP8)', value: complets.tailles.moyenne },
      { label: 'Injection Grosse (REP7 + MAPLAN)', value: complets.tailles.moyenne }
    ]
  },
  ebavurage: {
    'Ressource lancement': [
      { label: 'regleur', value: complets.coutHoraire.regleur },
      { label: 'operateur', value: complets.coutHoraire.operateur },
      { label: 'finition', value: complets.coutHoraire.finition }
    ],
    'Côuts horaire équipement': [
      { label: 'crynogenie', value: complets.coutHoraire.cryo },
      { label: 'no_crynogenie', value: '' }
    ],
    'Ressource production': [
      { label: 'regleur', value: complets.coutHoraire.regleur },
      { label: 'operateur', value: complets.coutHoraire.operateur },
      { label: 'finition', value: complets.coutHoraire.finition }
    ]
  },
  etuvage: {
    'Type de machine': [
      { label: 'Etuve 120 min 200°C', value: 18.00 },
      { label: 'Etuve 240 min 200°C', value: 30.00 },
      { label: 'Etuve 600 min 200°C', value: 66.00 },
      { label: 'Etuve 960 min 200°C', value: 102.00 }
    ]
  },
  controleCapa: {
    'Ressource lancement': [
      { label: 'regleur', value: complets.coutHoraire.regleur },
      { label: 'operateur', value: complets.coutHoraire.operateur },
      { label: 'finition', value: complets.coutHoraire.finition }
    ],
    'Ressource production': [
      { label: 'regleur', value: complets.coutHoraire.regleur },
      { label: 'operateur', value: complets.coutHoraire.operateur },
      { label: 'finition', value: complets.coutHoraire.finition }
    ]
  },
  embalage: {
    'Ressource lancement': [
      { label: 'regleur', value: complets.coutHoraire.regleur },
      { label: 'operateur', value: complets.coutHoraire.operateur },
      { label: 'finition', value: complets.coutHoraire.finition }
    ],
    'Ressource production': [
      { label: 'regleur', value: complets.coutHoraire.regleur },
 { label: 'operateur', value: complets.coutHoraire.operateur },
     { label: 'finition', value: complets.coutHoraire.finition }
   ]
 },
 autre: {
   'Ressource lancement': [
     { label: 'regleur', value: complets.coutHoraire.regleur },
     { label: 'operateur', value: complets.coutHoraire.operateur },
     { label: 'finition', value: complets.coutHoraire.finition }
   ],
   'Ressource production': [
     { label: 'regleur', value: complets.coutHoraire.regleur },
     { label: 'operateur', value: complets.coutHoraire.operateur },
     { label: 'finition', value: complets.coutHoraire.finition }
   ]
 }
};

const initData = (columns) => {
 const initial = {};
 for (let i = 0; i < columns; i++) {
   initial[i] = {};
   TABLES.forEach(({ key, headers }) => {
     initial[i][key] = {};
     headers.forEach(header => {
       initial[i][key][header] = '';
     });
   });
 }
 return initial;
};

const TableCellMemo = React.memo(({ colIdx, keyName, header, value, onChange, isRed }) => (
 <td style={{ padding: 4 }}>
   <TextField
     size="small"
     fullWidth
     value={value}
     onChange={e => onChange(colIdx, keyName, header, e.target.value)}
     sx={{
       backgroundColor: isRed ? '#ffe6e6' : undefined,
       '& .MuiInputBase-input': {
         fontWeight: isRed ? 'bold' : undefined,
         color: isRed ? '#d32f2f' : undefined
       }
     }}
   />
 </td>
));

const FullTables = () => {
 const { id } = useParams(); // Get document ID from URL
 const navigate = useNavigate();
 
 const [valueColumns, setValueColumns] = useState(1);
 const [columnNames, setColumnNames] = useState(['Valeur 1']);
 const [editingColumn, setEditingColumn] = useState(null);
 const [editColumnName, setEditColumnName] = useState('');
 const [duplicateIndex, setDuplicateIndex] = useState(0);
 const [data, setData] = useState(() => initData(1));
 const [isGenerating, setIsGenerating] = useState(false);
 const [images, setImages] = useState([]);
 const [documentName, setDocumentName] = useState('');
 const [documentData, setDocumentData] = useState(null); // Store full document data
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(true);
 const [directCostDialogOpen, setDirectCostDialogOpen] = useState(false);
 const [selectedColumnForDirectCost, setSelectedColumnForDirectCost] = useState(0);
 const saveTimer = useRef(null);
 const tableRefs = useRef({});
 const imageInputRef = useRef(null);
 const [reportConfigOpen, setReportConfigOpen] = useState(false);

 TABLES.forEach(({ key }) => {
   tableRefs.current[key] = useRef(null);
 });

 const scrollToTable = (tableKey) => {
   if (tableRefs.current[tableKey]?.current) {
     tableRefs.current[tableKey].current.scrollIntoView({ behavior: 'smooth', block: 'start' });
   }
 };

 const isRedField = useCallback((table, header) => {
   return isCalculated(table, header) 
 });

 const autoPopulateFields = useCallback((currentData) => {
   return JSON.parse(JSON.stringify(currentData));
 }, []);

 const handleImageUpload = useCallback((event) => {
   const files = Array.from(event.target.files);
   
   files.forEach(file => {
     if (!file.type.startsWith('image/')) {
       alert(`${file.name} n'est pas une image valide`);
       return;
     }

     const reader = new FileReader();
     reader.onload = (e) => {
       const arrayBuffer = e.target.result;
       const newImage = {
         id: Date.now() + Math.random(),
         name: file.name,
         buffer: arrayBuffer,
         type: file.type
       };
       
       setImages(prev => [...prev, newImage]);
     };
     reader.readAsArrayBuffer(file);
   });
   
   event.target.value = '';
 }, []);

 const removeImage = useCallback((imageId) => {
   setImages(prev => prev.filter(img => img.id !== imageId));
 }, []);

 const triggerImageUpload = useCallback(() => {
   imageInputRef.current?.click();
 }, []);

 const handleGenerateReport = useCallback(async (reportConfig) => {
   setIsGenerating(true);
   try {
     const blob = await generateWordReport(data, columnNames, valueColumns, images, isRedField, reportConfig);
     const filename = `proposition-${documentName}-indice-${reportConfig.indice}-${new Date().toISOString().split('T')[0]}.docx`;
     downloadBlob(blob, filename);
   } catch (error) {
     console.error('Error generating Word document:', error);
     alert('Erreur lors de la génération du document Word: ' + error.message);
   } finally {
     setIsGenerating(false);
   }
 }, [data, columnNames, valueColumns, images, isRedField, documentName]);

 // Update the generate report button click
 const openReportConfig = () => {
   setReportConfigOpen(true);
 };

 const calculateAllValuesForColumn = useCallback((columnIndex, currentData) => {
   const newData = JSON.parse(JSON.stringify(currentData));
   const calculationOrder = [
     'matiere', 'moulage', 'lancementMoulage', 'inserts', 'conditionnement',
     'melange', 'ebauche', 'ebavurage', 'etuvage', 'controleCapa',
     'embalage', 'autre', 'totalAchats', 'totalVA', 'synthese'
   ];

   calculationOrder.forEach(tableKey => {
     const table = TABLES.find(t => t.key === tableKey);
     if (!table) return;
     table.headers.forEach(header => {
       if (isCalculated(tableKey, header)) {
         const calc = getCalculation(tableKey, header);
         if (calc) {
           try {
             const allData = newData[columnIndex];
             const tableData = allData[tableKey];
             const result = calc(tableData, allData);
             newData[columnIndex][tableKey][header] = result;
           } catch (e) {
             console.error(`Calc error: ${tableKey}.${header}`, e);
           }
         }
       }
     });
   });

   return newData;
 }, []);

 const handleOpenDirectCostDialog = (columnIndex) => {
   setSelectedColumnForDirectCost(columnIndex);
   setDirectCostDialogOpen(true);
 };

 useEffect(() => {
   const newData = {};
   for (let col = 0; col < valueColumns; col++) {
     newData[col] = data[col] || {};
   }

   const autoPopulatedData = autoPopulateFields(newData);
   const calculatedData = {};
   for (let col = 0; col < valueColumns; col++) {
     const result = calculateAllValuesForColumn(col, autoPopulatedData);
     calculatedData[col] = result[col];
   }

   if (JSON.stringify(calculatedData) !== JSON.stringify(data)) {
     setData(calculatedData);
   }
 }, [data, valueColumns, calculateAllValuesForColumn, autoPopulateFields]);

 // Fetch document data
 useEffect(() => {
   const fetchData = async () => {
     if (!id) {
       navigate('/documents');
       return;
     }

     try {
       const res = await fetch(`http://localhost:3001/api/documents/${id}`);
       if (!res.ok) {
         if (res.status === 404) {
           setError('Document non trouvé');
           setTimeout(() => navigate('/documents'), 3000);
           return;
         }
         throw new Error('Erreur lors du chargement');
       }
       
       const saved = await res.json();
       setDocumentName(saved.name);
       setDocumentData(saved); // Store full document data
       
       if (saved?.valueColumns && saved?.columnNames && saved?.data) {
         const filled = {};
         for (let col = 0; col < saved.valueColumns; col++) {
           filled[col] = {};
           TABLES.forEach(({ key, headers }) => {
             filled[col][key] = {
               ...headers.reduce((acc, h) => ({ ...acc, [h]: '' }), {}),
               ...(saved.data[col]?.[key] || {})
             };
           });
         }
         setValueColumns(saved.valueColumns);
         setColumnNames(saved.columnNames);
         setData(filled);
       }
     } catch (e) {
       console.error('Fetch error', e);
       setError('Erreur lors du chargement du document');
     } finally {
       setLoading(false);
     }
   };
   fetchData();
 }, [id, navigate]);

 // Auto-save document data
 useEffect(() => {
   if (!id || loading) return;
   
   if (saveTimer.current) clearTimeout(saveTimer.current);
   saveTimer.current = setTimeout(() => {
     fetch(`http://localhost:3001/api/documents/${id}`, {
       method: 'PUT',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ valueColumns, columnNames, data })
     }).catch(err => console.error('Save error', err));
   }, 500);
   return () => clearTimeout(saveTimer.current);
 }, [data, valueColumns, columnNames, id, loading]);

 const addValueColumn = useCallback(() => {
   const colIdx = valueColumns;
   const newCol = {};
   TABLES.forEach(({ key, headers }) => {
     newCol[key] = headers.reduce((acc, h) => ({
       ...acc,
       [h]: DROPDOWN_OPTIONS[key]?.[h] ? data[0][key][h] || '' : ''
     }), {});
   });
   setData(prev => ({ ...prev, [colIdx]: newCol }));
   setValueColumns(prev => prev + 1);
   setColumnNames(prev => [...prev, `Valeur ${colIdx + 1}`]);
 }, [data, valueColumns]);

 const duplicateValueColumn = useCallback(() => {
   const colIdx = valueColumns;
   const clonedData = JSON.parse(JSON.stringify(data[duplicateIndex] || {}));
   setData(prev => ({ ...prev, [colIdx]: clonedData }));
   setValueColumns(prev => prev + 1);
   setColumnNames(prev => [...prev, `${columnNames[duplicateIndex]} (copie)`]);
 }, [data, valueColumns, duplicateIndex, columnNames]);

 const removeValueColumn = useCallback(() => {
   if (valueColumns <= 1) return;
   const updatedData = { ...data };
   delete updatedData[valueColumns - 1];
   setData(updatedData);
   setValueColumns(prev => prev - 1);
   setColumnNames(prev => prev.slice(0, -1));
 }, [data, valueColumns]);

 const updateCell = useCallback((col, table, header, val) => {
   setData(prev => ({
     ...prev,
     [col]: {
       ...prev[col],
       [table]: {
         ...prev[col][table],
         [header]: val
       }
     }
   }));
 }, []);

 const hasDropdown = useCallback((table, header) => Boolean(DROPDOWN_OPTIONS[table]?.[header]), []);

 const renderHeaderCell = (name, i) => {
   if (editingColumn === i) {
     return (
       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
         <TextField size="small" value={editColumnName} onChange={e => setEditColumnName(e.target.value)} sx={{ flex: 1 }} />
         <Button size="small" onClick={() => {
           if (editColumnName.trim()) {
             setColumnNames(prev => prev.map((n, idx) => idx === i ? editColumnName : n));
           }
           setEditingColumn(null);
         }}><CheckIcon fontSize="small" /></Button>
         <Button size="small" onClick={() => setEditingColumn(null)}><CloseIcon fontSize="small" /></Button>
       </Box>
     );
   }
   
   return (
     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
         {name}
         <Button size="small" onClick={() => { setEditingColumn(i); setEditColumnName(name); }}>
           <EditIcon fontSize="small" />
         </Button>
       </Box>
       <Button
         size="small"
         variant="outlined"
         onClick={() => handleOpenDirectCostDialog(i)}
         startIcon={<CalculateIcon fontSize="small" />}
         sx={{ fontSize: '0.7rem', padding: '2px 8px' }}
       >
         Coûts Directs
       </Button>
     </Box>
   );
 };

 if (loading) {
   return (
     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
       <Typography variant="h6">Chargement du document...</Typography>
     </Box>
   );
 }

 if (error) {
   return (
     <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: 2 }}>
       <Alert severity="error" sx={{ maxWidth: 400 }}>
         {error}
       </Alert>
       <Button
         variant="contained"
         startIcon={<ArrowBackIcon />}
         onClick={() => navigate('/documents')}
       >
         Retour aux documents
       </Button>
     </Box>
   );
 }

 return (
   <Box sx={{ minHeight: '100vh' }}>
     <input
       type="file"
       ref={imageInputRef}
       onChange={handleImageUpload}
       accept="image/*"
       multiple
       style={{ display: 'none' }}
     />

     <AppBar position="fixed" sx={{ backgroundColor: 'white', boxShadow: 2 }}>
       <Toolbar sx={{ gap: 2, flexWrap: 'wrap', minHeight: 'auto', py: 1 }}>
         {/* Document Info and Navigation */}
         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
           <Button
             startIcon={<ArrowBackIcon />}
             onClick={() => navigate('/documents')}
             sx={{ color: '#1a1a1a' }}
           >
             Documents
           </Button>
           
           <Breadcrumbs aria-label="breadcrumb">
             <Link
               component={RouterLink}
               to="/"
               sx={{ display: 'flex', alignItems: 'center', color: '#1a1a1a' }}
             >
               <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
               Accueil
             </Link>
             <Link
               component={RouterLink}
               to="/documents"
               sx={{ display: 'flex', alignItems: 'center', color: '#1a1a1a' }}
             >
               <FolderIcon sx={{ mr: 0.5 }} fontSize="inherit" />
               Documents
             </Link>
             <Typography sx={{ display: 'flex', alignItems: 'center', color: '#1a1a1a', fontWeight: 'bold' }}>
               {documentName} ({id})
             </Typography>
           </Breadcrumbs>
         </Box>

         {/* Action Buttons */}
         <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
           <Button variant="contained" onClick={addValueColumn} startIcon={<AddIcon />}>
             Ajouter une colonne
           </Button>
           <Button variant="outlined" color="error" onClick={removeValueColumn} disabled={valueColumns <= 1} startIcon={<DeleteIcon />}>
             Supprimer
           </Button>

           <FormControl size="small" sx={{ minWidth: 150 }}>
             <InputLabel>Colonne à dupliquer</InputLabel>
             <Select
               value={duplicateIndex}
               label="Colonne à dupliquer"
               onChange={e => setDuplicateIndex(parseInt(e.target.value))}
             >
               {columnNames.map((name, idx) => (
                 <MenuItem key={idx} value={idx}>{name}</MenuItem>
               ))}
             </Select>
           </FormControl>
           <Button onClick={duplicateValueColumn} variant="outlined" startIcon={<AddIcon />}>
             Dupliquer
           </Button>

           <Badge badgeContent={images.length} color="primary">
             <Button 
               onClick={triggerImageUpload} 
               variant="outlined" 
               color="info" 
               startIcon={<ImageIcon />}
             >
               Ajouter Images
             </Button>
           </Badge>

           <Button 
             onClick={openReportConfig} 
             variant="contained" 
             color="success" 
             startIcon={<DownloadIcon />}
             disabled={isGenerating}
           >
             {isGenerating ? 'Génération...' : 'Générer Rapport Word'}
           </Button>
         </Box>

         {/* Navigation Chips */}
         <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: '100%', mt: 1 }}>
           {TABLES.map(({ key, title, textColor }) => (
             <Chip
               key={key}
               label={title}
               onClick={() => scrollToTable(key)}
               sx={{
                 cursor: 'pointer',
                 backgroundColor: textColor + '20',
                 color: textColor,
                 '&:hover': { backgroundColor: textColor + '40' }
               }}
               size="small"
             />
           ))}
         </Box>
       </Toolbar>
     </AppBar>

     {images.length > 0 && (
       <Box sx={{ 
         position: 'fixed', 
         top: 80, 
         right: 20, 
         width: 250, 
         maxHeight: 400, 
         overflow: 'auto',
         backgroundColor: 'white',
         borderRadius: 2,
         boxShadow: 3,
         p: 2,
         zIndex: 1000
       }}>
         <Typography variant="h6" sx={{ mb: 1 }}>Images ajoutées ({images.length})</Typography>
         {images.map((img, index) => (
           <Box key={img.id} sx={{ 
             display: 'flex', 
             alignItems: 'center', 
             justifyContent: 'space-between',
             p: 1,
             border: '1px solid #e0e0e0',
             borderRadius: 1,
             mb: 1
           }}>
             <Typography variant="body2" sx={{ flex: 1, mr: 1 }}>
               {index + 1}. {img.name.length > 20 ? img.name.substring(0, 20) + '...' : img.name}
             </Typography>
             <IconButton size="small" onClick={() => removeImage(img.id)} color="error">
               <ClearIcon fontSize="small" />
             </IconButton>
           </Box>
         ))}
       </Box>
     )}

     <Box sx={{ pt: 16, p: 2 }}>
       {TABLES.map(({ key, title, headers, bgColor, textColor, borderColor, icon }) => (
         <Paper
           key={key}
           ref={tableRefs.current[key]}
           variant="outlined"
           sx={{ mt: 15, mb: 3, p: 2, backgroundColor: bgColor, borderColor }}
         >
           <Typography variant="h6" sx={{ color: textColor, mb: 1, display: 'flex', alignItems: 'center' }}>
             <span style={{ marginRight: 8 }}>{icon}</span>{title}
           </Typography>

           <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
             <thead>
               <tr>
                 <th style={{ backgroundColor: '#f0f0f0', padding: 8, position: 'sticky', top: 0 }}>Champs</th>
                 {columnNames.map((name, i) => (
                   <th key={i} style={{ backgroundColor: '#e8eaf6', padding: 8 }}>{renderHeaderCell(name, i)}</th>
                 ))}
               </tr>
             </thead>
             <tbody>
               {headers.map(header => (
                 <tr key={header}>
                   <td style={{ fontWeight: 'bold', backgroundColor: '#fafafa', padding: 8 }}>
                     {hasDropdown(key, header) ? (
                       <FormControl fullWidth size="small">
                         <InputLabel>{header}</InputLabel>
                         <Select
                           value={data[0]?.[key]?.[header] || ''}
                           onChange={e => {
                             const newData = { ...data };
                             for (let col = 0; col < valueColumns; col++) {
                               newData[col][key][header] = e.target.value;
                             }
                             setData(newData);
                           }}
                           label={header}
                         >
                           {DROPDOWN_OPTIONS[key][header].map(({ label, value }) => (
                             <MenuItem key={label} value={value}>{label}</MenuItem>
                           ))}
                         </Select>
                       </FormControl>
                     ) : header}
                   </td>
                   {Array.from({ length: valueColumns }).map((_, colIdx) => (
                     <TableCellMemo
                       key={colIdx}
                       colIdx={colIdx}
                       keyName={key}
                       header={header}
                       value={data[colIdx]?.[key]?.[header] || ''}
                       onChange={updateCell}
                       isRed={isRedField(key, header)}
                     />
                   ))}
                 </tr>
               ))}
             </tbody>
           </Box>
         </Paper>
       ))}
     </Box>

     {/* Direct Cost Calculator Dialog */}
     <DirectCostCalculatorDialog
       open={directCostDialogOpen}
       onClose={() => setDirectCostDialogOpen(false)}
       mainData={data}
       columnIndex={selectedColumnForDirectCost}
     />
     <ReportConfigDialog
       open={reportConfigOpen}
       onClose={() => setReportConfigOpen(false)}
       onGenerate={handleGenerateReport}
       documentName={documentName}
       documentData={documentData} // Pass document data with client info
     />
   </Box>
 );
};

export default FullTables;