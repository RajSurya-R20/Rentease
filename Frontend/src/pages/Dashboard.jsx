import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  active: 'bg-green-100 text-green-700',
  extended: 'bg-blue-100 text-blue-700',
  returned: 'bg-gray-100 text-gray-600',
  overdue: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const Dashboard = () => {
  const [rentals, setRentals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('rentals');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [rentalsRes, ordersRes] = await Promise.all([
        API.get('/rentals/myrentals'),
        API.get('/orders/myorders')
      ]);
      setRentals(rentalsRes.data);
      setOrders(ordersRes.data);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (rentalId) => {
    try {
      await API.put(`/rentals/${rentalId}/return`);
      toast.success('Return scheduled!');
      fetchData();
    } catch { toast.error('Failed to schedule return'); }
  };

  const handleExtend = async (rentalId) => {
    try {
      await API.put(`/rentals/${rentalId}/extend`, { extraMonths: 1 });
      toast.success('Rental extended by 1 month!');
      fetchData();
    } catch { toast.error('Failed to extend rental'); }
  };

  const activeRentals = rentals.filter(r => r.status === 'active' || r.status === 'extended').length;
  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, <span className="text-blue-600 font-semibold">{user?.name}</span></p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Rentals', value: activeRentals, icon: '📋', color: 'text-blue-600' },
            { label: 'Total Orders', value: orders.length, icon: '🛒', color: 'text-green-600' },
            { label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, icon: '💰', color: 'text-purple-600' },
            { label: 'Completed', value: rentals.filter(r => r.status === 'returned').length, icon: '✅', color: 'text-gray-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
          {[['rentals', '📋 My Rentals'], ['orders', '🛒 My Orders']].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition ${activeTab === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-28 animate-pulse border border-gray-100"></div>)}
          </div>
        ) : activeTab === 'rentals' ? (
          <div className="space-y-4">
            {rentals.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="text-5xl mb-3">📋</div>
                <p className="text-gray-500 font-medium">No rentals yet</p>
                <button onClick={() => navigate('/products')} className="mt-4 text-blue-600 text-sm font-semibold hover:underline">Browse products →</button>
              </div>
            ) : rentals.map((rental) => (
              <div key={rental._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-3xl flex-shrink-0">
                      {rental.product?.category === 'Furniture' ? '🛋️' : '📺'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{rental.product?.name}</h3>
                      <p className="text-gray-400 text-sm mt-0.5">
                        {new Date(rental.startDate).toLocaleDateString('en-IN')} → {new Date(rental.endDate).toLocaleDateString('en-IN')}
                      </p>
                      <p className="text-blue-600 font-semibold text-sm mt-1">₹{rental.monthlyRent}/month · {rental.tenure} months</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[rental.status] || 'bg-gray-100 text-gray-600'}`}>
                    {rental.status}
                  </span>
                </div>
                {(rental.status === 'active' || rental.status === 'extended') && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                    <button onClick={() => handleExtend(rental._id)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                      + Extend 1 Month
                    </button>
                    <button onClick={() => handleReturn(rental._id)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition">
                      Schedule Return
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="text-5xl mb-3">🛒</div>
                <p className="text-gray-500 font-medium">No orders yet</p>
                <button onClick={() => navigate('/products')} className="mt-4 text-blue-600 text-sm font-semibold hover:underline">Start shopping →</button>
              </div>
            ) : orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-800">Order #{order._id.slice(-6).toUpperCase()}</h3>
                    <p className="text-gray-400 text-sm mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p className="text-gray-500 text-sm mt-0.5">📍 {order.deliveryAddress}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                    <p className="text-blue-600 font-bold text-lg mt-1">₹{order.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="border-t border-gray-50 pt-4">
                  <div className="space-y-1 mb-3">
                    {order.items?.map((item, i) => (
                      <p key={i} className="text-sm text-gray-600">• {item.product?.name} — {item.tenure} months</p>
                    ))}
                  </div>
                  <button
                    onClick={() => window.open(`${import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000'}/api/orders/${order._id}/invoice`, '_blank')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition border border-gray-200">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Download Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
