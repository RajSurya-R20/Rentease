import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:bg-blue-700 transition">R</div>
          <span className="text-xl font-bold text-gray-900">Rent<span className="text-blue-600">Ease</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/products" className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive('/products') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
            Browse
          </Link>
          {user ? (
            <>
              <Link to="/cart" className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${isActive('/cart') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Cart
              </Link>
              {user.role === 'admin' ? (
                <Link to="/admin" className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive('/admin') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  Admin
                </Link>
              ) : (
                <>
                  <Link to="/dashboard" className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive('/dashboard') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                    Dashboard
                  </Link>
                  <Link to="/profile" className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive('/profile') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                    Profile
                  </Link>
                </>
              )}
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 transition font-medium">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition">
                Login
              </Link>
              <Link to="/register" className="ml-1 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 px-6 py-4 space-y-1 bg-white">
          <Link to="/products" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Browse</Link>
          {user ? (
            <>
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cart</Link>
              {user.role === 'admin' ? (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Admin</Link>
              ) : (
                <>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                </>
              )}
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-50">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
