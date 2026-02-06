import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WordsPage from './pages/WordsPage';
import WordDetailPage from './pages/WordDetailPage';
import SentencesPage from './pages/SentencesPage';
import GrammarPage from './pages/GrammarPage';
import GrammarCasePage from './pages/GrammarCasePage';
import VerbsPage from './pages/VerbsPage';
import ExercisesPage from './pages/ExercisesPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminWords from './pages/admin/AdminWords';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-xl">Юкланмоқда...</div></div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-xl">Юкланмоқда...</div></div>;
  return isAuthenticated ? <Navigate to="/" /> : children;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="words" element={<WordsPage />} />
        <Route path="words/:id" element={<WordDetailPage />} />
        <Route path="sentences" element={<SentencesPage />} />
        <Route path="grammar" element={<GrammarPage />} />
        <Route path="grammar/:id" element={<GrammarCasePage />} />
        <Route path="verbs" element={<VerbsPage />} />
        <Route path="exercises" element={<ExercisesPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/users" element={<AdminUsers />} />
        <Route path="admin/words" element={<AdminWords />} />
      </Route>
    </Routes>
  );
}

function AuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  if (token) {
    localStorage.setItem('token', token);
    window.location.href = '/';
  }
  return <div>Кириш...</div>;
}
