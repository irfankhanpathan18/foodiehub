import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Phone, Mail, MapPin, ShieldCheck, Clock, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1F2937] text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-[#FF6B35] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">30-Minute Delivery</h4>
              <p className="text-xs text-gray-400 mt-0.5">Hot & fresh directly to your door</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-[#22C55E] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Hygienic Food</h4>
              <p className="text-xs text-gray-400 mt-0.5">Certified kitchen sanitation</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-[#FF6B35] flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Master Chefs</h4>
              <p className="text-xs text-gray-400 mt-0.5">Handcrafted authentic recipes</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-[#22C55E] flex items-center justify-center shrink-0">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Quality Guaranteed</h4>
              <p className="text-xs text-gray-400 mt-0.5">Only premium fresh ingredients</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#FF6B35] flex items-center justify-center text-white">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white">
                Foodie<span className="text-[#FF6B35]">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Discover authentic Indian dishes, stone-baked pizzas, juicy burgers, and gourmet desserts prepared with passion and delivered with care.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-[#FF6B35] text-gray-300 hover:text-white flex items-center justify-center transition-colors">
                <span className="sr-only">Twitter</span>
                𝕏
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-[#FF6B35] text-gray-300 hover:text-white flex items-center justify-center transition-colors font-bold">
                <span className="sr-only">Instagram</span>
                IG
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-[#FF6B35] text-gray-300 hover:text-white flex items-center justify-center transition-colors font-bold">
                <span className="sr-only">Facebook</span>
                FB
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-[#FF6B35] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-[#FF6B35] transition-colors">Full Food Menu</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-[#FF6B35] transition-colors">Track Orders</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#FF6B35] transition-colors">Customer Login</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#FF6B35] transition-colors">Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Categories</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/menu?category=Indian" className="hover:text-[#FF6B35] transition-colors">Authentic Indian</Link>
              </li>
              <li>
                <Link to="/menu?category=Biryani" className="hover:text-[#FF6B35] transition-colors">Hyderabadi Biryani</Link>
              </li>
              <li>
                <Link to="/menu?category=Pizza" className="hover:text-[#FF6B35] transition-colors">Artisan Pizza</Link>
              </li>
              <li>
                <Link to="/menu?category=Burgers" className="hover:text-[#FF6B35] transition-colors">Gourmet Burgers</Link>
              </li>
              <li>
                <Link to="/menu?category=Desserts" className="hover:text-[#FF6B35] transition-colors">Decadent Desserts</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Contact & Support</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#FF6B35] shrink-0 mt-0.5" />
                <span>124 Culinary Boulevard, Sector 18, Gurugram, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#FF6B35] shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#FF6B35] shrink-0" />
                <span>support@foodiehub.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Copyright */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} FoodieHub Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Cookie Preferences</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
