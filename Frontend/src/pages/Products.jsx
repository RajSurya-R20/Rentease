import { useState, useEffect, useRef } from 'react';
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
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const searchRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    fetchAllProducts();
  }, [category, city]);

  useEffect(() => {
    const subCategory = searchParams.get('subCategory');
    if (subCategory) fetchProducts({ subCategory });
    else fetchProducts();
  }, [searchParams]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAllProducts = async () => {
    try {
      const { data } = await API.get('/products');
      setAllProducts(data);
      const uniqueCities = [...new Set(data.map(p => p.city).filter(Boolean))];
      setCities(uniqueCities);
    } catch (error) {
      console.error(error);
    }
  };

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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === '') {
      // Clear search — reset to all products
      setSuggestions([]);
      setShowSuggestions(false);
      fetchProducts();
      return;
    }

    // Show live suggestions from allProducts
    const filtered = allProducts.filter(p =>
      p.name.toLowerCase().includes(value.toLowerCase()) ||
      p.subCategory?.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 6));
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (product) => {
    setSearch(product.name);
    setShowSuggestions(false);
    // Filter to show only this product
    setProducts([product]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    fetchProducts();
  };

  const handleReset = () => {
    setCategory('');
    setSearch('');
    setMinRent('');
    setMaxRent('');
    setCity('');
    setSuggestions([]);
    setShowSuggestions(false);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Browse Products</h1>

        {/* Search Bar with Dropdown */}
        <div className="relative mb-6" ref={searchRef}>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                onFocus={() => search && setShowSuggestions(suggestions.length > 0)}
                placeholder="Search products..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {/* Live Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
                  {suggestions.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleSuggestionClick(product)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-0"
                    >
                      <span className="text-2xl">
                        {product.category === 'Furniture' ? '🛋️' : '📺'}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.subCategory} · ₹{product.monthlyRent}/month</p>
                      </div>
                      <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                        product.availability ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {product.availability ? 'Available' : 'Rented'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Reset
            </button>
          </form>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-3 mb-8">
          {['', 'Furniture', 'Appliances'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full font-medium border transition ${
                category === cat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
            >
              {cat === '' ? 'All' : cat}
            </button>
          ))}

          {cities.length > 0 && (
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={minRent}
              onChange={(e) => setMinRent(e.target.value)}
              placeholder="Min ₹"
              className="w-24 border border-gray-300 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-gray-400">—</span>
            <input
              type="number"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
              placeholder="Max ₹"
              className="w-24 border border-gray-300 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={() => fetchProducts()}
              className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm hover:bg-blue-100"
            >
              Apply
            </button>
          </div>
        </div>

        {!loading && (
          <p className="text-sm text-gray-500 mb-4">{products.length} products found</p>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow hover:shadow-md transition">
                <div className="bg-blue-50 h-48 rounded-t-xl flex items-center justify-center text-6xl">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-t-xl" />
                  ) : (
                    product.category === 'Furniture' ? '🛋️' : '📺'
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.availability ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
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