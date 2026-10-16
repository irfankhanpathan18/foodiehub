import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Utensils, RefreshCw, AlertCircle } from 'lucide-react';
import type { Food } from '../types';
import { api } from '../services/api';
import { FoodCard } from '../components/FoodCard';
import { FoodDetailsModal } from '../components/FoodDetailsModal';
import { FoodGridSkeleton } from '../components/LoadingSkeleton';

export const MenuPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [dietary, setDietary] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [sort, setSort] = useState<'featured' | 'price_asc' | 'price_desc' | 'name_asc'>('featured');

  const categories = [
    'All',
    'Indian',
    'Biryani',
    'Pizza',
    'Burgers',
    'Chinese',
    'Desserts',
    'Beverages',
  ];

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const params: any = { limit: 50 };
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (dietary === 'veg') params.isVegetarian = 'true';
      if (dietary === 'nonveg') params.isVegetarian = 'false';
      if (sort !== 'featured') params.sort = sort;

      const res = await api.get('/foods', { params });
      if (res.data.success) {
        setFoods(res.data.data);
      }
    } catch (err: any) {
      console.error('Menu fetch error:', err);
      setErrorMsg('Failed to load menu items. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [category, dietary, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMenu();
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setSearchParams(cat === 'All' ? {} : { category: cat });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-[#FF6B35] to-amber-500 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase inline-block">
            Our Complete Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Explore the Menu
          </h1>
          <p className="text-orange-100 text-sm sm:text-base leading-relaxed">
            Freshly prepared by culinary experts with pure ingredients. Choose from rich Indian gravies, royal dum biryanis, stone-fired pizzas, gourmet burgers, and sweet desserts.
          </p>
        </div>
      </div>

      {/* Filter and Controls Toolbar */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100 space-y-6">
        
        {/* Search Bar + Sort */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes by name or ingredients (press Enter)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-24 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#FF6B35] hover:bg-[#E85924] text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              Search
            </button>
          </form>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="w-full md:w-auto bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 py-3 px-3.5 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                category === cat
                  ? 'bg-[#FF6B35] text-white shadow-md shadow-[#FF6B35]/20'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dietary Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-400 uppercase tracking-wider">
              Dietary Preference:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDietary('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  dietary === 'all'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDietary('veg')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                  dietary === 'veg'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Pure Veg
              </button>
              <button
                onClick={() => setDietary('nonveg')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                  dietary === 'nonveg'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Non-Veg
              </button>
            </div>
          </div>

          <div className="text-gray-500 font-medium">
            Showing <span className="font-bold text-gray-900">{foods.length}</span> dishes
          </div>
        </div>

      </div>

      {/* Error state */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center text-red-700 flex flex-col items-center gap-3">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="font-semibold text-sm">{errorMsg}</p>
          <button
            onClick={fetchMenu}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Grid of Food Items */}
      {loading ? (
        <FoodGridSkeleton count={12} />
      ) : foods.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-soft">
          <div className="w-20 h-20 rounded-full bg-orange-50 text-[#FF6B35] flex items-center justify-center mx-auto mb-4">
            <Utensils className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">No dishes match your selection</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-6">
            We couldn't find any dishes matching "{search || category}". Try searching for something else or clearing your filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setDietary('all');
              setSort('featured');
            }}
            className="px-6 py-3 rounded-xl bg-[#FF6B35] text-white text-xs font-bold shadow-md hover:bg-[#E85924] transition-all"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onViewDetails={(f) => setSelectedFood(f)}
            />
          ))}
        </div>
      )}

      {/* Food Details Modal */}
      <FoodDetailsModal
        food={selectedFood}
        onClose={() => setSelectedFood(null)}
      />

    </div>
  );
};
