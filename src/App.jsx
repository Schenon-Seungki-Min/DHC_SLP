import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AllHospitals from './pages/AllHospitals';
import MapPlanner from './pages/MapPlanner';
import Admin from './pages/Admin';
import AccountSettings from './pages/AccountSettings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout><Dashboard /></Layout>
            </PrivateRoute>
          } />

          <Route path="/all-hospitals" element={
            <PrivateRoute>
              <Layout><AllHospitals /></Layout>
            </PrivateRoute>
          } />

          <Route path="/map-planner" element={
            <PrivateRoute>
              <Layout><MapPlanner /></Layout>
            </PrivateRoute>
          } />

          <Route path="/admin" element={
            <PrivateRoute adminOnly>
              <Layout><Admin /></Layout>
            </PrivateRoute>
          } />

          <Route path="/account-settings" element={
            <PrivateRoute>
              <Layout><AccountSettings /></Layout>
            </PrivateRoute>
          } />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
