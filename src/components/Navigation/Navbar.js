import { NavLink } from 'react-router-dom'
import './Navbar.style.css'

const Navbar = () => {
  return (
    <header className='navbar-header'>
      <div className="navbar-logo">
        <h1>EasyEvent</h1>
      </div>
      <nav className="navbar-main">
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          <li>
            <NavLink to="/bookings">Bookings</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
