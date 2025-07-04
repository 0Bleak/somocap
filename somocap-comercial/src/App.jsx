import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DocumentManager from './pages/DocumentManager';
import FullTables from './pages/Caouatchouc'
import PlastiqueTables from './pages/PlastiqueTables';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DocumentManager />} />
      <Route path="/documents" element={<DocumentManager />} />
      <Route path="/caouatchouc/:id" element={<FullTables />} />
      <Route path="/plastique/:id" element={<PlastiqueTables />} />
    </Routes>
  );
}

export default App;