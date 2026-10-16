import React from 'react';

export const FoodCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-soft space-y-4 animate-pulse">
      <div className="aspect-[4/3] w-full rounded-2xl bg-gray-200" />
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 rounded-md w-3/4" />
        <div className="h-3.5 bg-gray-200 rounded-md w-full" />
        <div className="h-3.5 bg-gray-200 rounded-md w-2/3" />
      </div>
      <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded-md w-16" />
        <div className="h-9 bg-gray-200 rounded-xl w-20" />
      </div>
    </div>
  );
};

export const FoodGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <FoodCardSkeleton key={index} />
      ))}
    </div>
  );
};
