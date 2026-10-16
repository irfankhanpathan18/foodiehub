import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Calendar,
  MapPin,
  RefreshCw,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import type { Order } from '../types';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { useToast } from '../context/ToastContext';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { success, error } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my');
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err: any) {
      console.error('Fetch orders error:', err);
      error('Failed to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string, orderNumber: string) => {
    if (!window.confirm(`Are you sure you want to cancel order #${orderNumber}?`)) {
      return;
    }

    try {
      setCancellingId(orderId);
      const res = await api.patch(`/orders/${orderId}/cancel`);
      if (res.data.success) {
        success(`Order #${orderNumber} has been cancelled.`);
        // Update local state
        setOrders((prev) =>
          prev.map((ord) => (ord.id === orderId ? { ...ord, status: 'CANCELLED' } : ord))
        );
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Could not cancel order.';
      error(msg);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            My Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track past meals, delivery progress, and order receipts
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-white bg-gray-50 text-xs font-bold text-gray-700 shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-12 bg-gray-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-card">
          <div className="w-20 h-20 rounded-full bg-orange-50 text-[#FF6B35] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">You haven't placed any orders yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-6">
            Explore our rich menu filled with delicious biryanis, pizzas, curries, and burgers.
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF6B35] text-white font-bold text-xs shadow-md shadow-[#FF6B35]/25 hover:bg-[#E85924] transition-all"
          >
            <span>Browse Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isPending = order.status === 'PENDING';
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-gray-100 space-y-6 transition-all hover:border-orange-200"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-gray-900">
                        {order.orderNumber}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Placed on {formattedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-[11px] text-gray-400 block font-medium">Total Paid (COD)</span>
                      <span className="text-xl font-black text-[#FF6B35]">₹{order.total}</span>
                    </div>

                    {isPending && (
                      <button
                        onClick={() => handleCancelOrder(order.id, order.orderNumber)}
                        disabled={cancellingId === order.id}
                        className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{cancellingId === order.id ? 'Cancelling...' : 'Cancel'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Ordered Items List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Ordered Dishes
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 border border-gray-100 text-xs"
                      >
                        <span className="font-semibold text-gray-800">
                          {item.foodName} <span className="text-gray-400 font-bold ml-1">x{item.quantity}</span>
                        </span>
                        <span className="font-bold text-gray-900">₹{item.lineTotal}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Information Footer */}
                <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-500">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <span>
                      Delivery Address: <strong className="text-gray-700">{order.deliveryAddress}</strong>, {order.city} ({order.postalCode})
                    </span>
                  </div>

                  {order.deliveryInstructions && (
                    <span className="italic text-gray-400">
                      Note: "{order.deliveryInstructions}"
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
