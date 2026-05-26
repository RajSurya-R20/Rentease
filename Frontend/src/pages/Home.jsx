import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Rent Furniture & Appliances</h1>
        <p className="text-xl mb-8 text-blue-100">
          Affordable monthly rentals for students and working professionals
        </p>
        <Link
          to="/products"
          className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-50"
        >
          Browse Products
        </Link>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why RentEase?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Affordable Plans</h3>
            <p className="text-gray-600">Monthly rental plans starting from ₹299. No huge upfront costs.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-2">Free Delivery</h3>
            <p className="text-gray-600">We deliver and pick up at your doorstep. Hassle-free relocation.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-xl font-semibold mb-2">Maintenance Support</h3>
            <p className="text-gray-600">Free maintenance and repair support throughout your rental period.</p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: 'Sofa', icon: '🛋️', category: 'Furniture' },
              { name: 'Bed', icon: '🛏️', category: 'Furniture' },
              { name: 'Table', icon: '🪑', category: 'Furniture' },
              { name: 'Fridge', icon: '🧊', category: 'Appliances' },
              { name: 'Washing Machine', icon: '🫧', category: 'Appliances' },
              { name: 'TV', icon: '📺', category: 'Appliances' },
            ].map((item) => (
              <Link
                key={item.name}
                to={`/products?subCategory=${item.name}`}
                className="bg-gray-50 p-6 rounded-xl text-center hover:bg-blue-50 hover:shadow transition"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="font-semibold text-gray-700">{item.name}</div>
                <div className="text-sm text-gray-400">{item.category}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-6">
        <p>© 2026 RentEase — Furniture & Appliance Rental Platform</p>
      </footer>
    </div>
  );
};

export default Home;