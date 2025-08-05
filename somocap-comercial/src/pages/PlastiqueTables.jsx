import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Button, Paper, Typography, TextField,
  AppBar, Toolbar, Chip, Badge, IconButton,
  Alert, Breadcrumbs, Link, FormControl, InputLabel, Select, MenuItem
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
import { TABLES } from '../constants/plastique.jsx';
import { isCalculated, getCalculation } from '../utils/plastique/calculations';
import { generateWordReport, downloadBlob } from '../utils/plastique/wordExport';
import { complets, directs, cout_machine } from '../utils/plastique/variables';
import PlastiqueDirectCostCalculatorDialog from './PlastiqueDirectCostCalculatorDialog';
import ReportConfigDialog from './ReportConfigDialog';

const DROPDOWN_OPTIONS = {
  lancementMoulage: {
    'TYPE DE PRESSE': [
      { label: 'Petite (50T)', value: 23 },
      { label: 'Moyenne (51T à 219T)', value: 28 },
      { label: 'Grosse (220T à 485T)', value: 35 }
    ]
  },
  finition: {
    'Ressource lancement': [
      { label: 'operateur', value: complets.coutHoraire.operateur },
      { label: 'regleur', value: complets.coutHoraire.regleur },
      { label: 'finition', value: complets.coutHoraire.finition }
    ],
    'Ressource production': [
      { label: 'operateur', value: complets.coutHoraire.operateur },
      { label: 'regleur', value: complets.coutHoraire.regleur },
      { label: 'finition', value: complets.coutHoraire.finition }
    ]
  },
  controleCapa: {
    'Ressource lancement': [
      { label: 'operateur', value: complets.coutHoraire.operateur },
      { label: 'regleur', value: complets.coutHoraire.regleur },
      { label: 'finition', value: complets.coutHoraire.finition }
    ],
    'Ressource production': [
      { label: 'operateur', value: complets.coutHoraire.operateur },
      { label: 'regleur', value: complets.coutHoraire.regleur },
      { label: 'finition', value: complets.coutHoraire.finition }
    ]
  },
  embalage: {
    'Ressource lancement': [
      { label: 'operateur', value: complets.coutHoraire.operateur },
      { label: 'regleur', value: complets.coutHoraire.regleur },
      { label: 'finition', value: complets.coutHoraire.finition }
    ],
    'Ressource production': [
      { label: 'operateur', value: complets.coutHoraire.operateur },
      { label: 'regleur', value: complets.coutHoraire.regleur },
      { label: 'finition', value: complets.coutHoraire.finition }
    ]
  },
  autre: {
    'Ressource lancement': [
      { label: 'operateur', value: complets.coutHoraire.operateur },
      { label: 'regleur', value: complets.coutHoraire.regleur },
      { label: 'finition', value: complets.coutHoraire.finition }
    ],
    'Ressource production': [
      { label: 'operateur', value: complets.coutHoraire.operateur },
      { label: 'regleur', value: complets.coutHoraire.regleur },
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
      disabled={isRed}
      sx={{
        backgroundColor: isRed ? '#ffe6e6' : undefined,
        '& .MuiInputBase-input': {
          fontWeight: isRed ? 'bold' : undefined,
          color: isRed ? '#d32f2f' : undefined,
        },
        '& .Mui-disabled': {
          color: '#d32f2f !important',
          WebkitTextFillColor: '#d32f2f !important',
        }
      }}
    />
  </td>
));

const PlastiqueTables = () => {
  const { id } = useParams();
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
  const [documentData, setDocumentData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [directCostDialogOpen, setDirectCostDialogOpen] = useState(false);
  const [selectedColumnForDirectCost, setSelectedColumnForDirectCost] = useState(0);
  const [reportConfigOpen, setReportConfigOpen] = useState(false);
  const saveTimer = useRef(null);
  const tableRefs = useRef({});
  const imageInputRef = useRef(null);

  TABLES.forEach(({ key }) => {
    tableRefs.current[key] = useRef(null);
  });

  const scrollToTable = (tableKey) => {
    if (tableRefs.current[tableKey]?.current) {
      tableRefs.current[tableKey].current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const isRedField = useCallback((table, header) => {
    return isCalculated(table, header);
  }, []);

  const hasDropdown = useCallback((table, header) => {
    return Boolean(DROPDOWN_OPTIONS[table]?.[header]);
  }, []);

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
      const filename = `proposition-plastique-${documentName}-indice-${reportConfig.indice}-${new Date().toISOString().split('T')[0]}.docx`;
      downloadBlob(blob, filename);
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Erreur lors de la génération du document Word: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  }, [data, columnNames, valueColumns, images, isRedField, documentName]);

  const openReportConfig = () => {
    setReportConfigOpen(true);
  };

  const calculateAllValuesForColumn = useCallback((columnIndex, currentData) => {
    const newData = JSON.parse(JSON.stringify(currentData));
    
    // Calculate in proper order - all tables
    TABLES.forEach(({ key }) => {
      const table = TABLES.find(t => t.key === key);
      if (!table) return;
      
      // Special handling for duplicate field names
      let duplicateCount = {};
      
      table.headers.forEach((header, headerIndex) => {
        // Track duplicate headers
        if (!duplicateCount[header]) {
          duplicateCount[header] = 0;
        } else {
          duplicateCount[header]++;
        }
        
        // Generate unique key for duplicate headers
        const uniqueKey = duplicateCount[header] > 0 ? `${header}_${duplicateCount[header] + 1}` : header;
        
        if (isCalculated(key, header)) {
          const calc = getCalculation(key, uniqueKey) || getCalculation(key, header);
          if (calc) {
            try {
              const allData = newData[columnIndex];
              const tableData = allData[key];
              const result = calc(tableData, allData);
              newData[columnIndex][key][uniqueKey] = result;
            } catch (e) {
              console.error(`Calc error: ${key}.${header}`, e);
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
        setDocumentData(saved);
        
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
      newCol[key] = headers.reduce((acc, h) => ({ ...acc, [h]: '' }), {});
    });
    setData(prev => ({ ...prev, [colIdx]: newCol }));
    setValueColumns(prev => prev + 1);
    setColumnNames(prev => [...prev, `Valeur ${colIdx + 1}`]);
  }, [valueColumns]);

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
                {documentName} (Plastique - {id})
              </Typography>
            </Breadcrumbs>
          </Box>

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
            sx={{ mt: 3, mb: 3, p: 2, backgroundColor: bgColor, borderColor }}
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
                {headers.map((header, headerIndex) => {
                  const isRed = isRedField(key, header);
                  const dropdown = hasDropdown(key, header);
                  
                  // Count occurrences of this header name up to current index
                  let occurrenceIndex = 0;
                  let duplicateHeaders = {};
                  for (let i = 0; i <= headerIndex; i++) {
                    if (headers[i] === header) {
                      if (i < headerIndex) {
                        occurrenceIndex++;
                      }
                      duplicateHeaders[headers[i]] = (duplicateHeaders[headers[i]] || 0) + 1;
                    }
                  }
                  
                  // Generate unique key for duplicate headers
                  const uniqueKey = occurrenceIndex > 0 ? `${header}_${occurrenceIndex + 1}` : header;
                  
                  return (
                    <tr key={`${header}-${headerIndex}`}>
                      <td style={{ fontWeight: 'bold', backgroundColor: '#fafafa', padding: 8 }}>
                        {dropdown ? (
                          <FormControl fullWidth size="small">
                            <InputLabel>{header}</InputLabel>
                            <Select
                              value={data[0]?.[key]?.[uniqueKey] || ''}
                              onChange={e => {
                                const newData = { ...data };
                                for (let col = 0; col < valueColumns; col++) {
                                  newData[col][key][uniqueKey] = e.target.value;
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
                          header={uniqueKey}
                          value={data[colIdx]?.[key]?.[uniqueKey] || ''}
                          onChange={updateCell}
                          isRed={isRed}
                        />
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </Box>
          </Paper>
        ))}
      </Box>

      <PlastiqueDirectCostCalculatorDialog
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
        documentData={documentData}
      />
    </Box>
  );
};

export default PlastiqueTables;