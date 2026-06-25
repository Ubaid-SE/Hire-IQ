import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NewJob from './pages/NewJob'
import Jobs from './pages/jobs'
import CVUpload from './pages/CVUpload'
import JobDetail from './pages/JobDetail'
import CandidateDetail from './pages/CandidateDetail'
import BulkUpload from './pages/BulkUpload'
import AllCandidates from './pages/AllCandidates'
import Recommended from './pages/Recommend'
import Layout from './components/Layout'

// ProtectedRoute: token ko live check karta hai har render pe, aur Layout (sidebar) wrap karta hai
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return <Layout>{children}</Layout>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/jobs/new"
          element={<ProtectedRoute><NewJob /></ProtectedRoute>}
        />
        <Route
          path="/jobs"
          element={<ProtectedRoute><Jobs /></ProtectedRoute>}
        />
        <Route
          path="/jobs/:jobId"
          element={<ProtectedRoute><JobDetail /></ProtectedRoute>}
        />
        <Route
          path="/jobs/:jobId/upload"
          element={<ProtectedRoute><CVUpload /></ProtectedRoute>}
        />
        <Route
          path="/jobs/:jobId/bulk-upload"
          element={<ProtectedRoute><BulkUpload /></ProtectedRoute>}
        />
        <Route
          path="/candidates"
          element={<ProtectedRoute><AllCandidates /></ProtectedRoute>}
        />
        <Route
          path="/candidates/:id"
          element={<ProtectedRoute><CandidateDetail /></ProtectedRoute>}
        />
        <Route
          path="/recommended"
          element={<ProtectedRoute><Recommended /></ProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
