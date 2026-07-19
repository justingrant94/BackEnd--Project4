import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import { isLoggedIn } from './lib/auth'
import Game from './pages/Game'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import PlayerDetail from './pages/PlayerDetail'
import Players from './pages/Players'
import Register from './pages/Register'
import Teams from './pages/Teams'

function RequireAuth({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/players" element={<Players />} />
        <Route path="/players/:id" element={<PlayerDetail />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/game" element={<RequireAuth><Game /></RequireAuth>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
