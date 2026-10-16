import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, ArrowRight, Home, Receipt } from 'lucide-react';
import type { Order } from '../types';

export const OrderSuccessPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const order = (location.state as any)?.order as Order | undefined;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-card border border-gray-100 text-center space-y-8">
        
        {/* Animated Celebration Icon */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full bg-green-100 text-[#22C55E] flex items-center justify-center mx-auto shadow-md shadow-green-500/20 animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="w-12 h-12 stroke-[2.2]" />
          </div>
          <span className="absolute -top-1 -right-1 text-2xl">🎉</span>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#22C55E] bg-green-50 px-3 py-1 rounded-full">
            Order Confirmed & Received
          </span>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Thank You for Your Order!
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Our kitchen has received your order and our chefs are already preparing your meals with fresh ingredients.
          </p>
        </div>

        {/* Order Identifier Banner */}
        <div className="bg-orange-50/80 border border-orange-200/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Order Reference Number
            </span>
            <span className="text-lg font-black text-[#FF6B35]">
              {orderNumber || order?.orderNumber || 'FH-ORDER'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-white px-3 py-1.5 rounded-xl border border-orange-200">
            <Clock className="w-4 h-4 text-[#FF6B35]" />
            <span>Estimated Delivery: 30-40 Mins</span>
          </div>
        </div>

        {/* Order Details (if state passed) */}
        {order && (
          <div className="border border-gray-100 rounded-2xl p-5 text-left space-y-4 bg-gray-50/50">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-200">
              <Receipt className="w-4 h-4 text-gray-600" />
              <span>Summary Breakdown</span>
            </div>

            <div className="space-y-2">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-xs">
                  <span className="text-gray-700 font-medium">
                    {item.foodName} <span className="text-gray-400 font-bold">x{item.quantity}</span>
                  </span>
                  <span className="font-bold text-gray-900">₹{item.lineTotal}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-1 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span className="font-semibold text-gray-900">
                  {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-1 border-t border-gray-200">
                <span>Total Amount (Cash on Delivery)</span>
                <span className="text-[#FF6B35]">₹{order.total}</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-gray-500 flex items-start gap-2 border-t border-gray-200">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <span>Delivering to: <strong className="text-gray-700">{order.customerName}</strong>, {order.deliveryAddress}, {order.city} - {order.postalCode}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/orders"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85924] text-white font-bold text-sm shadow-md shadow-[#FF6B35]/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Track in My Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
