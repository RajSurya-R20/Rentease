import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold">
        🏠 RentEase
      </Link>

      <div className="flex items-center gap-6">
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
    </nav>
  );
};

export default Navbar;