import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../utils/api';

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await productsAPI.getAllProducts({ limit: 8, sort: '-createdAt' });
        setTrendingProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover opacity-50"
            poster="https://images.unsplash.com/photo-1558882655-40e0f04d92b4"
          >
            <source src="/videos/hero-background.mp4" type="video/mp4" />
          </video>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 animate-gradient">
              Rent Smarter
            </span>
          </h1>
          <p className="text-2xl md:text-4xl mb-8 text-gray-300 font-yatra">
            आओ मिलकर साझा करे, सहयोग करे साथ बढ़ें |
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/browse"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-purple-500/50"
            >
              Start Browsing
            </Link>
            
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Trending Now
            </span>
          </h2>

          {loading ? (
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl border border-purple-500/20 hover:scale-105 transition-transform duration-300"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.images[0]?.url || 'https://via.placeholder.com/400'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 truncate">{product.title}</h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-purple-400">₹{product.pricePerDay}/day</span>
                      <span className="text-sm text-gray-300">View Details →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Why Choose Us?
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: '💰',
                title: 'Save Money',
                description: 'Pay only for what you need, when you need it'
              },
              {
                icon: '🌍',
                title: 'Eco-Friendly',
                description: 'Reduce waste by sharing resources'
              },
              {
                icon: '🤝',
                title: 'Trust & Safety',
                description: 'Verified users and secure transactions'
              }
            ].map((feature, index) => (
              <div key={index} className="p-8 rounded-2xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl border border-purple-500/20 hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-pink-900 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Start Renting?</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of users who are already saving money and reducing waste through renting.
          </p>
          <Link
            to="/profile"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-purple-500/50"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
