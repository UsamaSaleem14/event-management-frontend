import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Auth from './components/Authentication/Auth'
import Events from './components/Events'
import Bookings from './components/Bookings'
import Navbar from './components/Navigation/Navbar'
import 'antd/dist/antd.min.css'
import AuthContext from './context/auth-context'
import { useNavigate } from 'react-router-dom'

function App() {
  let navigate = useNavigate()

  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)

  function login(token, userId, tokenExpiration) {
    setToken(token)
    setUserId(userId)
    navigate('/events', { replace: true })
  }

  function logout() {
    setToken(null)
    setUserId(null)
    navigate('/', { replace: true })
  }

  return (
    <>
      <AuthContext.Provider value={{ token, userId, login, logout }}>
        <Navbar />
        <main className="main-box">
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/events" element={<Events />} />
            {token && <Route path="/bookings" element={<Bookings />} />}
          </Routes>
        </main>
      </AuthContext.Provider>
    </>
  )
}

export default App
