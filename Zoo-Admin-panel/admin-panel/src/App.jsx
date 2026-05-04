import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Animals from './pages/Animals';
import Staff from './pages/Staff';
import Payments from './pages/Payments';
import Documents from './pages/Documents';
import Chatbot from './pages/Chatbot';
import Login from './pages/Login';

import Weather from './pages/Weather';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token || role !== 'admin') return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

const App = () => {
  return (
    <Router basename="/ZooManagementSystem_Web-Project/">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/animals" element={<ProtectedRoute><Animals /></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
        <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
