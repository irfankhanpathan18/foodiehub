import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  User as UserIcon,
  Banknote,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export const CheckoutPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { error: toastError } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    deliveryAddress: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    deliveryInstructions: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'ONLINE'>('CASH_ON_DELIVERY');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: prev.customerName || user.name,
        customerPhone: prev.customerPhone || user.phone || '',
      }));
    }
  }, [user]);

  // If cart is empty, redirect to menu
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-orange-50 text-[#FF6B35] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Your cart is empty</h2>
        <p className="text-sm text-gray-500">
          You haven't added any delicious food items to your cart yet.
        </p>
        <Link
          to="/menu"
          className="inline-block px-6 py-3 rounded-xl bg-[#FF6B35] text-white font-bold text-sm shadow-md hover:bg-[#E85924] transition-all"
        >
          Explore Food Menu
        </Link>
      </div>
    );
  }

  // If not authenticated, prompt to sign in
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-8 shadow-card border border-gray-100 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#FF6B35] flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-gray-900">Sign in to complete your order</h2>
          <p className="text-xs text-gray-500">
            Please log in or create an account to proceed with delivery details and track your meal in real-time.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/login"
              state={{ from: { pathname: '/checkout' } }}
              className="w-full py-3 rounded-xl bg-[#FF6B35] text-white font-bold text-sm shadow-md hover:bg-[#E85924] transition-all"
            >
              Sign In to Checkout
            </Link>
            <Link
              to="/register"
              className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.customerName.trim() || !formData.customerPhone.trim() || !formData.deliveryAddress.trim()) {
      setErrorMsg('Please fill in all required delivery fields.');
      return;
    }

    if (paymentMethod === 'ONLINE') {
      toastError('Online payment gateway integration is coming soon. Please select Cash on Delivery.');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        deliveryAddress: formData.deliveryAddress.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        deliveryInstructions: formData.deliveryInstructions.trim() || undefined,
        items: items.map((i) => ({
          foodId: i.food.id,
          quantity: i.quantity,
        })),
        paymentMethod: 'CASH_ON_DELIVERY',
      };

      const res = await api.post('/orders', payload);

      if (res.data.success) {
        const order = res.data.data;
        clearCart();
        navigate(`/order-success/${order.orderNumber}`, { state: { order } });
      }
    } catch (err: any) {
      console.error('Order placement error:', err);
      const msg = err.response?.data?.message || 'Failed to place order. Please review your cart and details.';
      setErrorMsg(msg);
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review your address and confirm your delicious food order
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Delivery Information & Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer & Address Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF6B35] flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Delivery Address Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Rahul Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Complete Street Address / Apartment / House No. *
                </label>
                <textarea
                  required
                  rows={2}
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  placeholder="Flat 402, Sunshine Heights, Plot 14, Main Link Road"
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  State *
                </label>
                <input
                  type="text"
                  required
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Maharashtra"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Postal PIN Code *
                </label>
                <input
                  type="text"
                  required
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="400001"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  name="deliveryInstructions"
                  value={formData.deliveryInstructions}
                  onChange={handleChange}
                  placeholder="e.g. Ring the bell twice, leave at reception, extra spicy"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>

            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-gray-100 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-green-100 text-[#22C55E] flex items-center justify-center font-bold">
                <Banknote className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Payment Option</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Cash on Delivery (ACTIVE) */}
              <label
                onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-[#FF6B35] bg-orange-50/50 ring-2 ring-[#FF6B35]/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'CASH_ON_DELIVERY'}
                  onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  className="mt-1 text-[#FF6B35] focus:ring-[#FF6B35]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-gray-900">Cash on Delivery</span>
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Pay safely with cash or UPI directly to our delivery executive when your hot food arrives.
                  </p>
                </div>
              </label>

              {/* Online Payment (Coming Soon) */}
              <label
                onClick={() => setPaymentMethod('ONLINE')}
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all opacity-80 ${
                  paymentMethod === 'ONLINE'
                    ? 'border-[#FF6B35] bg-orange-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'ONLINE'}
                  onChange={() => setPaymentMethod('ONLINE')}
                  className="mt-1 text-[#FF6B35] focus:ring-[#FF6B35]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-gray-900">Online Payment</span>
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    NetBanking, Cards & Wallet payment gateway integration in development.
                  </p>
                </div>
              </label>

            </div>
          </div>

        </div>

        {/* Right Side: Order Summary & Placement Button */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-gray-100 sticky top-28 space-y-6">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              <span className="text-xs text-gray-500 font-medium">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Item List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map(({ food, quantity }) => (
                <div key={food.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 max-w-[200px] truncate">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        food.isVegetarian ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="font-semibold text-gray-800 truncate">{food.name}</span>
                    <span className="text-gray-400 font-bold shrink-0">x{quantity}</span>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0">
                    ₹{food.price * quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-semibold text-gray-900">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 uppercase font-bold text-xs">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-base font-extrabold text-gray-900">
                <span>Total Payable</span>
                <span className="text-2xl text-[#FF6B35]">₹{total}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-[#FF6B35] hover:bg-[#E85924] disabled:bg-gray-300 text-white font-bold text-sm shadow-xl shadow-[#FF6B35]/30 hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99] disabled:pointer-events-none"
            >
              <span>{submitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
              <span>Safe & Contactless Delivery Guaranteed</span>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
};
