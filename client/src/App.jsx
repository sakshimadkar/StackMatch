import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Analyze from './pages/Analyze'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  )
  if (!user) return <Navigate to="/login" />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <BrowserRouter>
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        transition: 'background-color 0.3s, color 0.3s'
      }}>
        <Navbar />
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/analyze" element={<ProtectedRoute><Analyze /></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}