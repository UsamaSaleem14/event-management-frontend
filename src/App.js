import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './components/Authentication/Auth'
import Events from './components/Events'
import Bookings from './components/Bookings'
import Navbar from './components/Navigation/Navbar'
import 'antd/dist/antd.min.css'
import AuthContext from './context/auth-context'

function App() {
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)

  function login(token, userId, tokenExpiration) {
    console.log(token)
    setToken(token)
    setUserId(userId)
  }

  function logout() {
    setToken(null)
    setUserId(null)
  }

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}

export default App
