import React, { useState, useEffect } from 'react';
import {
  Box, Button, Paper, Typography, TextField, Dialog, DialogTitle, 
  DialogContent, DialogActions, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, InputAdornment, Alert,
  Card, CardContent, CardActions, Grid, Chip, FormControl, 
  InputLabel, Select, MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import BuildIcon from '@mui/icons-material/Build'; // For Caoutchouc
import CategoryIcon from '@mui/icons-material/Category'; // For Plastique
import { useNavigate } from 'react-router-dom';

const DOCUMENT_TYPES = {
  caoutchouc: { 
    label: 'Caoutchouc', 
    color: '#ff5722', 
    route: 'caouatchouc',
    icon: <BuildIcon />
  },
  plastique: { 
    label: 'Plastique', 
    color: '#2196f3', 
    route: 'plastique',
    icon: <CategoryIcon />
  }
};

export default function DocumentManager() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [newDocId, setNewDocId] = useState('');
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('caoutchouc');
  const [editDocName, setEditDocName] = useState('');
  // Add client information fields
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/documents');
      const docs = await response.json();
      console.log('Fetched documents:', docs); // Debug log
      setDocuments(docs);
    } catch (error) {
      setError('Erreur lors du chargement des documents');
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    if (!newDocId.trim() || !newDocName.trim()) {
      setError('ID et nom sont requis');
      return;
    }

    console.log('Creating document with type:', newDocType); // Debug log

    const requestBody = { 
      id: newDocId.trim(), 
      name: newDocName.trim(),
      type: newDocType,
      clientName: clientName.trim(),
      clientCompany: clientCompany.trim(),
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim()
    };

    console.log('Request body:', requestBody); // Debug log

    try {
      const response = await fetch('http://localhost:3001/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();
      console.log('Server response:', result); // Debug log

      if (response.ok) {
        setCreateDialogOpen(false);
        // Reset all form fields
        setNewDocId('');
        setNewDocName('');
        setNewDocType('caoutchouc');
        setClientName('');
        setClientCompany('');
        setContactName('');
        setContactEmail('');
        setContactPhone('');
        setError('');
        fetchDocuments();
        // Navigate to the new document
        const route = DOCUMENT_TYPES[newDocType].route;
        console.log('Navigating to:', `/${route}/${newDocId.trim()}`); // Debug log
        navigate(`/${route}/${newDocId.trim()}`);
      } else {
        setError(result.error || 'Erreur lors de la création');
      }
    } catch (error) {
      setError('Erreur lors de la création du document');
      console.error('Error creating document:', error);
    }
  };

  const handleUpdateDocumentName = async () => {
    if (!editDocName.trim()) {
      setError('Le nom est requis');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/documents/${selectedDoc.id}/name`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editDocName.trim() })
      });

      if (response.ok) {
        setEditDialogOpen(false);
        setEditDocName('');
        setSelectedDoc(null);
        setError('');
        fetchDocuments();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      setError('Erreur lors de la mise à jour du document');
      console.error('Error updating document:', error);
    }
  };

  const handleDeleteDocument = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/documents/${selectedDoc.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setDeleteDialogOpen(false);
        setSelectedDoc(null);
        setError('');
        fetchDocuments();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      setError('Erreur lors de la suppression du document');
      console.error('Error deleting document:', error);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const getDocumentTypeInfo = (type) => {
    const typeInfo = DOCUMENT_TYPES[type] || DOCUMENT_TYPES.caoutchouc;
    console.log(`Getting type info for "${type}":`, typeInfo); // Debug log
    return typeInfo;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, mt: 10 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
          Gestion des Documents
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ 
            backgroundColor: '#4caf50',
            '&:hover': { backgroundColor: '#45a049' }
          }}
        >
          Nouveau Document
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Rechercher par nom ou ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Type de document</InputLabel>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            label="Type de document"
          >
            <MenuItem value="">Tous les types</MenuItem>
            {Object.entries(DOCUMENT_TYPES).map(([key, type]) => (
              <MenuItem key={key} value={key}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {type.icon}
                  {type.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredDocuments.map((doc) => {
          const typeInfo = getDocumentTypeInfo(doc.type);
          console.log(`Rendering document ${doc.id} with type: ${doc.type}`); // Debug log
          return (
            <Grid item xs={12} sm={6} md={4} key={doc.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
                      {doc.name}
                    </Typography>
                    <Chip
                      icon={typeInfo.icon}
                      label={typeInfo.label}
                      size="small"
                      sx={{ 
                        backgroundColor: typeInfo.color + '20',
                        color: typeInfo.color,
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    ID: {doc.id}
                  </Typography>
                  {doc.clientName && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      Client: {doc.clientName}
                    </Typography>
                  )}
                  {doc.clientCompany && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      Société: {doc.clientCompany}
                    </Typography>
                  )}
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Créé: {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Modifié: {new Date(doc.updatedAt).toLocaleDateString('fr-FR')}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<OpenInNewIcon />}
                    onClick={() => {
                      console.log(`Opening document ${doc.id} with route: ${typeInfo.route}`); // Debug log
                      navigate(`/${typeInfo.route}/${doc.id}`);
                    }}
                    sx={{ color: typeInfo.color }}
                  >
                    Ouvrir
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedDoc(doc);
                      setEditDocName(doc.name);
                      setEditDialogOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      setSelectedDoc(doc);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredDocuments.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="textSecondary">
            {searchTerm || filterType ? 'Aucun document trouvé' : 'Aucun document créé'}
          </Typography>
          {!searchTerm && !filterType && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{ mt: 2 }}
            >
              Créer votre premier document
            </Button>
          )}
        </Box>
      )}

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Créer un Nouveau Document</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type de document</InputLabel>
                <Select
                  value={newDocType}
                  onChange={(e) => {
                    console.log('Type changed to:', e.target.value); // Debug log
                    setNewDocType(e.target.value);
                  }}
                  label="Type de document"
                >
                  {Object.entries(DOCUMENT_TYPES).map(([key, type]) => (
                    <MenuItem key={key} value={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {type.icon}
                        {type.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="ID du Document"
                value={newDocId}
                onChange={(e) => setNewDocId(e.target.value)}
                helperText="Identifiant unique (ex: PROJ-001, CLIENT-ABC)"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nom du Document"
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                helperText="Nom descriptif du projet"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nom du client"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Société du client"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nom du contact"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Email du contact"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Téléphone du contact"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleCreateDocument} variant="contained">Créer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier le Nom du Document</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du Document"
            fullWidth
            variant="outlined"
            value={editDocName}
            onChange={(e) => setEditDocName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleUpdateDocumentName} variant="contained">Sauvegarder</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Supprimer le Document</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer le document "{selectedDoc?.name}" ?
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleDeleteDocument} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}