import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-card border border-gray-100 space-y-6">
        <div className="w-20 h-20 rounded-full bg-orange-100 text-[#FF6B35] flex items-center justify-center mx-auto">
          <UtensilsCrossed className="w-10 h-10" />
        </div>
        <div>
          <span className="text-4xl font-black text-[#FF6B35] block">404</span>
          <h2 className="text-xl font-bold text-gray-800 mt-1">Page Not Found</h2>
          <p className="text-xs text-gray-500 mt-2">
            The page you're searching for seems to have vanished from our kitchen table.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF6B35] text-white font-bold text-xs shadow-md shadow-[#FF6B35]/25 hover:bg-[#E85924] transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};
