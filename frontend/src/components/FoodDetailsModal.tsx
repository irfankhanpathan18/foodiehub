import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import type { Food } from '../types';
import { useCart } from '../context/CartContext';

interface FoodDetailsModalProps {
  food: Food | null;
  onClose: () => void;
}

export const FoodDetailsModal: React.FC<FoodDetailsModalProps> = ({ food, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!food) return null;

  const handleAddToCart = () => {
    if (!food.isAvailable) return;
    addToCart(food, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-100 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-gray-700 hover:text-black flex items-center justify-center shadow-md transition-transform hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Food Image */}
        <div className="relative aspect-[16/10] w-full bg-gray-100">
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-full h-full object-cover"
          />

          {/* Badges Overlay */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-gray-800 shadow-sm flex items-center gap-2">
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
              {food.isVegetarian ? '100% Pure Vegetarian' : 'Non-Vegetarian'}
            </span>

            <span className="bg-[#FF6B35] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
              {food.category}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {food.name}
              </h2>
              <div className="text-2xl font-black text-[#FF6B35] shrink-0">
                ₹{food.price}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              {food.isAvailable ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Fresh & In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
                  <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                </span>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
              About This Dish
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {food.description}
            </p>
          </div>

          {/* Highlights */}
          <div className="bg-orange-50/60 rounded-2xl p-4 border border-orange-100 flex items-center gap-3 text-xs text-gray-700 font-medium">
            <Sparkles className="w-5 h-5 text-[#FF6B35] shrink-0" />
            <span>Prepared freshly on order with authentic spices and delivered hot in tamper-evident sealed packaging.</span>
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Quantity */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Quantity
              </span>
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || !food.isAvailable}
                  className="p-2.5 hover:bg-gray-200 disabled:opacity-40 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  disabled={quantity >= 20 || !food.isAvailable}
                  className="p-2.5 hover:bg-gray-200 disabled:opacity-40 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Total and Add Button */}
            <button
              onClick={handleAddToCart}
              disabled={!food.isAvailable}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#FF6B35] hover:bg-[#E85924] disabled:bg-gray-300 text-white font-bold text-sm shadow-lg shadow-[#FF6B35]/25 hover:shadow-xl transition-all duration-200 active:scale-95 disabled:pointer-events-none"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {food.isAvailable
                  ? `Add to Cart • ₹${food.price * quantity}`
                  : 'Currently Unavailable'}
              </span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
