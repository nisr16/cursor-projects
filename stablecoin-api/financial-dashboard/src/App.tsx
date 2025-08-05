import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OperationsDashboard from './components/OperationsDashboard';
import KPIDetails from './components/KPIDetails';
import BankProfile from './components/BankProfile';
import TransactionDetails from './components/TransactionDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<OperationsDashboard />} />
          <Route path="/kpi/:kpiType" element={<KPIDetails />} />
          <Route path="/bank/:bankId" element={<BankProfile />} />
          <Route path="/transaction/:transactionId" element={<TransactionDetails />} />
          <Route path="*" element={<OperationsDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
