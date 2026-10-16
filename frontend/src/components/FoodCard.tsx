import React from 'react';
import { Plus, Minus, Eye } from 'lucide-react';
import type { Food } from '../types';
import { useCart } from '../context/CartContext';

interface FoodCardProps {
  food: Food;
  onViewDetails: (food: Food) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, onViewDetails }) => {
  const { items, addToCart, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.food.id === food.id);

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 hover:border-orange-200 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Food Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 cursor-pointer" onClick={() => onViewDetails(food)}>
        <img
          src={food.imageUrl}
          alt={food.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
          <span className="text-white text-xs font-semibold flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </div>

        {/* Veg / Non-Veg Indicator Badge (Indian standard mark) */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md p-1.5 rounded-lg shadow-sm">
          <div
            className={`w-4 h-4 border-2 flex items-center justify-center ${
              food.isVegetarian ? 'border-green-600' : 'border-red-600'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                food.isVegetarian ? 'bg-green-600' : 'bg-red-600'
              }`}
            />
          </div>
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-700 shadow-sm">
          {food.category}
        </div>

        {/* Out of Stock Ribbon */}
        {!food.isAvailable && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onViewDetails(food)}
            className="text-base font-bold text-gray-900 group-hover:text-[#FF6B35] transition-colors cursor-pointer line-clamp-1"
            title={food.name}
          >
            {food.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Price & Action Section */}
        <div className="pt-4 mt-2 border-t border-gray-50 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 block font-medium">Price</span>
            <span className="text-lg font-black text-gray-900">
              ₹{food.price}
            </span>
          </div>

          <div>
            {!food.isAvailable ? (
              <span className="text-xs font-bold text-gray-400 cursor-not-allowed">
                Unavailable
              </span>
            ) : cartItem ? (
              <div className="flex items-center bg-orange-50 border border-orange-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => updateQuantity(food.id, cartItem.quantity - 1)}
                  className="p-1.5 text-[#FF6B35] hover:bg-orange-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-xs font-bold text-[#FF6B35]">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(food.id, cartItem.quantity + 1)}
                  className="p-1.5 text-[#FF6B35] hover:bg-orange-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(food)}
                className="flex items-center gap-1.5 bg-[#FF6B35] hover:bg-[#E85924] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-[#FF6B35]/20 hover:shadow-lg hover:shadow-[#FF6B35]/30 transition-all duration-200 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
