import { Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import TopNav from './components/layout/TopNav'
import AlertDetail from './pages/AlertDetail'
import Alerts from './pages/Alerts'
import Baseline from './pages/Baseline'
import Dashboard from './pages/Dashboard'
import DeviceDrillDown from './pages/DeviceDrillDown'
import Devices from './pages/Devices'
import Models from './pages/Models'
import ResponseActions from './pages/ResponseActions'
import Settings from './pages/Settings'
import Threats from './pages/Threats'

function App() {
  return (
    <div className="app-grid min-h-screen bg-tron-black text-tron-text">
      <div className="mx-auto grid max-w-[1700px] lg:grid-cols-[260px_1fr]">
        <Sidebar />
        <main className="p-4 md:p-6">
          <TopNav />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/devices/:deviceId" element={<DeviceDrillDown />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/alerts/:alertId" element={<AlertDetail />} />
            <Route path="/response-actions" element={<ResponseActions />} />
            <Route path="/threats" element={<Threats />} />
            <Route path="/baseline" element={<Baseline />} />
            <Route path="/models" element={<Models />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
