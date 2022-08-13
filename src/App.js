import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './components/Auth'
import Events from './components/Events'
import Bookings from './components/Bookings'
import Navbar from './components/Navigation/Navbar'

function App() {
  return (
    <BrowserRouter>
      <>
        <Navbar />
        <main className="main-box">
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/events" element={<Events />} />
            <Route path="/bookings" element={<Bookings />} />
          </Routes>
        </main>
      </>
    </BrowserRouter>
  )
}

export default App
