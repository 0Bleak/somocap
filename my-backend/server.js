import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);

const defaultData = { 
  documents: {}
};

const db = new Low(adapter, defaultData);
await db.read();

if (!db.data.documents) {
  db.data.documents = {};
  await db.write();
}

const app = express();
app.use(cors());
app.use(express.json());

// Get all documents (list view)
app.get('/api/documents', async (req, res) => {
  try {
    await db.read();
    console.log('\n=== RAW DATABASE CONTENT ===');
    console.log(JSON.stringify(db.data.documents, null, 2));
    console.log('=== END RAW DATABASE ===\n');
    
    const documents = Object.entries(db.data.documents || {}).map(([id, doc]) => {
      console.log(`\n--- Processing document ${id} ---`);
      console.log('Raw doc object:', doc);
      console.log('doc.type value:', doc.type);
      console.log('typeof doc.type:', typeof doc.type);
      console.log('doc.type === undefined:', doc.type === undefined);
      console.log('doc.type === null:', doc.type === null);
      console.log('doc.type === "plastique":', doc.type === "plastique");
      
      const finalType = doc.type || 'caoutchouc';
      console.log('Final type assigned:', finalType);
      
      const result = {
        id,
        name: doc.name,
        type: finalType,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      };
      
      console.log('Result object:', result);
      console.log('--- End processing document ---\n');
      
      return result;
    });
    
    console.log('\n=== FINAL DOCUMENTS ARRAY ===');
    console.log(JSON.stringify(documents, null, 2));
    console.log('=== END FINAL ARRAY ===\n');
    
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific document data
app.get('/api/documents/:id', async (req, res) => {
  try {
    await db.read();
    const document = db.data.documents[req.params.id];
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new document
app.post('/api/documents', async (req, res) => {
  try {
    console.log('=== CREATING NEW DOCUMENT ===');
    console.log('Received request body:', req.body);
    
    const { id, name, type = 'caoutchouc' } = req.body;
    
    console.log('Extracted values:', { id, name, type });
    console.log('typeof type:', typeof type);
    
    if (!id || !name) {
      return res.status(400).json({ error: 'ID and name are required' });
    }

    await db.read();
    
    if (db.data.documents[id]) {
      return res.status(409).json({ error: 'Document with this ID already exists' });
    }

    const newDocument = {
      id,
      name,
      type, // This should be the type from the request
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      valueColumns: 1,
      columnNames: ["Valeur 1"],
      data: {}
    };

    console.log('New document object to save:', newDocument);

    db.data.documents[id] = newDocument;
    await db.write();
    
    console.log('Document saved. Reading back from database...');
    await db.read();
    const savedDoc = db.data.documents[id];
    console.log('Saved document from database:', savedDoc);
    console.log('=== END CREATING DOCUMENT ===');
    
    res.status(201).json(newDocument);
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update document data
app.put('/api/documents/:id', async (req, res) => {
  try {
    await db.read();
    
    if (!db.data.documents[req.params.id]) {
      return res.status(404).json({ error: 'Document not found' });
    }

    db.data.documents[req.params.id] = {
      ...db.data.documents[req.params.id],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await db.write();
    res.json({ message: 'Document updated successfully' });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update document name
app.put('/api/documents/:id/name', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    await db.read();
    
    if (!db.data.documents[req.params.id]) {
      return res.status(404).json({ error: 'Document not found' });
    }

    db.data.documents[req.params.id].name = name;
    db.data.documents[req.params.id].updatedAt = new Date().toISOString();
    
    await db.write();
    res.json({ message: 'Document name updated successfully' });
  } catch (error) {
    console.error('Error updating document name:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete document
app.delete('/api/documents/:id', async (req, res) => {
  try {
    await db.read();
    
    if (!db.data.documents[req.params.id]) {
      return res.status(404).json({ error: 'Document not found' });
    }

    delete db.data.documents[req.params.id];
    await db.write();
    
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});