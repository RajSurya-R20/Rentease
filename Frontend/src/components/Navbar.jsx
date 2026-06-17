import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 relative">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold" onClick={closeMenu}>
          🏠 RentEase
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/products" className="hover:text-blue-200">Browse</Link>
          {user ? (
            <>
              <Link to="/cart" className="hover:text-blue-200">🛒 Cart</Link>
              {user.role === 'admin' ? (
                <Link to="/admin" className="hover:text-blue-200">Admin</Link>
              ) : (
                <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-4 py-1 rounded-full font-medium hover:bg-blue-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 px-4 py-1 rounded-full font-medium hover:bg-blue-50"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 pb-2">
          <Link to="/products" onClick={closeMenu} className="hover:text-blue-200">Browse</Link>
          {user ? (
            <>
              <Link to="/cart" onClick={closeMenu} className="hover:text-blue-200">🛒 Cart</Link>
              {user.role === 'admin' ? (
                <Link to="/admin" onClick={closeMenu} className="hover:text-blue-200">Admin</Link>
              ) : (
                <Link to="/dashboard" onClick={closeMenu} className="hover:text-blue-200">Dashboard</Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-4 py-2 rounded-full font-medium hover:bg-blue-50 w-fit"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className="hover:text-blue-200">Login</Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="bg-white text-blue-600 px-4 py-2 rounded-full font-medium hover:bg-blue-50 w-fit"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;