import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Grid, Box, Typography, IconButton, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ReportConfigDialog = ({ open, onClose, onGenerate, documentName, documentData }) => {
  const [config, setConfig] = useState({
    clientName: '',
    clientCompany: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    indice: 'A',
    logoImage: null,
    footerImage: null,
    introductionText: 'Cette proposition technique présente notre solution adaptée à vos besoins spécifiques. Nous avons analysé votre cahier des charges avec attention pour vous proposer une offre complète et competitive.',
    revisionComment: 'Version initiale',
    revisionDate: new Date().toLocaleDateString('fr-FR'),
    revisionVisa: 'KG',
    
    // Page 3 & 4 - Définition du besoin & Présentation offre technique
    definitionSections: [
      { title: '1.1 Contexte du projet', content: '', image: null },
      { title: '1.2 Cahier des charges', content: '', image: null },
      { title: '1.3 Données techniques', content: '', image: null }
    ],
    presentationSections: [
      { title: '2.1 Solution proposée', content: '', image: null },
      { title: '2.2 Spécifications techniques', content: '', image: null },
      { title: '2.3 Architecture système', content: '', image: null }
    ],
    
    // Page 6 - Délais & Réserves (already implemented)
    delaisItems: [
      { etape: "Etude et réalisation d'un moule", delai: "5 semaines" },
      { etape: "Mise au point moule", delai: "2 semaines" },
      { etape: "Réalisation des EI", delai: "1 semaine" },
      { etape: "Rapatriement outillage", delai: "6 à 8 semaines" },
      { etape: "1ere série", delai: "2 semaines" }
    ],
    reservesItems: [
      { type: "Dimensionnel", description: "Tolérance selon norme NT5800 catégorie normale" },
      { type: "Autres", description: "NA" }
    ],
    
    // Page 7 - Conditions de réalisation
    moq: '5 200pcs',
    transportConditions: 'port dû', // dropdown: 'port dû' or 'franco'
    seriesControl: 'Dimensionnel sur côtes majeures au lancement',
    packaging: 'en vrac en carton D',
    offerValidity: '2 mois',
    
    // Payment conditions
    toolingInvoicing: 'Facturation de 50% à la cde : Virement à réception de facture',
    toolingBalance: 'Solde : 50% à la validation des EI Virement à réception de facture',
    toolingDelay: 'Si délai de validation > 30 jours, la facture EI sera présentée à 30 jours après expédition des EI',
    partsPayment: 'Virement à 30 jours date de facture',
    partsTransport: 'Port dû',
    
    // Signature
    signerName: '',
    signerRole: ''
  });

  // Update config when documentData changes
  useEffect(() => {
    if (documentData && open) {
      setConfig(prev => ({
        ...prev,
        clientName: documentData.clientName || '',
        clientCompany: documentData.clientCompany || '',
        contactName: documentData.contactName || '',
        contactEmail: documentData.contactEmail || '',
        contactPhone: documentData.contactPhone || ''
      }));
    }
  }, [documentData, open]);

  const handleInputChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setConfig(prev => ({
          ...prev,
          logoImage: {
            buffer: e.target.result,
            name: file.name
          }
        }));
      };
      reader.readAsArrayBuffer(file);
    }
    event.target.value = '';
  };

  const handleFooterUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setConfig(prev => ({
          ...prev,
          footerImage: {
            buffer: e.target.result,
            name: file.name
          }
        }));
      };
      reader.readAsArrayBuffer(file);
    }
    event.target.value = '';
  };

  const handleSectionChange = (sectionType, index, field, value) => {
    setConfig(prev => ({
      ...prev,
      [sectionType]: prev[sectionType].map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  const handleSectionImageUpload = (sectionType, index, event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setConfig(prev => ({
          ...prev,
          [sectionType]: prev[sectionType].map((section, i) => 
            i === index ? { 
              ...section, 
              image: {
                buffer: e.target.result,
                name: file.name
              }
            } : section
          )
        }));
      };
      reader.readAsArrayBuffer(file);
    }
    event.target.value = '';
  };

  const addSection = (sectionType) => {
    setConfig(prev => ({
      ...prev,
      [sectionType]: [...prev[sectionType], { title: '', content: '', image: null }]
    }));
  };

  const removeSection = (sectionType, index) => {
    setConfig(prev => ({
      ...prev,
      [sectionType]: prev[sectionType].filter((_, i) => i !== index)
    }));
  };

  const handleDelaisChange = (index, field, value) => {
    const updatedDelais = [...config.delaisItems];
    updatedDelais[index][field] = value;
    setConfig(prev => ({ ...prev, delaisItems: updatedDelais }));
  };

  const handleReservesChange = (index, field, value) => {
    const updatedReserves = [...config.reservesItems];
    updatedReserves[index][field] = value;
    setConfig(prev => ({ ...prev, reservesItems: updatedReserves }));
  };

  const addDelaisItem = () => {
    setConfig(prev => ({
      ...prev,
      delaisItems: [...prev.delaisItems, { etape: "", delai: "" }]
    }));
  };

  const removeDelaisItem = (index) => {
setConfig(prev => ({
     ...prev,
     delaisItems: prev.delaisItems.filter((_, i) => i !== index)
   }));
 };

 const addReservesItem = () => {
   setConfig(prev => ({
     ...prev,
     reservesItems: [...prev.reservesItems, { type: "", description: "" }]
   }));
 };

 const removeReservesItem = (index) => {
   setConfig(prev => ({
     ...prev,
     reservesItems: prev.reservesItems.filter((_, i) => i !== index)
   }));
 };

 const handleGenerate = () => {
   onGenerate({ ...config, filename: documentName });
   onClose();
 };

 const renderSectionEditor = (sectionType, sections, title) => (
   <Accordion>
     <AccordionSummary expandIcon={<ExpandMoreIcon />}>
       <Typography variant="h6">{title}</Typography>
     </AccordionSummary>
     <AccordionDetails>
       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
         {sections.map((section, index) => (
           <Box key={index} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
             <Grid container spacing={2}>
               <Grid item xs={12}>
                 <TextField
                   fullWidth
                   label="Titre de la section"
                   value={section.title}
                   onChange={(e) => handleSectionChange(sectionType, index, 'title', e.target.value)}
                 />
               </Grid>
               <Grid item xs={12}>
                 <TextField
                   fullWidth
                   multiline
                   rows={4}
                   label="Contenu"
                   value={section.content}
                   onChange={(e) => handleSectionChange(sectionType, index, 'content', e.target.value)}
                 />
               </Grid>
               <Grid item xs={8}>
                 <Button
                   variant="outlined"
                   component="label"
                   startIcon={<PhotoCameraIcon />}
                 >
                   Ajouter une image
                   <input
                     type="file"
                     hidden
                     accept="image/*"
                     onChange={(e) => handleSectionImageUpload(sectionType, index, e)}
                   />
                 </Button>
                 {section.image && (
                   <Typography variant="body2" sx={{ mt: 1 }}>
                     Image: {section.image.name}
                   </Typography>
                 )}
               </Grid>
               <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                 <IconButton onClick={() => removeSection(sectionType, index)} color="error">
                   <DeleteIcon />
                 </IconButton>
               </Grid>
             </Grid>
           </Box>
         ))}
         <Button 
           onClick={() => addSection(sectionType)} 
           variant="outlined" 
           startIcon={<AddIcon />}
         >
           Ajouter une section
         </Button>
       </Box>
     </AccordionDetails>
   </Accordion>
 );

 return (
   <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
     <DialogTitle>Configuration du Rapport</DialogTitle>
     <DialogContent>
       <Grid container spacing={3} sx={{ mt: 1 }}>
         {/* Basic Information */}
         <Grid item xs={12}>
           <Accordion defaultExpanded>
             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
               <Typography variant="h6">Informations de base</Typography>
             </AccordionSummary>
             <AccordionDetails>
               <Grid container spacing={2}>
                 <Grid item xs={6}>
                   <TextField
                     fullWidth
                     label="Nom du client"
                     value={config.clientName}
                     onChange={(e) => handleInputChange('clientName', e.target.value)}
                   />
                 </Grid>
                 <Grid item xs={6}>
                   <TextField
                     fullWidth
                     label="Société"
                     value={config.clientCompany}
                     onChange={(e) => handleInputChange('clientCompany', e.target.value)}
                   />
                 </Grid>
                 <Grid item xs={6}>
                   <TextField
                     fullWidth
                     label="Nom du contact"
                     value={config.contactName}
                     onChange={(e) => handleInputChange('contactName', e.target.value)}
                   />
                 </Grid>
                 <Grid item xs={6}>
                   <TextField
                     fullWidth
                     label="Email"
                     value={config.contactEmail}
                     onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                   />
                 </Grid>
                 <Grid item xs={6}>
                   <TextField
                     fullWidth
                     label="Téléphone"
                     value={config.contactPhone}
                     onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                   />
                 </Grid>
                 <Grid item xs={6}>
                   <TextField
                     fullWidth
                     label="Indice"
                     value={config.indice}
                     onChange={(e) => handleInputChange('indice', e.target.value.toUpperCase())}
                     inputProps={{ maxLength: 3 }}
                   />
                 </Grid>
                 <Grid item xs={12}>
                   <TextField
                     fullWidth
                     multiline
                     rows={3}
                     label="Texte d'introduction"
                     value={config.introductionText}
                     onChange={(e) => handleInputChange('introductionText', e.target.value)}
                   />
                 </Grid>
                 
                 {/* Logo Upload */}
                 <Grid item xs={6}>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                     <Button
                       variant="outlined"
                       component="label"
                       startIcon={<PhotoCameraIcon />}
                     >
                       Logo en-tête
                       <input
                         type="file"
                         hidden
                         accept="image/*"
                         onChange={handleLogoUpload}
                       />
                     </Button>
                     {config.logoImage && (
                       <Typography variant="body2">{config.logoImage.name}</Typography>
                     )}
                   </Box>
                 </Grid>
                 
                 {/* Footer Image Upload */}
                 <Grid item xs={6}>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                     <Button
                       variant="outlined"
                       component="label"
                       startIcon={<PhotoCameraIcon />}
                     >
                       Image pied de page
                       <input
                         type="file"
                         hidden
                         accept="image/*"
                         onChange={handleFooterUpload}
                       />
                     </Button>
                     {config.footerImage && (
                       <Typography variant="body2">{config.footerImage.name}</Typography>
                     )}
                   </Box>
                 </Grid>
               </Grid>
             </AccordionDetails>
           </Accordion>
         </Grid>

         {/* Page Content Sections */}
         <Grid item xs={12}>
           {renderSectionEditor('definitionSections', config.definitionSections, 'Page 3 - Définition du besoin & données d\'entrée')}
         </Grid>

         <Grid item xs={12}>
           {renderSectionEditor('presentationSections', config.presentationSections, 'Page 4 - Présentation offre technique')}
         </Grid>

         {/* Délais & Réserves */}
         <Grid item xs={12}>
           <Accordion>
             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
               <Typography variant="h6">Page 6 - Délais & Réserves</Typography>
             </AccordionSummary>
             <AccordionDetails>
               <Box sx={{ mb: 3 }}>
                 <Typography variant="subtitle1" gutterBottom>Délais Projet</Typography>
                 {config.delaisItems.map((item, index) => (
                   <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                     <Grid item xs={8}>
                       <TextField
                         fullWidth
                         label={`Étape ${index + 1}`}
                         value={item.etape}
                         onChange={(e) => handleDelaisChange(index, 'etape', e.target.value)}
                       />
                     </Grid>
                     <Grid item xs={3}>
                       <TextField
                         fullWidth
                         label="Délai"
                         value={item.delai}
                         onChange={(e) => handleDelaisChange(index, 'delai', e.target.value)}
                       />
                     </Grid>
                     <Grid item xs={1}>
                       <IconButton onClick={() => removeDelaisItem(index)} color="error">
                         <DeleteIcon />
                       </IconButton>
                     </Grid>
                   </Grid>
                 ))}
                 <Button onClick={addDelaisItem} variant="outlined" startIcon={<AddIcon />}>
                   Ajouter une étape
                 </Button>
               </Box>

               <Box>
                 <Typography variant="subtitle1" gutterBottom>Réserves</Typography>
                 {config.reservesItems.map((item, index) => (
                   <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                     <Grid item xs={4}>
                       <TextField
                         fullWidth
                         label="Type"
                         value={item.type}
                         onChange={(e) => handleReservesChange(index, 'type', e.target.value)}
                       />
                     </Grid>
                     <Grid item xs={7}>
                       <TextField
                         fullWidth
                         label="Description"
                         value={item.description}
                         onChange={(e) => handleReservesChange(index, 'description', e.target.value)}
                       />
                     </Grid>
                     <Grid item xs={1}>
                       <IconButton onClick={() => removeReservesItem(index)} color="error">
                         <DeleteIcon />
                       </IconButton>
                     </Grid>
                   </Grid>
                 ))}
                 <Button onClick={addReservesItem} variant="outlined" startIcon={<AddIcon />}>
                   Ajouter une réserve
                 </Button>
               </Box>
             </AccordionDetails>
           </Accordion>
         </Grid>

         {/* Conditions de réalisation */}
         <Grid item xs={12}>
           <Accordion>
             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
               <Typography variant="h6">Page 7 - Conditions de réalisation</Typography>
             </AccordionSummary>
             <AccordionDetails>
               <Grid container spacing={2}>
                 <Grid item xs={6}>
                   <TextField
                     fullWidth
                     label="MOQ"
                     value={config.moq}
                     onChange={(e) => handleInputChange('moq', e.target.value)}
                   />
                 </Grid>
                 <Grid item xs={6}>
                   <TextField
                     fullWidth
                     select
                     label="Conditions de transport"
                     value={config.transportConditions}
                     onChange={(e) => handleInputChange('transportConditions', e.target.value)}
                     SelectProps={{ native: true }}
                   >
                     <option value="port dû">port dû</option>
                     <option value="franco">franco</option>
                   </TextField>
                 </Grid>
                 <Grid item xs={12}>
                   <TextField
                     fullWidth
                     label="Contrôle en série"
                     value={config.seriesControl}
                     onChange={(e) => handleInputChange('seriesControl', e.target.value)}
                   />
                 </Grid>
                 <Grid item xs={12}>
                   <TextField
                     fullWidth
                     label="Emballage"
                     value={config.packaging}
                     onChange={(e) => handleInputChange('packaging', e.target.value)}
                   />
                 </Grid>
                 <Grid item xs={6}>
                   <TextField
                     fullWidth
                     label="Validité de l'offre"
                     value={config.offerValidity}
                     onChange={(e) => handleInputChange('offerValidity', e.target.value)}
                   />
                 </Grid>
                 <Grid item xs={6}>
                   <TextField
                     fullWidth
                     label="Nom du signataire"
                     value={config.signerName}
                     onChange={(e) => handleInputChange('signerName', e.target.value)}
                   />
                 </Grid>
                 <Grid item xs={6}>
                   <TextField
                     fullWidth
                     label="Rôle du signataire"
                     value={config.signerRole}
                     onChange={(e) => handleInputChange('signerRole', e.target.value)}
                   />
                 </Grid>
               </Grid>
             </AccordionDetails>
           </Accordion>
         </Grid>
       </Grid>
     </DialogContent>
     
     <DialogActions>
       <Button onClick={onClose}>Annuler</Button>
       <Button onClick={handleGenerate} variant="contained">
         Générer le Rapport
       </Button>
     </DialogActions>
   </Dialog>
 );
};

export default ReportConfigDialog;