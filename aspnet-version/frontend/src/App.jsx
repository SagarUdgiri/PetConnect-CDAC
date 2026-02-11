import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './features/auth/pages/RegisterPage';
import LoginPage from './features/auth/pages/LoginPage';
import PetRegisterPage from './features/pets/pages/PetRegisterPage';
import MyPetsPage from './features/pets/pages/MyPetsPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import SocialFeedPage from './features/social/pages/SocialFeedPage';
import NotificationsPage from './features/social/pages/NotificationsPage';
import ConnectionsPage from './features/social/pages/ConnectionsPage';
import MyPostsPage from './features/social/pages/MyPostsPage';
import AdminPage from './features/dashboard/pages/AdminPage';
import LostFoundPage from './features/pets/pages/LostFoundPage';
import PetshopPage from './features/shop/pages/PetshopPage';
import FindFriendsPage from './features/social/pages/FindFriendsPage';
import AppNavbar from './components/layout/AppNavbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { Toaster } from 'react-hot-toast';
import './App.css';

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role?.toUpperCase() === 'ADMIN' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <div className="app-container">
          <AppNavbar />
          <main>
            <Routes>
              <Route path="/" element={<RoleBasedRedirect />} />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } 
              />
              
              {/* Protected User Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/feed" 
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <SocialFeedPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pets/register" 
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <PetRegisterPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-pets" 
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <MyPetsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <NotificationsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/connections" 
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <ConnectionsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-posts" 
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <MyPostsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/lost-found" 
                element={
                  <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                    <LostFoundPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/petshop" 
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <PetshopPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/discover" 
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <FindFriendsPage />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />

              <Route path="*" element={<Navigate to="/register" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

