import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
        <img
          src={product.images[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-medium text-gray-700">
          {product.condition}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{product.title}</h3>
          <span className="text-primary-600 font-bold">${product.pricePerDay}/day</span>
        </div>
        <p className="mt-1 text-gray-600 text-sm line-clamp-2">{product.description}</p>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {product.location}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {product.category}
          </span>
          <Link
            to={`/products/${product._id}`}
            className="btn-primary"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
