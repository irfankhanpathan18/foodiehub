import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShoppingBag,
  Users,
  UtensilsCrossed,
  DollarSign,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { AdminDashboardStats, Order, Food, OrderStatus } from '../types';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'foods'>('overview');
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  // Orders Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [orderSearch, setOrderSearch] = useState('');

  // Food Modal State (Add / Edit)
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [foodFormData, setFoodFormData] = useState({
    name: '',
    description: '',
    price: 200,
    imageUrl: '',
    category: 'Indian',
    isVegetarian: true,
    isAvailable: true,
  });

  // Verify Admin Access
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      error('Access restricted to administrators only.');
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes, foodsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/orders?limit=50'),
        api.get('/foods?limit=100'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (ordersRes.data.success) setOrders(ordersRes.data.data);
      if (foodsRes.data.success) setFoods(foodsRes.data.data);
    } catch (err: any) {
      console.error('Admin data fetch error:', err);
      error('Failed to load admin statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        success(`Order status updated to ${newStatus}`);
        setOrders((prev) =>
          prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
        );
        // Refresh dashboard stats in background
        api.get('/admin/dashboard').then((r) => r.data.success && setStats(r.data.data));
      }
    } catch (err: any) {
      error('Failed to update order status.');
    }
  };

  // Toggle food availability
  const handleToggleFoodAvailability = async (food: Food) => {
    try {
      const updated = !food.isAvailable;
      const res = await api.patch(`/admin/foods/${food.id}`, { isAvailable: updated });
      if (res.data.success) {
        success(`${food.name} is now ${updated ? 'Available' : 'Unavailable'}`);
        setFoods((prev) =>
          prev.map((f) => (f.id === food.id ? { ...f, isAvailable: updated } : f))
        );
      }
    } catch (err) {
      error('Failed to update food availability.');
    }
  };

  // Delete food item
  const handleDeleteFood = async (foodId: string, foodName: string) => {
    if (!window.confirm(`Are you sure you want to remove "${foodName}" from the menu?`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/foods/${foodId}`);
      if (res.data.success) {
        success(`Removed "${foodName}" successfully.`);
        setFoods((prev) => prev.filter((f) => f.id !== foodId));
      }
    } catch (err) {
      error('Failed to delete food item.');
    }
  };

  // Open modal for new food
  const handleOpenAddFoodModal = () => {
    setEditingFood(null);
    setFoodFormData({
      name: '',
      description: '',
      price: 250,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      category: 'Indian',
      isVegetarian: true,
      isAvailable: true,
    });
    setIsFoodModalOpen(true);
  };

  // Open modal for editing food
  const handleOpenEditFoodModal = (food: Food) => {
    setEditingFood(food);
    setFoodFormData({
      name: food.name,
      description: food.description,
      price: food.price,
      imageUrl: food.imageUrl,
      category: food.category,
      isVegetarian: food.isVegetarian,
      isAvailable: food.isAvailable,
    });
    setIsFoodModalOpen(true);
  };

  // Save food form
  const handleSaveFoodForm = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingFood) {
        // Update
        const res = await api.patch(`/admin/foods/${editingFood.id}`, foodFormData);
        if (res.data.success) {
          success(`Updated ${foodFormData.name}`);
          setFoods((prev) =>
            prev.map((f) => (f.id === editingFood.id ? res.data.data : f))
          );
          setIsFoodModalOpen(false);
        }
      } else {
        // Create
        const res = await api.post('/admin/foods', foodFormData);
        if (res.data.success) {
          success(`Added new dish ${foodFormData.name}`);
          setFoods((prev) => [res.data.data, ...prev]);
          setIsFoodModalOpen(false);
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save food dish.';
      error(msg);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = orderStatusFilter === 'ALL' || ord.status === orderStatusFilter;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerPhone.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#FF6B35] uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Administrative Control Center</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            FoodieHub Admin Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage food catalog, update live customer orders, and track business revenue
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-[#FF6B35] text-[#FF6B35]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Overview & Metrics
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-[#FF6B35] text-[#FF6B35]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Live Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('foods')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'foods'
              ? 'border-[#FF6B35] text-[#FF6B35]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          Menu Items ({foods.length})
        </button>
      </div>

      {/* ==================================================
          TAB 1: OVERVIEW METRICS
          ================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Total Sales
                </span>
                <span className="text-3xl font-black text-gray-900 mt-1 block">
                  ₹{stats?.totalSales?.toLocaleString('en-IN') || 0}
                </span>
                <span className="text-[11px] text-green-600 font-semibold mt-0.5 block">
                  ₹{stats?.deliveredSales?.toLocaleString('en-IN') || 0} Delivered
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF6B35] flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Total Orders
                </span>
                <span className="text-3xl font-black text-gray-900 mt-1 block">
                  {stats?.totalOrders || 0}
                </span>
                <span className="text-[11px] text-gray-500 font-semibold mt-0.5 block">
                  Placed across platform
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Registered Customers
                </span>
                <span className="text-3xl font-black text-gray-900 mt-1 block">
                  {stats?.totalCustomers || 0}
                </span>
                <span className="text-[11px] text-gray-500 font-semibold mt-0.5 block">
                  Active food accounts
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-green-100 text-[#22C55E] flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Menu Food Items
                </span>
                <span className="text-3xl font-black text-gray-900 mt-1 block">
                  {stats?.totalFoodItems || 0}
                </span>
                <span className="text-[11px] text-gray-500 font-semibold mt-0.5 block">
                  Across 7 categories
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* Recent Orders List */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-gray-100 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Customer Orders</h2>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-[#FF6B35] hover:underline"
              >
                View All Orders →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase font-bold tracking-wider">
                    <th className="pb-3">Order #</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {stats?.recentOrders?.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 font-bold text-gray-900">{ord.orderNumber}</td>
                      <td className="py-3 text-gray-700">{ord.customerName}</td>
                      <td className="py-3 text-gray-500">{ord.customerPhone}</td>
                      <td className="py-3 font-bold text-gray-900">₹{ord.total}</td>
                      <td className="py-3">
                        <StatusBadge status={ord.status} size="sm" />
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => {
                            setActiveTab('orders');
                            setOrderSearch(ord.orderNumber);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-orange-50 text-[#FF6B35] hover:bg-orange-100 font-bold"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ==================================================
          TAB 2: ORDERS MANAGEMENT
          ================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Controls: Search & Status Filter */}
          <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders by order #, customer name, or phone..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">
                Filter Status:
              </span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PREPARING">PREPARING</option>
                <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

          </div>

          {/* Orders Card List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-gray-500 border border-gray-100 shadow-card">
                No orders found matching the filter.
              </div>
            ) : (
              filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl p-6 shadow-card border border-gray-100 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-base font-black text-gray-900">{ord.orderNumber}</span>
                        <StatusBadge status={ord.status} />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Placed by <strong className="text-gray-800">{ord.customerName}</strong> ({ord.customerPhone}) on {new Date(ord.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Change Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400">Update Status:</span>
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-orange-50 border border-orange-200 rounded-xl text-xs font-bold text-[#FF6B35] py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>

                  {/* Items and Address Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5 bg-gray-50/60 p-3 rounded-2xl border border-gray-100">
                      <span className="font-bold text-gray-500 uppercase tracking-wider block">
                        Ordered Items ({ord.items.length})
                      </span>
                      <div className="space-y-1">
                        {ord.items.map((i) => (
                          <div key={i.id} className="flex justify-between">
                            <span className="text-gray-700">
                              {i.foodName} <span className="text-gray-400 font-bold">x{i.quantity}</span>
                            </span>
                            <span className="font-bold text-gray-900">₹{i.lineTotal}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-200 pt-1 flex justify-between font-bold text-gray-900">
                        <span>Total (COD)</span>
                        <span className="text-[#FF6B35]">₹{ord.total}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 bg-gray-50/60 p-3 rounded-2xl border border-gray-100">
                      <span className="font-bold text-gray-500 uppercase tracking-wider block">
                        Delivery Destination
                      </span>
                      <p className="text-gray-700 font-medium">
                        {ord.deliveryAddress}, {ord.city}, {ord.state} - {ord.postalCode}
                      </p>
                      {ord.deliveryInstructions && (
                        <p className="text-gray-500 italic">
                          Instructions: "{ord.deliveryInstructions}"
                        </p>
                      )}
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* ==================================================
          TAB 3: FOOD MENU ITEMS CRUD
          ================================================== */}
      {activeTab === 'foods' && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900">Menu Catalog Items</h2>
            <button
              onClick={handleOpenAddFoodModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85924] text-white text-xs font-bold shadow-md shadow-[#FF6B35]/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <div
                key={food.id}
                className="bg-white rounded-3xl border border-gray-100 p-4 shadow-soft flex flex-col justify-between space-y-4 hover:border-orange-200 transition-all"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gray-100">
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-gray-700">
                      {food.category}
                    </div>
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md p-1 rounded-lg">
                      <div
                        className={`w-3.5 h-3.5 border-2 flex items-center justify-center ${
                          food.isVegetarian ? 'border-green-600' : 'border-red-600'
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            food.isVegetarian ? 'bg-green-600' : 'bg-red-600'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-sm text-gray-900 truncate">{food.name}</h3>
                      <span className="font-black text-[#FF6B35] text-sm shrink-0">₹{food.price}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {food.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleFoodAvailability(food)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      food.isAvailable
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {food.isAvailable ? 'In Stock' : 'Out of Stock'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditFoodModal(food)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-[#FF6B35] hover:bg-orange-50 transition-colors"
                      title="Edit dish"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFood(food.id, food.name)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete dish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ==================================================
          ADD / EDIT FOOD MODAL
          ================================================== */}
      {isFoodModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsFoodModalOpen(false)}
          />

          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 space-y-6">
            <h2 className="text-xl font-black text-gray-900">
              {editingFood ? `Edit ${editingFood.name}` : 'Add New Food Item'}
            </h2>

            <form onSubmit={handleSaveFoodForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  value={foodFormData.name}
                  onChange={(e) => setFoodFormData({ ...foodFormData, name: e.target.value })}
                  placeholder="e.g. Tandoori Paneer Tikka"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={foodFormData.description}
                  onChange={(e) => setFoodFormData({ ...foodFormData, description: e.target.value })}
                  placeholder="Detailed description of flavors and ingredients..."
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={foodFormData.price}
                    onChange={(e) => setFoodFormData({ ...foodFormData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={foodFormData.category}
                    onChange={(e) => setFoodFormData({ ...foodFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  >
                    <option value="Indian">Indian</option>
                    <option value="Biryani">Biryani</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Burgers">Burgers</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Image URL (Unsplash or direct image URL) *
                </label>
                <input
                  type="url"
                  required
                  value={foodFormData.imageUrl}
                  onChange={(e) => setFoodFormData({ ...foodFormData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={foodFormData.isVegetarian}
                    onChange={(e) => setFoodFormData({ ...foodFormData, isVegetarian: e.target.checked })}
                    className="w-4 h-4 text-[#FF6B35] rounded focus:ring-[#FF6B35]"
                  />
                  <span className="text-xs font-bold text-gray-700">Pure Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={foodFormData.isAvailable}
                    onChange={(e) => setFoodFormData({ ...foodFormData, isAvailable: e.target.checked })}
                    className="w-4 h-4 text-[#FF6B35] rounded focus:ring-[#FF6B35]"
                  />
                  <span className="text-xs font-bold text-gray-700">Available in Stock</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFoodModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85924] text-white text-xs font-bold shadow-md shadow-[#FF6B35]/25"
                >
                  {editingFood ? 'Save Changes' : 'Create Dish'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
