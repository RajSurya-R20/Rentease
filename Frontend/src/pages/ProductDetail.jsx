import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tenure, setTenure] = useState(3);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
      if (data.tenureOptions?.length > 0) setTenure(data.tenureOptions[0]);
    } catch (error) {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const exists = cart.find((item) => item.product === product._id);
    if (exists) {
      toast.error('Already in cart!');
      return;
    }
    cart.push({
      product: product._id,
      name: product.name,
      monthlyRent: product.monthlyRent,
      securityDeposit: product.securityDeposit,
      tenure,
      category: product.category
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Added to cart!');
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return null;

  const totalAmount = (product.monthlyRent * tenure) + product.securityDeposit;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Product Image */}
            <div className="bg-blue-50 rounded-xl flex items-center justify-center h-64 text-8xl">
              {product.category === 'Furniture' ? '🛋️' : '📺'}
            </div>

            {/* Product Info */}
            <div>
              <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                {product.category} · {product.subCategory}
              </span>
              <h1 className="text-2xl font-bold text-gray-800 mt-3 mb-2">{product.name}</h1>
              <p className="text-gray-500 mb-4">{product.description}</p>
              <p className="text-gray-500 mb-4">📍 {product.city}</p>

              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                product.availability
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}>
                {product.availability ? '✅ Available' : '❌ Not Available'}
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Monthly Rent</span>
                  <span className="font-bold text-blue-600">₹{product.monthlyRent}/month</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Security Deposit</span>
                  <span className="font-semibold">₹{product.securityDeposit}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                  <span>Total ({tenure} months)</span>
                  <span className="text-blue-600">₹{totalAmount}</span>
                </div>
              </div>

              {/* Tenure Options */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Tenure
                </label>
                <div className="flex gap-3">
                  {product.tenureOptions?.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTenure(t)}
                      className={`px-4 py-2 rounded-lg border font-medium transition ${
                        tenure === t
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {t} months
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={addToCart}
                disabled={!product.availability}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.availability ? '🛒 Add to Cart' : 'Not Available'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;