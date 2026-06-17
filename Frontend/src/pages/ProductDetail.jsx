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
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchProduct(); }, [id]);
  useEffect(() => {
    API.get(`/reviews/${id}`).then(r => setReviews(r.data)).catch(() => {});
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
    if (!user) { toast.error('Please login first'); navigate('/login'); return; }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const exists = cart.find((item) => item.product === product._id);
    if (exists) { toast.error('Already in cart!'); return; }
    cart.push({ product: product._id, name: product.name, monthlyRent: product.monthlyRent,
      securityDeposit: product.securityDeposit, tenure, category: product.category });
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Added to cart!');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); return; }
    setSubmittingReview(true);
    try {
      const { data } = await API.post('/reviews', { productId: id, ...newReview });
      setReviews([data, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      toast.success('Review submitted!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    } finally { setSubmittingReview(false); }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return null;

  const totalAmount = (product.monthlyRent * tenure) + product.securityDeposit;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="bg-white rounded-xl shadow p-4 sm:p-8 mb-6">

          {/* Image */}
          <div className="bg-blue-50 rounded-xl flex items-center justify-center h-48 sm:h-64 mb-6 overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-xl" />
            ) : (
              <span className="text-6xl sm:text-8xl">{product.category === 'Furniture' ? '🛋️' : '📺'}</span>
            )}
          </div>

          {/* Info */}
          <div>
            <span className="text-xs sm:text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
              {product.category} · {product.subCategory}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mt-3 mb-2">{product.name}</h1>
            <p className="text-gray-500 text-sm sm:text-base mb-3">{product.description}</p>
            <p className="text-gray-500 text-sm mb-3">📍 {product.city}</p>

            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
              product.availability ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {product.availability ? '✅ Available' : '❌ Not Available'}
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 text-sm sm:text-base">Monthly Rent</span>
                <span className="font-bold text-blue-600 text-sm sm:text-base">₹{product.monthlyRent}/month</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 text-sm sm:text-base">Security Deposit</span>
                <span className="font-semibold text-sm sm:text-base">₹{product.securityDeposit}</span>
              </div>
              <div className="flex justify-between font-bold text-base sm:text-lg border-t pt-2 mt-2">
                <span>Total ({tenure} months)</span>
                <span className="text-blue-600">₹{totalAmount}</span>
              </div>
            </div>

            {/* Tenure */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Tenure</label>
              <div className="flex flex-wrap gap-2">
                {product.tenureOptions?.map((t) => (
                  <button key={t} onClick={() => setTenure(t)}
                    className={`px-3 py-2 rounded-lg border font-medium transition text-sm ${
                      tenure === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}>
                    {t} months
                  </button>
                ))}
              </div>
            </div>

            <button onClick={addToCart} disabled={!product.availability}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {product.availability ? '🛒 Add to Cart' : 'Not Available'}
            </button>
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>

          {user && (
            <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Write a Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <select value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ⭐</option>)}
                  </select>
                </div>
                <textarea value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required rows={3} placeholder="Share your experience..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <button type="submit" disabled={submittingReview}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}

          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review._id} className="bg-white rounded-xl shadow p-4 sm:p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">{review.user?.name}</p>
                      <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-yellow-500 font-bold text-sm">{'⭐'.repeat(review.rating)}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;