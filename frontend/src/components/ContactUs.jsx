import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { toast } from 'react-toastify';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    toast.success('Thank you for your message! We\'ll get back to you soon.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-8xl mb-4 block">📞</span>
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Contact <span className="text-orange-600">Us</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We'd love to hear from you! Get in touch with us for any questions, 
              custom orders, or just to say hello.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      placeholder="+91 12345 67890"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="custom">Custom Order</option>
                      <option value="wholesale">Wholesale Inquiry</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-colors transform hover:scale-105 duration-200"
                >
                  Send Message 📤
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              
              {/* Contact Details */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Our Location</h3>
                      <p className="text-gray-600">
                        Ranchi, Jharkhand<br />
                        India
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Email Us</h3>
                      <a 
                        href="mailto:adityasng420.ak@gmail.com" 
                        className="text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        softglow@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <span className="text-2xl">📱</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">WhatsApp</h3>
                      <a 
                        href="https://api.whatsapp.com/send?phone=918083079692" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        +91 8083079692
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <span className="text-2xl">📷</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Follow Us</h3>
                      <a 
                        href="https://www.instagram.com/_.softglow/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        @_.softglow
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Business Hours</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-semibold text-gray-800">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-semibold text-gray-800">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-semibold text-gray-800">Closed</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Note:</span> We respond to all messages within 24 hours during business days.
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-4">
                  <a 
                    href="https://api.whatsapp.com/send?phone=918083079692" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-colors"
                  >
                    <div className="flex items-center space-x-3 text-black">
                      <span className="text-2xl">💬</span>
                      <div>
                        <h3 className="font-semibold">Chat on WhatsApp</h3>
                        <p className="text-sm opacity-90">Get instant support</p>
                      </div>
                    </div>
                  </a>
                  
                  <a 
                    href="/all-products" 
                    className="block bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-colors"
                  >
                    <div className="flex items-center space-x-3 text-black">
                      <span className="text-2xl">🛍️</span>
                      <div>
                        <h3 className="font-semibold">Browse Products</h3>
                        <p className="text-sm opacity-90">Explore our collection</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">How long do your candles burn?</h3>
              <p className="text-gray-600">Our candles have varying burn times depending on size. Small candles burn for 20-25 minutes, medium for 40-45 minutes, and large candles for 60-70 minutes.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Do you offer custom scents?</h3>
              <p className="text-gray-600">Yes! We offer custom scent blending for special occasions and bulk orders. Contact us to discuss your requirements.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">What is your shipping policy?</h3>
              <p className="text-gray-600">We offer free shipping on all orders. Standard delivery takes 3-5 business days within India.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Are your candles eco-friendly?</h3>
              <p className="text-gray-600">Absolutely! We use natural wax, cotton wicks, and sustainable packaging materials in all our products.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;