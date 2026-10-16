import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Utensils,
  Flame,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import type { Food } from '../types';
import { api } from '../services/api';
import { FoodCard } from '../components/FoodCard';
import { FoodDetailsModal } from '../components/FoodDetailsModal';
import { FoodGridSkeleton } from '../components/LoadingSkeleton';

export const HomePage: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  // Search & Filter state on homepage
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [sortOption, setSortOption] = useState<'featured' | 'price_asc' | 'price_desc'>('featured');

  const categories = [
    { name: 'All', icon: '🍽️', label: 'All Items' },
    { name: 'Indian', icon: '🍛', label: 'Indian Curries' },
    { name: 'Biryani', icon: '🍚', label: 'Royal Biryani' },
    { name: 'Pizza', icon: '🍕', label: 'Stone Pizza' },
    { name: 'Burgers', icon: '🍔', label: 'Juicy Burgers' },
    { name: 'Chinese', icon: '🥢', label: 'Wok Chinese' },
    { name: 'Desserts', icon: '🍰', label: 'Sweet Treats' },
    { name: 'Beverages', icon: '🥤', label: 'Cool Drinks' },
  ];

  useEffect(() => {
    const fetchPopularFoods = async () => {
      try {
        setLoading(true);
        const res = await api.get('/foods?limit=24');
        if (res.data.success) {
          setFoods(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching foods:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularFoods();
  }, []);

  // Filter foods locally for instant responsiveness on Home
  const filteredFoods = foods.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || food.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesVeg =
      vegFilter === 'all'
        ? true
        : vegFilter === 'veg'
        ? food.isVegetarian
        : !food.isVegetarian;

    return matchesSearch && matchesCategory && matchesVeg;
  });

  // Sort
  const sortedFoods = [...filteredFoods].sort((a, b) => {
    if (sortOption === 'price_asc') return a.price - b.price;
    if (sortOption === 'price_desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="space-y-20 pb-20">
      
      {/* ==================================================
          HERO SECTION
          ================================================== */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-200/30 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-[#FF6B35] text-xs sm:text-sm font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                <span>Special 20% OFF on your first 3 orders!</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.15]">
                Delicious Food,{' '}
                <span className="text-[#FF6B35] relative">
                  Delivered
                  <svg className="absolute left-0 -bottom-2 w-full h-3 text-orange-300 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0 10 Q 50 20, 100 10" stroke="currentColor" strokeWidth="6" fill="transparent"/>
                  </svg>
                </span>{' '}
                to Your Door
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover your favorite meals and enjoy fresh food delivered straight to your home. Handcrafted recipes from master chefs in under 30 minutes.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/menu"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FF6B35] hover:bg-[#E85924] text-white font-bold text-base shadow-xl shadow-[#FF6B35]/30 hover:shadow-2xl hover:shadow-[#FF6B35]/40 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-95"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  onClick={() => {
                    const el = document.getElementById('search-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-base border border-gray-200 shadow-soft hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Order Now</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-200/80 max-w-md mx-auto lg:mx-0">
                <div>
                  <span className="text-2xl font-black text-gray-900 block">50k+</span>
                  <span className="text-xs text-gray-500 font-medium">Happy Foodies</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-gray-900 block">30 min</span>
                  <span className="text-xs text-gray-500 font-medium">Avg Delivery</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-gray-900 block">4.9 ★</span>
                  <span className="text-xs text-gray-500 font-medium">Customer Rating</span>
                </div>
              </div>

            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow ring */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6B35]/20 to-amber-200/30 rounded-3xl transform rotate-3 scale-105 filter blur-lg" />

                {/* Hero Dish Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80"
                    alt="Delicious Food Spread"
                    className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="bg-[#22C55E] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block shadow-sm">
                      Chef Special
                    </span>
                    <h3 className="text-xl font-bold">Authentic Hyderabadi Dum Biryani</h3>
                    <p className="text-xs text-gray-200 mt-1">Slow-cooked with premium basmati rice & royal spices</p>
                  </div>
                </div>

                {/* Floating Badge 1: Delivery Time */}
                <div className="absolute -top-4 -left-4 sm:-left-6 bg-white rounded-2xl p-3.5 shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce duration-1000">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6B35] flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Fast Delivery</span>
                    <span className="text-[11px] text-gray-500 font-medium">Under 30 Minutes</span>
                  </div>
                </div>

                {/* Floating Badge 2: Certified Quality */}
                <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-white rounded-2xl p-3.5 shadow-xl border border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 text-[#22C55E] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">100% Hygienic</span>
                    <span className="text-[11px] text-gray-500 font-medium">Safe Contactless</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          SEARCH & FILTER SECTION
          ================================================== */}
      <section id="search-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-gray-100 space-y-6">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Search & Filter Dishes
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Find your cravings in seconds by dish name, category, or dietary preference.
              </p>
            </div>

            {/* Price Sort */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes (e.g. Paneer Butter Masala, Pizza, Biryani, Brownie)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50/80 border border-gray-200 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 shrink-0 ${
                  selectedCategory === cat.name
                    ? 'bg-[#FF6B35] text-white shadow-md shadow-[#FF6B35]/25'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Dietary Filter Buttons (Veg / Non-Veg) */}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Dietary:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVegFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  vegFilter === 'all'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Foods
              </button>
              <button
                onClick={() => setVegFilter('veg')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  vegFilter === 'veg'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Pure Veg
              </button>
              <button
                onClick={() => setVegFilter('nonveg')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  vegFilter === 'nonveg'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Non-Veg
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          POPULAR FOOD ITEMS SECTION
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF6B35] uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Popular Dishes
            </h2>
          </div>

          <Link
            to="/menu"
            className="text-sm font-bold text-[#FF6B35] hover:text-[#E85924] flex items-center gap-1 group"
          >
            <span>View Full Menu</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Food Items Grid */}
        {loading ? (
          <FoodGridSkeleton count={8} />
        ) : sortedFoods.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-soft">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF6B35] flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">No dishes found matching your search</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-6">
              Try adjusting your search keywords, clearing your filters, or browsing other categories.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setVegFilter('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#FF6B35] text-white text-xs font-bold shadow-md hover:bg-[#E85924]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedFoods.slice(0, 8).map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onViewDetails={(f) => setSelectedFood(f)}
              />
            ))}
          </div>
        )}

        {sortedFoods.length > 8 && (
          <div className="text-center mt-10">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white border border-gray-200 text-gray-800 font-bold text-sm shadow-soft hover:shadow-md hover:border-[#FF6B35] transition-all"
            >
              <span>Explore All {foods.length} Menu Dishes</span>
              <ArrowRight className="w-4 h-4 text-[#FF6B35]" />
            </Link>
          </div>
        )}
      </section>

      {/* ==================================================
          WHY CHOOSE US SECTION
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#1F2937] to-gray-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          
          <div className="max-w-xl space-y-3 mb-10">
            <span className="text-[#FF6B35] font-bold text-xs uppercase tracking-widest">
              The FoodieHub Promise
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Why Foodies Love Us?
            </h2>
            <p className="text-sm text-gray-400">
              We uphold the highest culinary standards, from kitchen safety to doorstep delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-[#FF6B35] flex items-center justify-center font-bold mb-4">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Fresh Ingredients Only</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Farm-fresh produce, authentic spices, and premium dairy sourced every morning. Zero artificial preservatives.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 text-[#22C55E] flex items-center justify-center font-bold mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Superfast 30-Min Delivery</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Insulated thermal bags keep your curries piping hot and beverages icy cold. Real-time updates every step.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-[#FF6B35] flex items-center justify-center font-bold mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Cash on Delivery</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Pay conveniently with Cash on Delivery at your door. No upfront card hassle required.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Food Details Modal */}
      <FoodDetailsModal
        food={selectedFood}
        onClose={() => setSelectedFood(null)}
      />

    </div>
  );
};
