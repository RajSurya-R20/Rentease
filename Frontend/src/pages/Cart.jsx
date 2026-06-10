import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const removeFromCart = (productId) => {
    const updated = cart.filter((item) => item.product !== productId);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    toast.success('Removed from cart');
  };

  const totalAmount = cart.reduce((sum, item) => {
    return sum + (item.monthlyRent * item.tenure) + item.securityDeposit;
  }, 0);

  const handleCheckout = async () => {
    if (!user) { toast.error('Please login first'); navigate('/login'); return; }
    if (!deliveryAddress || !deliveryDate) { toast.error('Please fill delivery address and date'); return; }
    if (cart.length === 0) { toast.error('Cart is empty'); return; }

    setLoading(true);
    try {
      const items = cart.map((item) => ({ product: item.product, tenure: item.tenure }));
      await API.post('/orders', { items, deliveryAddress, deliveryDate });
      localStorage.removeItem('cart');
      setCart([]);
      toast.success('Order placed successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!user) { toast.error('Please login first'); navigate('/login'); return; }
    if (!deliveryAddress || !deliveryDate) { toast.error('Please fill delivery address and date'); return; }
    if (cart.length === 0) { toast.error('Cart is empty'); return; }

    try {
      const { data } = await API.post('/payment/create-order', { amount: totalAmount });
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'RentEase',
        description: 'Furniture & Appliance Rental',
        order_id: data.orderId,
        handler: async (response) => {
          const verify = await API.post('/payment/verify', response);
          if (verify.data.success) {
            toast.success('Payment successful! Placing order...');
            await handleCheckout();
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#2563eb' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Payment failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🛒 Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-xl">Your cart is empty</p>
            <button onClick={() => navigate('/products')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.product} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{item.category === 'Furniture' ? '🛋️' : '📺'}</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.tenure} months</p>
                      <p className="text-blue-600 font-medium">₹{item.monthlyRent}/month + ₹{item.securityDeposit} deposit</p>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.product)} className="text-red-500 hover:text-red-700 font-medium">
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow p-6 h-fit">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                {cart.map((item) => (
                  <div key={item.product} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name}</span>
                    <span>₹{(item.monthlyRent * item.tenure) + item.securityDeposit}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">₹{totalAmount}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                  <textarea value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)}
                    rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter delivery address" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                  <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
              </div>

              <button onClick={handleRazorpayPayment} disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 mb-2">
                💳 Pay with Razorpay
              </button>
              <button onClick={handleCheckout} disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Placing Order...' : 'Place Order (COD)'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;