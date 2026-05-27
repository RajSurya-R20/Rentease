import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchProducts();
  }, [category]);

  useEffect(() => {
    const subCategory = searchParams.get('subCategory');

    if (subCategory) fetchProductsBySubCategory(subCategory);
    else fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      const params = category ? `?category=${category}` : '';
      const { data } = await API.get(`/products${params}`);
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsBySubCategory = async (subCategory) => {
    try {
      const { data } = await API.get(`/products?subCategory=${subCategory}`);
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Browse Products
        </h1>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-8">
          {['', 'Furniture', 'Appliances'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 rounded-full font-medium border transition ${
                category === cat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
            >
              {cat === '' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-xl shadow animate-pulse"
              >
                <div className="bg-gray-200 h-48 rounded-t-xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow hover:shadow-md transition"
              >
                <div className="bg-blue-50 h-48 rounded-t-xl flex items-center justify-center text-6xl">
                  {product.category === 'Furniture' ? '🛋️' : '📺'}
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        product.availability
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {product.availability ? 'Available' : 'Rented'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-3">
                    {product.subCategory} · {product.city}
                  </p>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-blue-600 font-bold text-lg">
                        ₹{product.monthlyRent}
                      </span>
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
