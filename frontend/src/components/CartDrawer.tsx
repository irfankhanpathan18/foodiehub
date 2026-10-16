import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    total,
    isCartOpen,
    setIsCartOpen,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 500;
  const amountNeededForFree = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#FFF9F2]/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF6B35] flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Your Shopping Cart</h2>
                <p className="text-xs text-gray-500 font-medium">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          {items.length > 0 && (
            <div className="bg-orange-50/80 px-6 py-3 border-b border-orange-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6B35] mb-1.5">
                <Truck className="w-4 h-4" />
                {amountNeededForFree > 0 ? (
                  <span>
                    Add <span className="font-bold">₹{amountNeededForFree}</span> more for <span className="underline">FREE Delivery</span>!
                  </span>
                ) : (
                  <span className="text-green-600 font-bold">
                    🎉 You have unlocked FREE Delivery!
                  </span>
                )}
              </div>
              <div className="w-full bg-orange-200/60 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    amountNeededForFree === 0 ? 'bg-green-500' : 'bg-[#FF6B35]'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center text-[#FF6B35] mb-4">
                  <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Your cart is empty</h3>
                <p className="text-sm text-gray-500 max-w-xs mt-1 mb-6">
                  Good food is waiting for you! Browse our delicious menu and pick your favorites.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/menu');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#FF6B35] text-white font-semibold text-sm hover:bg-[#E85924] shadow-md shadow-[#FF6B35]/20 transition-all duration-200"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              items.map(({ food, quantity }) => (
                <div
                  key={food.id}
                  className="flex gap-4 p-3 rounded-2xl border border-gray-100 hover:border-orange-200 bg-white transition-colors shadow-sm"
                >
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-gray-800 truncate">{food.name}</h4>
                        <button
                          onClick={() => removeFromCart(food.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            food.isVegetarian ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        <span className="text-xs text-gray-500">₹{food.price} each</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <button
                          onClick={() => updateQuantity(food.id, quantity - 1)}
                          className="p-1 hover:bg-gray-200 text-gray-600 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-gray-800">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(food.id, quantity + 1)}
                          className="p-1 hover:bg-gray-200 text-gray-600 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-gray-900">
                        ₹{food.price * quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout Button */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-[#FFF9F2]/70 space-y-3">
              <div className="flex justify-between items-center text-xs text-gray-500">
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600 font-semibold transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-1.5 text-sm text-gray-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-gray-900">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600 uppercase font-bold text-xs">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="border-t border-gray-200/80 pt-2 flex justify-between items-center text-base font-extrabold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-xl text-[#FF6B35]">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-2 py-3.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85924] text-white font-bold text-sm shadow-lg shadow-[#FF6B35]/25 hover:shadow-xl hover:shadow-[#FF6B35]/35 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
