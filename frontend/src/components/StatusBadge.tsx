import React from 'react';
import type { OrderStatus } from '../types';
import { Clock, CheckCircle, Package, Truck, CheckCheck, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs font-bold';

  switch (status) {
    case 'PENDING':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Pending Confirmation</span>
        </span>
      );
    case 'CONFIRMED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}>
          <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
          <span>Order Confirmed</span>
        </span>
      );
    case 'PREPARING':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 ${sizeClasses}`}>
          <Package className="w-3.5 h-3.5 text-purple-500" />
          <span>Kitchen Preparing</span>
        </span>
      );
    case 'OUT_FOR_DELIVERY':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 ${sizeClasses}`}>
          <Truck className="w-3.5 h-3.5 text-orange-500 animate-bounce" />
          <span>Out for Delivery</span>
        </span>
      );
    case 'DELIVERED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-green-50 text-green-700 border border-green-200 ${sizeClasses}`}>
          <CheckCheck className="w-3.5 h-3.5 text-green-600" />
          <span>Delivered</span>
        </span>
      );
    case 'CANCELLED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 ${sizeClasses}`}>
          <XCircle className="w-3.5 h-3.5 text-red-500" />
          <span>Cancelled</span>
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200 ${sizeClasses}`}>
          <span>{status}</span>
        </span>
      );
  }
};
