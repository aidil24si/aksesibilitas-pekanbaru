import { Route, Routes } from 'react-router-dom'
import { AccessibilityProvider } from './contexts'
import RootLayout from './layouts/RootLayout'
import BerandaPage from './pages/BerandaPage'
import FasilitasPage from './pages/FasilitasPage'
import DetailFasilitasPage from './pages/DetailFasilitasPage'
import LaporPage from './pages/LaporPage'
import TidakDitemukanPage from './pages/TidakDitemukanPage'

function App() {
  return (
    <AccessibilityProvider>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<BerandaPage />} />
          <Route path="fasilitas" element={<FasilitasPage />} />
          <Route path="fasilitas/:id" element={<DetailFasilitasPage />} />
          <Route path="lapor" element={<LaporPage />} />
          <Route path="*" element={<TidakDitemukanPage />} />
        </Route>
      </Routes>
    </AccessibilityProvider>
  )
}

export default App
