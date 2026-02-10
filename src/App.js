import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './utils/firebaseDiagnostics'; // Run diagnostics on app load
// Migration removed - run manually if needed: migrateToFirebase() in console
import { DonationProvider } from './contexts/DonationContext';
import { AuthProvider } from './contexts/AuthContext';
import { firebaseError } from './config/firebase';
import FirebaseError from './components/FirebaseError';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Mission from './pages/Mission';
import WhatWeDo from './pages/WhatWeDo';
import Impact from './pages/Impact';
import Stories from './pages/Stories';
import StoryDetail from './pages/StoryDetail';
import GetInvolved from './pages/GetInvolved';
import Contact from './pages/Contact';
import DashboardOverview from './pages/DashboardOverview';
import DashboardDonations from './pages/DashboardDonations';
import DashboardStories from './pages/DashboardStories';
import StoryEdit from './pages/StoryEdit';
import DashboardEmails from './pages/DashboardEmails';
import DashboardUsers from './pages/DashboardUsers';
import DashboardProfile from './pages/DashboardProfile';
import DashboardLogin from './pages/DashboardLogin';

function App() {
  return (
    <>
      {firebaseError && <FirebaseError />}
      <AuthProvider>
        <DonationProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Dashboard routes */}
            <Route path="/dashboard/login" element={<DashboardLogin />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={
                <RoleProtectedRoute>
                  <DashboardOverview />
                </RoleProtectedRoute>
              } />
              <Route path="donations" element={
                <RoleProtectedRoute>
                  <DashboardDonations />
                </RoleProtectedRoute>
              } />
              <Route path="stories" element={
                <RoleProtectedRoute>
                  <DashboardStories />
                </RoleProtectedRoute>
              } />
              <Route path="stories/new" element={
                <RoleProtectedRoute>
                  <StoryEdit />
                </RoleProtectedRoute>
              } />
              <Route path="stories/:id/edit" element={
                <RoleProtectedRoute>
                  <StoryEdit />
                </RoleProtectedRoute>
              } />
              <Route path="users" element={
                <RoleProtectedRoute>
                  <DashboardUsers />
                </RoleProtectedRoute>
              } />
              <Route path="profile" element={
                <RoleProtectedRoute>
                  <DashboardProfile />
                </RoleProtectedRoute>
              } />
              <Route path="emails" element={
                <RoleProtectedRoute>
                  <DashboardEmails />
                </RoleProtectedRoute>
              } />
            </Route>
            
            {/* Public routes with navbar and footer */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="mission" element={<Mission />} />
              <Route path="what-we-do" element={<WhatWeDo />} />
              <Route path="impact" element={<Impact />} />
              <Route path="stories" element={<Stories />} />
              <Route path="stories/:id" element={<StoryDetail />} />
              <Route path="get-involved" element={<GetInvolved />} />
              <Route path="contact" element={<Contact />} />
            </Route>
          </Routes>
        </Router>
      </DonationProvider>
    </AuthProvider>
    </>
  );
}

export default App;
