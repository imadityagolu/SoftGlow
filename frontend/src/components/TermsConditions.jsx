import React from 'react';
import Header from './Header';
import Footer from './Footer';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-8xl mb-4 block">📋</span>
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Terms & <span className="text-orange-600">Conditions</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Please read these terms and conditions carefully before using our services.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg space-y-8">
            
            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                Welcome to SoftGlow! These Terms and Conditions ("Terms") govern your use of our website 
                and services. By accessing or using our website, you agree to be bound by these Terms. 
                If you disagree with any part of these terms, then you may not access our service.
              </p>
            </div>

            {/* Definitions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Definitions</h2>
              <div className="space-y-3">
                <p className="text-gray-600"><strong>"Company"</strong> refers to SoftGlow.</p>
                <p className="text-gray-600"><strong>"Service"</strong> refers to the website and products offered by SoftGlow.</p>
                <p className="text-gray-600"><strong>"User"</strong> or "You" refers to the individual accessing or using the service.</p>
                <p className="text-gray-600"><strong>"Products"</strong> refers to handmade candles and related items sold by SoftGlow.</p>
              </div>
            </div>

            {/* Use of Service */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Use of Service</h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  You may use our service for lawful purposes only. You agree not to use the service:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>In any way that violates applicable laws or regulations</li>
                  <li>To transmit or procure harmful, threatening, or offensive content</li>
                  <li>To impersonate or attempt to impersonate the Company or other users</li>
                  <li>To engage in any fraudulent or deceptive practices</li>
                  <li>To interfere with or disrupt the service or servers</li>
                </ul>
              </div>
            </div>

            {/* Products and Orders */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Products and Orders</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">4.1 Product Information</h3>
                <p className="text-gray-600 leading-relaxed">
                  We strive to display accurate product information, including descriptions, prices, and images. 
                  However, we do not warrant that product descriptions or other content is accurate, complete, 
                  reliable, or error-free. Colors and appearance may vary due to monitor settings and handmade nature.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-800">4.2 Order Acceptance</h3>
                <p className="text-gray-600 leading-relaxed">
                  All orders are subject to acceptance and availability. We reserve the right to refuse or 
                  cancel any order for any reason, including but not limited to product availability, 
                  errors in product information, or suspected fraudulent activity.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-800">4.3 Handmade Nature</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our products are handmade and may have slight variations in size, color, and appearance. 
                  These variations are part of the charm and uniqueness of handcrafted items and are not 
                  considered defects.
                </p>
              </div>
            </div>

            {/* Pricing and Payment */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Pricing and Payment</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">5.1 Pricing</h3>
                <p className="text-gray-600 leading-relaxed">
                  All prices are listed in Indian Rupees (INR) and are subject to change without notice. 
                  Prices include applicable taxes unless otherwise stated. We reserve the right to modify 
                  prices at any time.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-800">5.2 Payment</h3>
                <p className="text-gray-600 leading-relaxed">
                  Payment must be made in full before order processing. We accept various payment methods 
                  as displayed during checkout. All payments are processed securely through trusted payment 
                  gateways.
                </p>
              </div>
            </div>

            {/* Shipping and Delivery */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Shipping and Delivery</h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  We ship within India only. Delivery times are estimates and may vary due to location, 
                  weather conditions, or other factors beyond our control. We are not responsible for 
                  delays caused by shipping carriers.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Risk of loss and title for products pass to you upon delivery to the shipping carrier. 
                  We recommend purchasing shipping insurance for valuable orders.
                </p>
              </div>
            </div>

            {/* Returns and Refunds */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Returns and Refunds</h2>
              <p className="text-gray-600 leading-relaxed">
                Please refer to our separate Return and Refund Policy for detailed information about 
                returns, exchanges, and refunds. This policy is incorporated by reference into these Terms.
              </p>
            </div>

            {/* Intellectual Property */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed">
                The service and its original content, features, and functionality are owned by SoftGlow 
                and are protected by international copyright, trademark, patent, trade secret, and other 
                intellectual property laws. You may not reproduce, distribute, or create derivative works 
                without our express written permission.
              </p>
            </div>

            {/* User Accounts */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. User Accounts</h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  When you create an account, you must provide accurate and complete information. 
                  You are responsible for safeguarding your password and all activities under your account.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to suspend or terminate accounts that violate these Terms or 
                  engage in suspicious activity.
                </p>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                To the maximum extent permitted by law, SoftGlow shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including but not limited to 
                loss of profits, data, or use, arising out of or relating to your use of the service.
              </p>
            </div>

            {/* Disclaimer */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Disclaimer</h2>
              <p className="text-gray-600 leading-relaxed">
                The service is provided on an "as is" and "as available" basis. We make no warranties, 
                expressed or implied, regarding the service, including but not limited to warranties of 
                merchantability, fitness for a particular purpose, or non-infringement.
              </p>
            </div>

            {/* Governing Law */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Governing Law</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of India. 
                Any disputes arising under these Terms shall be subject to the exclusive jurisdiction 
                of the courts in Ranchi, Jharkhand, India.
              </p>
            </div>

            {/* Changes to Terms */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be effective 
                immediately upon posting on our website. Your continued use of the service after 
                changes constitutes acceptance of the new Terms.
              </p>
            </div>

            {/* Severability */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">14. Severability</h2>
              <p className="text-gray-600 leading-relaxed">
                If any provision of these Terms is found to be unenforceable or invalid, that provision 
                will be limited or eliminated to the minimum extent necessary so that the remaining 
                Terms will remain in full force and effect.
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">15. Contact Information</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> softglow@gmail.com</p>
                <p className="text-gray-700"><strong>WhatsApp:</strong> +91 8083079692</p>
                <p className="text-gray-700"><strong>Address:</strong> Ranchi, Jharkhand, India</p>
              </div>
            </div>

            {/* Agreement */}
            <div className="border-t pt-8">
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Agreement</h3>
                <p className="text-sm">
                  By using our service, you acknowledge that you have read, understood, and agree 
                  to be bound by these Terms and Conditions. If you do not agree to these Terms, 
                  please do not use our service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsConditions;