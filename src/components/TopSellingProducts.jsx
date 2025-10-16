// src/components/TopSellingProducts.jsx

import React from 'react';

const TopSellingProducts = ({ products }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <h3 className="font-bold text-lg text-gray-800 mb-4">Top Selling Products</h3>
      <div className="space-y-4">
        {products.map(product => (
          <div key={product.rank} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 flex-shrink-0 bg-orange-100 text-orange-600 rounded-md flex items-center justify-center font-bold">
                {product.rank}
              </div>
              <div>
                <p className="font-semibold text-gray-700">{product.name}</p>
                <p className="text-xs text-gray-500">{product.sold} sold</p>
              </div>
            </div>
            <p className="font-semibold text-gray-800">{product.revenue}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingProducts;