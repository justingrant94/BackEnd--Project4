import { Link, NavLink, useNavigate } from 'react-router-dom'
import { clearSession, isLoggedIn } from '../lib/auth'

function Navbar() {
  const navigate = useNavigate()
  const loggedIn = isLoggedIn()

  function handleLogout() {
    clearSession()
    navigate('/')
  }

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Best In The Game home">
        <span className="brand-mark">BIG</span>
        <span>
          <strong>Best In The Game</strong>
          <small>Basketball directory</small>
        </span>
      </Link>

      <nav className="nav-links" aria-label="Primary navigation">
        <NavLink to="/players">Players</NavLink>
        <NavLink to="/teams">Teams</NavLink>
        {loggedIn ? (
          <button className="nav-button" type="button" onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink className="nav-cta" to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  )
}

export default Navbar
