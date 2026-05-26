import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [rentals, setRentals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('rentals');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
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
    } catch (error) {
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
    } catch (error) {
      toast.error('Failed to schedule return');
    }
  };

  const handleExtend = async (rentalId) => {
    try {
      await API.put(`/rentals/${rentalId}/extend`, { extraMonths: 1 });
      toast.success('Rental extended by 1 month!');
      fetchData();
    } catch (error) {
      toast.error('Failed to extend rental');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-600';
      case 'extended': return 'bg-blue-100 text-blue-600';
      case 'returned': return 'bg-gray-100 text-gray-600';
      case 'overdue': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user?.name}! 👋
        </h1>
        <p className="text-gray-500 mb-8">Manage your rentals and orders</p>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {['rentals', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-medium capitalize transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-400'
              }`}
            >
              {tab === 'rentals' ? '📋 My Rentals' : '🛒 My Orders'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : activeTab === 'rentals' ? (
          <div className="space-y-4">
            {rentals.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <div className="text-6xl mb-4">📋</div>
                <p>No active rentals yet</p>
              </div>
            ) : (
              rentals.map((rental) => (
                <div key={rental._id} className="bg-white rounded-xl shadow p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="text-4xl">
                        {rental.product?.category === 'Furniture' ? '🛋️' : '📺'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {rental.product?.name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {new Date(rental.startDate).toLocaleDateString()} →{' '}
                          {new Date(rental.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-blue-600 font-medium">
                          ₹{rental.monthlyRent}/month · {rental.tenure} months
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(rental.status)}`}>
                      {rental.status}
                    </span>
                  </div>

                  {rental.status === 'active' || rental.status === 'extended' ? (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleExtend(rental._id)}
                        className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100"
                      >
                        + Extend 1 Month
                      </button>
                      <button
                        onClick={() => handleReturn(rental._id)}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100"
                      >
                        Schedule Return
                      </button>
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <div className="text-6xl mb-4">🛒</div>
                <p>No orders yet</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="bg-white rounded-xl shadow p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-500 text-sm">
                        📍 {order.deliveryAddress}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-600'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {order.status}
                      </span>
                      <p className="text-blue-600 font-bold mt-1">₹{order.totalAmount}</p>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    {order.items?.map((item, index) => (
                      <p key={index} className="text-sm text-gray-600">
                        • {item.product?.name} — {item.tenure} months
                      </p>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;