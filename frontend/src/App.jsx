import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NewJob from './pages/NewJob'
import Jobs from './pages/Jobs'
import CVUpload from './pages/CVUpload'
import JobDetail from './pages/JobDetail'
import CandidateDetail from './pages/CandidateDetail'

function App() {
  const token = localStorage.getItem('token')

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/jobs/new" element={token ? <NewJob /> : <Navigate to="/login" />} />
 <Route path="/jobs/:jobId/upload" element={token ? <CVUpload /> : <Navigate to="/login" />} />      
       <Route path="/candidates/:id" element={token ? <CandidateDetail /> : <Navigate to="/login" />} />
        <Route path="/jobs" element={token ? <Jobs /> : <Navigate to="/login" />} />
      <Route path="/jobs/:jobId" element={token ? <JobDetail /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App