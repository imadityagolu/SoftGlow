import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const heroSlides = [
    {
      title: "Indulge in",
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

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 10000); // Change slide every 10 seconds

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setIsAnimating(false);
    }, 150);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
      setIsAnimating(false);
    }, 150);
  };

  return (
    <section id="home" className={`relative bg-gradient-to-br ${heroSlides[currentSlide].bgColor} overflow-hidden transition-all duration-1000 ease-in-out`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between">
          <div className={`flex-1 max-w-2xl transform transition-all duration-700 ease-in-out ${isAnimating ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'}`}>
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
              <Link to="/all-products" className="bg-amber-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-amber-700 transition-colors shadow-lg">
                Order now
              </Link>
              <Link to="/all-products" className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium hover:border-amber-600 hover:text-amber-600 transition-colors">
                Open catalog
              </Link>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center items-center">
            <div className={`relative transform transition-all duration-700 ease-in-out ${isAnimating ? 'opacity-0 translate-x-[20px] scale-95' : 'opacity-100 translate-x-0 scale-100'}`}>
              <div className="w-96 h-96 bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl transform rotate-12 shadow-2xl flex items-center justify-center transition-all duration-500 hover:rotate-6 hover:scale-105">
                <span className={`text-9xl transition-all duration-500 ${isAnimating ? 'scale-75 opacity-0' : 'scale-100 opacity-100'}`}>{heroSlides[currentSlide].image}</span>
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
              onClick={() => {
                if (!isAnimating && index !== currentSlide) {
                  setIsAnimating(true);
                  setTimeout(() => {
                    setCurrentSlide(index);
                    setIsAnimating(false);
                  }, 150);
                }
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                index === currentSlide ? 'bg-amber-600 scale-110' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Navigation arrows */}
      <button 
        onClick={prevSlide}
        disabled={isAnimating}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ←
      </button>
      <button 
        onClick={nextSlide}
        disabled={isAnimating}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        →
      </button>
    </section>
  );
};

export default HeroSection;