import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchProducts();
  }, [category, city]);

  useEffect(() => {
    const subCategory = searchParams.get('subCategory');
    if (subCategory) fetchProducts({ subCategory });
    else fetchProducts();
  }, [searchParams]);

  const fetchProducts = async (extra = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (city) params.append('city', city);
      if (search) params.append('search', search);
      if (minRent) params.append('minRent', minRent);
      if (maxRent) params.append('maxRent', maxRent);
      Object.entries(extra).forEach(([k, v]) => params.append(k, v));

      const { data } = await API.get(`/products?${params.toString()}`);
      setProducts(data);

      const uniqueCities = [...new Set(data.map(p => p.city).filter(Boolean))];
      setCities(uniqueCities);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleReset = () => {
    setCategory('');
    setSearch('');
    setMinRent('');
    setMaxRent('');
    setCity('');
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Browse Products</h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 sm:flex-none bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 sm:flex-none bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Category Filter */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {['', 'Furniture', 'Appliances'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 px-5 py-2 rounded-full font-medium border transition text-sm ${
                category === cat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
            >
              {cat === '' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* City + Price Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_1fr_auto] gap-2 mb-8 items-center">
          {cities.length > 0 && (
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
            >
              <option value="">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}

          <input
            type="number"
            value={minRent}
            onChange={(e) => setMinRent(e.target.value)}
            placeholder="Min ₹"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />

          <input
            type="number"
            value={maxRent}
            onChange={(e) => setMaxRent(e.target.value)}
            placeholder="Max ₹"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />

          <button
            onClick={() => fetchProducts()}
            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-100 w-full sm:w-auto"
          >
            Apply
          </button>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-4">{products.length} products found</p>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-full mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-500">No products found</p>
            <button onClick={handleReset} className="mt-4 text-blue-600 hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow hover:shadow-md transition">
                <div className="bg-blue-50 h-48 rounded-t-xl flex items-center justify-center text-6xl overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-t-xl" />
                  ) : (
                    product.category === 'Furniture' ? '🛋️' : '📺'
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full shrink-0 ml-2 ${
                      product.availability
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {product.availability ? 'Available' : 'Rented'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{product.subCategory} · {product.city}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-blue-600 font-bold text-lg">₹{product.monthlyRent}</span>
                      <span className="text-gray-400 text-sm">/month</span>
                    </div>
                    <Link
                      to={`/products/${product._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;