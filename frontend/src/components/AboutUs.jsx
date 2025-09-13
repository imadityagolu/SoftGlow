import React from 'react';
import Header from './Header';
import Footer from './Footer';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-8xl mb-4 block">🕯️</span>
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              About <span className="text-orange-600">SoftGlow</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Illuminating lives with premium handcrafted candles since 2025. 
              We believe every moment deserves the perfect ambiance.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                SoftGlow was born from a passion for creating beautiful, meaningful moments. 
                Founded in Ranchi, Jharkhand, we started with a simple belief: that the right 
                candle can transform any space into a sanctuary of peace and warmth.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Each candle in our collection is carefully crafted using premium wax, 
                natural fragrances, and sustainable materials. We take pride in our 
                attention to detail and commitment to quality that you can see, smell, and feel.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From intimate dinners to relaxing baths, from meditation sessions to 
                celebration gatherings, SoftGlow candles are designed to enhance every 
                precious moment of your life.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-12">
                <span className="text-9xl block mb-4">✨</span>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Handcrafted Excellence</h3>
                <p className="text-gray-600">
                  Every candle is made with love, care, and attention to detail
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <span className="text-6xl block mb-4">🌿</span>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Sustainability</h3>
              <p className="text-gray-600">
                We use eco-friendly materials and sustainable practices in all our 
                candle-making processes to protect our planet.
              </p>
            </div>
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <span className="text-6xl block mb-4">💎</span>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Quality</h3>
              <p className="text-gray-600">
                Premium ingredients, meticulous craftsmanship, and rigorous quality 
                control ensure every candle meets our high standards.
              </p>
            </div>
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <span className="text-6xl block mb-4">❤️</span>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Passion</h3>
              <p className="text-gray-600">
                Our love for creating beautiful moments drives everything we do, 
                from design to delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Our Mission</h2>
          <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-12">
            <span className="text-7xl block mb-6">🎯</span>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              To bring warmth, comfort, and beauty into every home through our 
              premium candle collections. We strive to create products that not only 
              illuminate spaces but also elevate experiences and create lasting memories.
            </p>
            <p className="text-lg text-gray-600">
              Every SoftGlow candle is a promise of quality, sustainability, and 
              the perfect ambiance for life's most precious moments.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">👩🏻‍💼</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Pranya Pushkar</h3>
              <p className="text-orange-600 mb-3">Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                Passionate about creating beautiful experiences through premium candles.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">👩‍🎨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Design Team</h3>
              <p className="text-orange-600 mb-3">Creative Directors</p>
              <p className="text-gray-600 text-sm">
                Crafting unique designs and fragrances that tell a story.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">🛠️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Artisan Team</h3>
              <p className="text-orange-600 mb-3">Master Craftspeople</p>
              <p className="text-gray-600 text-sm">
                Skilled artisans who bring each candle to life with precision and care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-amber-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience SoftGlow?</h2>
          <p className="text-xl mb-8 opacity-90">
            Discover our premium candle collection and transform your space today.
          </p>
          <div className="space-x-4">
            <a 
              href="/all-products" 
              className="inline-block bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </a>
            <a 
              href="/contact" 
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-600 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;