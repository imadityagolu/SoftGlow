import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "Indulge in the",
      subtitle: "Finest Premium Candles",
      description: "Taste the difference with every light",
      image: "🕯️",
      bgColor: "from-amber-50 to-orange-100"
    },
    {
      title: "Discover Our",
      subtitle: "Luxury Collection",
      description: "Handcrafted candles for every occasion",
      image: "✨",
      bgColor: "from-orange-50 to-amber-100"
    },
    {
      title: "Create Perfect",
      subtitle: "Ambiance at Home",
      description: "Transform your space with our premium scents",
      image: "🏠",
      bgColor: "from-amber-100 to-orange-50"
    }
  ];

  const categories = [
    {
      name: "Aromatherapy",
      image: "🌿",
      description: "Relaxing scents for wellness"
    },
    {
      name: "Luxury Collection",
      image: "💎",
      description: "Premium handcrafted candles"
    },
    {
      name: "Seasonal Specials",
      image: "🍂",
      description: "Limited edition seasonal scents"
    }
  ];

  const featuredProducts = [
    {
      name: "Vanilla Dreams",
      price: "$45.99",
      originalPrice: "$59.99",
      image: "🍦",
      rating: 5
    },
    {
      name: "Lavender Bliss",
      price: "$38.50",
      originalPrice: "$48.50",
      image: "💜",
      rating: 5
    },
    {
      name: "Ocean Breeze",
      price: "$42.25",
      originalPrice: "$52.25",
      image: "🌊",
      rating: 4
    },
    {
      name: "Rose Garden",
      price: "$67.25",
      originalPrice: "$82.25",
      image: "🌹",
      rating: 5
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <span className="text-3xl mr-3">🕯️</span>
              <span className="text-2xl font-bold text-gray-900">SoftGlow</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-amber-600 font-medium">Home</a>
              <a href="#about" className="text-gray-700 hover:text-amber-600 transition-colors">About us</a>
              <a href="#products" className="text-gray-700 hover:text-amber-600 transition-colors">Special candles</a>
              <a href="#contact" className="text-gray-700 hover:text-amber-600 transition-colors">Contact</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-700 hover:text-amber-600 transition-colors">
                🔍
              </button>
              <button className="p-2 text-gray-700 hover:text-amber-600 transition-colors relative">
                🛒
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
              </button>
              <Link 
                to="/customer/login"
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className={`relative bg-gradient-to-br ${heroSlides[currentSlide].bgColor} overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                <span className="block">{heroSlides[currentSlide].title}</span>
                <span className="block text-amber-600 italic font-serif">
                  {heroSlides[currentSlide].subtitle}
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {heroSlides[currentSlide].description}
              </p>
              <div className="flex space-x-4">
                <button className="bg-amber-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-amber-700 transition-colors shadow-lg">
                  Order now
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium hover:border-amber-600 hover:text-amber-600 transition-colors">
                  Open catalog
                </button>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center items-center">
              <div className="relative">
                <div className="w-96 h-96 bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl transform rotate-12 shadow-2xl flex items-center justify-center">
                  <span className="text-9xl">{heroSlides[currentSlide].image}</span>
                  <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Premium Quality
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Slide indicators */}
          <div className="flex justify-center mt-12 space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-amber-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Navigation arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all"
        >
          ←
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all"
        >
          →
        </button>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Categories</h2>
            <p className="text-xl text-gray-600">Discover our most loved candle collections</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-4xl">{category.image}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{category.name}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600">Our bestselling premium candles</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-8 text-center">
                  <span className="text-6xl">{product.image}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    {renderStars(product.rating)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-amber-600">{product.price}</span>
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                  </div>
                  <button className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About SoftGlow</h2>
              <p className="text-lg text-gray-600 mb-6">
                For over a decade, SoftGlow has been crafting premium candles that transform spaces and create unforgettable moments. Our artisans carefully select the finest waxes and fragrances to ensure each candle delivers an exceptional experience.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                From intimate dinners to relaxing baths, our candles are designed to enhance life's special moments with beautiful scents and warm, ambient lighting.
              </p>
              <button className="bg-amber-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-amber-700 transition-colors">
                Learn More
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8 text-center">
                <span className="text-4xl block mb-4">🏆</span>
                <h3 className="font-bold text-gray-900">Award Winning</h3>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-8 text-center">
                <span className="text-4xl block mb-4">🌱</span>
                <h3 className="font-bold text-gray-900">Eco Friendly</h3>
              </div>
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8 text-center">
                <span className="text-4xl block mb-4">✋</span>
                <h3 className="font-bold text-gray-900">Handcrafted</h3>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-8 text-center">
                <span className="text-4xl block mb-4">💝</span>
                <h3 className="font-bold text-gray-900">Premium Quality</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🕯️</span>
                <span className="text-2xl font-bold">SoftGlow</span>
              </div>
              <p className="text-gray-400 mb-4">
                Creating beautiful moments with premium candles since 2010.
              </p>
              <div className="flex space-x-4">
                <span className="text-2xl cursor-pointer hover:text-amber-400 transition-colors">📘</span>
                <span className="text-2xl cursor-pointer hover:text-amber-400 transition-colors">📷</span>
                <span className="text-2xl cursor-pointer hover:text-amber-400 transition-colors">🐦</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Products</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Customer Care</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/customer/login" className="hover:text-white transition-colors">My Account</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <p>📍 123 Candle Street, Scent City, SC 12345</p>
                <p>📞 (555) 123-GLOW</p>
                <p>✉️ hello@softglow.com</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SoftGlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;