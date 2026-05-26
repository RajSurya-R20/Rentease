import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', category: 'Furniture',
    subCategory: 'Sofa', monthlyRent: '', securityDeposit: '',
    tenureOptions: [3, 6, 12], stock: 1, city: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes, rentalsRes, maintenanceRes] = await Promise.all([
        API.get('/products'),
        API.get('/orders'),
        API.get('/rentals'),
        API.get('/maintenance')
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setRentals(rentalsRes.data);
      setMaintenance(maintenanceRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await API.post('/products', newProduct);
      toast.success('Product added!');
      setNewProduct({
        name: '', description: '', category: 'Furniture',
        subCategory: 'Sofa', monthlyRent: '', securityDeposit: '',
        tenureOptions: [3, 6, 12], stock: 1, city: ''
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { status });
      toast.success('Order status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const handleUpdateMaintenance = async (id, status) => {
    try {
      await API.put(`/maintenance/${id}`, { status });
      toast.success('Maintenance request updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update maintenance');
    }
  };

  const tabs = [
    { id: 'products', label: '📦 Products' },
    { id: 'orders', label: '🛒 Orders' },
    { id: 'rentals', label: '📋 Rentals' },
    { id: 'maintenance', label: '🔧 Maintenance' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-500 mb-6">Manage your RentEase platform</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Products', value: products.length, icon: '📦' },
            { label: 'Orders', value: orders.length, icon: '🛒' },
            { label: 'Active Rentals', value: rentals.filter(r => r.status === 'active').length, icon: '📋' },
            { label: 'Maintenance', value: maintenance.filter(m => m.status === 'open').length, icon: '🔧' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full font-medium transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : (
          <>
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                {/* Add Product Form */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Product</h2>
                  <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="Furniture">Furniture</option>
                      <option value="Appliances">Appliances</option>
                    </select>
                    <select
                      value={newProduct.subCategory}
                      onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option>Sofa</option>
                      <option>Bed</option>
                      <option>Table</option>
                      <option>Fridge</option>
                      <option>Washing Machine</option>
                      <option>TV</option>
                      <option>Other</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Monthly Rent (₹)"
                      value={newProduct.monthlyRent}
                      onChange={(e) => setNewProduct({ ...newProduct, monthlyRent: e.target.value })}
                      required
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      type="number"
                      placeholder="Security Deposit (₹)"
                      value={newProduct.securityDeposit}
                      onChange={(e) => setNewProduct({ ...newProduct, securityDeposit: e.target.value })}
                      required
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={newProduct.city}
                      onChange={(e) => setNewProduct({ ...newProduct, city: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      type="submit"
                      className="md:col-span-2 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
                    >
                      Add Product
                    </button>
                  </form>
                </div>

                {/* Products List */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-4 py-3 text-left">Product</th>
                        <th className="px-4 py-3 text-left">Category</th>
                        <th className="px-4 py-3 text-left">Rent</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{product.name}</td>
                          <td className="px-4 py-3 text-gray-500">{product.subCategory}</td>
                          <td className="px-4 py-3 text-blue-600">₹{product.monthlyRent}/mo</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              product.availability
                                ? 'bg-green-100 text-green-600'
                                : 'bg-red-100 text-red-600'
                            }`}>
                              {product.availability ? 'Available' : 'Rented'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="text-red-500 hover:text-red-700 text-xs font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-xl shadow p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Order #{order._id.slice(-6).toUpperCase()}</h3>
                        <p className="text-gray-500 text-sm">👤 {order.user?.name} · {order.user?.email}</p>
                        <p className="text-gray-500 text-sm">📍 {order.deliveryAddress}</p>
                        <p className="text-blue-600 font-medium">₹{order.totalAmount}</p>
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Rentals Tab */}
            {activeTab === 'rentals' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left">User</th>
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-left">Tenure</th>
                      <th className="px-4 py-3 text-left">End Date</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentals.map((rental) => (
                      <tr key={rental._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3">{rental.user?.name}</td>
                        <td className="px-4 py-3">{rental.product?.name}</td>
                        <td className="px-4 py-3">{rental.tenure} months</td>
                        <td className="px-4 py-3">{new Date(rental.endDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            rental.status === 'active' ? 'bg-green-100 text-green-600' :
                            rental.status === 'returned' ? 'bg-gray-100 text-gray-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {rental.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Maintenance Tab */}
            {activeTab === 'maintenance' && (
              <div className="space-y-4">
                {maintenance.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">No maintenance requests</div>
                ) : (
                  maintenance.map((req) => (
                    <div key={req._id} className="bg-white rounded-xl shadow p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{req.issue}</h3>
                          <p className="text-gray-500 text-sm">👤 {req.user?.name}</p>
                          <p className="text-gray-500 text-sm">📦 {req.product?.name}</p>
                          <p className="text-gray-600 text-sm mt-1">{req.description}</p>
                        </div>
                        <select
                          value={req.status}
                          onChange={(e) => handleUpdateMaintenance(req._id, e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none"
                        >
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;