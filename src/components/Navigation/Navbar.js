import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.style.css'
import AuthContext from '../../context/auth-context'

const Navbar = () => {
  const { token } = useContext(AuthContext)

  return (
    <header className="navbar-header">
      <div className="navbar-logo">
        <h1>EasyEvent</h1>
      </div>
      <nav className="navbar-main">
        <ul>
          {!token && (
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          {token && (
            <li>
              <NavLink to="/bookings">Bookings</NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
