import React from 'react';
import Header from './Header';
import Footer from './Footer';

const CancelReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-8xl mb-4 block">↩️</span>
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Cancel & Return <span className="text-orange-600">Policy</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We want you to be completely satisfied with your purchase. Learn about our return and refund policies.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg space-y-8">
            
            {/* Overview */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Policy Overview</h2>
              <p className="text-gray-600 leading-relaxed">
                At SoftGlow, we stand behind the quality of our handmade candles. This policy outlines 
                our procedures for returns, exchanges, cancellations, and refunds. Please read this 
                policy carefully before making a purchase.
              </p>
            </div>

            {/* Order Cancellation */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Order Cancellation</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">2.1 Online Orders</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                You may cancel your order free of charge if:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                <li>The order has not yet delivered to you</li>
                <li>You can cancel your order from the website or contact us via WhatsApp (+91 8083079692) or email (softglow@gmail.com)</li>
                <li>You provide your order number and reason for cancellation</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">2.2 Custom Orders</h3>
              <p className="text-gray-600 leading-relaxed">
                Custom or personalized orders cannot be cancelled once production begins, as these 
                items are made specifically for you and cannot be resold.
              </p>
            </div>

            {/* Return Eligibility */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Return Eligibility</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">3.1 Eligible Returns</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We accept returns for the following reasons:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                <li>Defective or damaged products received</li>
                <li>Incorrect item shipped (our error)</li>
                <li>Significant quality issues that affect functionality</li>
                <li>Products that don't match the description on our website</li>
              </ul>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                If you are not satisfied with your purchase, you may return the product within 24 hours 
                of delivery for a refund or exchange.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                <li>You can cancel your order from the website or contact us via WhatsApp (+91 8083079692) or email (softglow@gmail.com)</li>
                <li>You provide your order number and reason for cancellation</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">3.2 Non-Eligible Returns</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We cannot accept returns for:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                <li>Used or burned candles (unless defective)</li>
                <li>Custom or personalized items</li>
                <li>Products damaged due to misuse or normal wear</li>
                <li>Items returned after 24 hours from delivery</li>
                <li>Products without original packaging</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">3.3 Return Timeframe</h3>
              <p className="text-gray-600 leading-relaxed">
                Returns must be initiated within <strong>24 hours</strong> of receiving your order. 
                Contact us immediately if you receive a damaged or incorrect item.
              </p>
            </div>

            {/* Return Process */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Return Process</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">4.1 Initiate Return</h3>
              <div className="bg-orange-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">To start a return:</h4>
                <ol className="list-decimal list-inside text-gray-600 space-y-2">
                  <li>You can cancel your order from the website or contact us via WhatsApp (+91 8083079692) or email (softglow@gmail.com)</li>
                  <li>Provide your order number and photos of the issue (if applicable)</li>
                  <li>Explain the reason for return</li>
                  <li>Wait for our return authorization and instructions</li>
                </ol>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">4.2 Return Shipping</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Return shipping procedures:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                <li>We will provide return shipping instructions</li>
                <li>For defective items: We cover return shipping costs</li>
                <li>For other eligible returns: Customer covers return shipping</li>
                <li>Pack items securely in original packaging is mandatory</li>
                <li>Include order number and return authorization in the package</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">4.3 Inspection Process</h3>
              <p className="text-gray-600 leading-relaxed">
                Once we receive your return, we will inspect the items within 2-3 business days. 
                We will notify you of the inspection results and next steps via email or WhatsApp.
              </p>
            </div>

            {/* Refunds */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Refunds</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">5.1 Refund Processing</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Approved refunds will be processed as follows:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                <li>Refunds are issued to the original payment method</li>
                <li>Processing time: 5-7 business days after approval</li>
                <li>Bank processing may take additional 3-5 business days</li>
                <li>You will receive email confirmation when refund is processed</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">5.2 Partial Refunds</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Partial refunds may be issued for:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                <li>Items with minor defects that don't affect functionality</li>
                <li>Items returned without original packaging</li>
                <li>Items showing signs of use beyond normal inspection</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">5.3 Refund Exclusions</h3>
              <p className="text-gray-600 leading-relaxed">
                The following charges are non-refundable:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Original shipping costs (unless we made an error)</li>
                <li>Return shipping costs (unless item was defective)</li>
                <li>Payment processing fees</li>
                <li>Custom design or personalization fees</li>
              </ul>
            </div>

            {/* Exchanges */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Exchanges</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">6.1 Exchange Policy</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We offer exchanges in the following situations:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                <li>Defective products for the same item</li>
                <li>Wrong item shipped (our error)</li>
                <li>Size or scent exchanges (subject to availability)</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">6.2 Exchange Process</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                To request an exchange:
              </p>
              <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-4 mb-6">
                <li>Follow the same process as returns (go to website or contact us)</li>
                <li>Specify the item you'd like to exchange for</li>
                <li>We'll check availability and provide instructions</li>
                <li>Ship the original item back to us</li>
                <li>We'll send the replacement once we receive your return</li>
              </ol>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">6.3 Price Differences</h3>
              <p className="text-gray-600 leading-relaxed">
                If the replacement item costs more, you'll need to pay the difference. 
                If it costs less, we'll refund the difference to your original payment method.
              </p>
            </div>

            {/* Damaged Items */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Damaged or Defective Items</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">7.1 Reporting Damage</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you receive a damaged or defective item:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                <li>Contact us immediately (within 24 hours of delivery)</li>
                <li>Provide clear photos of the damage</li>
                <li>Keep all packaging materials</li>
                <li>Do not use the damaged product</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">7.2 Our Response</h3>
              <p className="text-gray-600 leading-relaxed">
                For damaged or defective items, we will:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Provide immediate replacement at no cost</li>
                <li>Cover all return and replacement shipping costs</li>
                <li>Expedite the replacement order</li>
                <li>Investigate the cause to prevent future issues</li>
              </ul>
            </div>

            {/* Special Circumstances */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Special Circumstances</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">8.1 Bulk Orders</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                For bulk orders (10+ items), special return terms may apply. 
                Please contact us to discuss specific arrangements.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">8.2 Seasonal Items</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Limited edition or seasonal items may have different return policies 
                due to their special nature. These will be clearly stated at the time of purchase.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">8.3 Gift Orders</h3>
              <p className="text-gray-600 leading-relaxed">
                For gift orders, the recipient can initiate returns, but refunds will 
                be issued to the original purchaser's payment method.
              </p>
            </div>

            {/* Contact for Returns */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Contact Information</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                For all return, exchange, and refund inquiries, please contact us:
              </p>
              <div className="bg-orange-50 rounded-lg p-6">
                <div className="space-y-3">
                  <p className="text-gray-700"><strong>WhatsApp:</strong> +91 8083079692 (Fastest response)</p>
                  <p className="text-gray-700"><strong>Email:</strong> softglow@gmail.com</p>
                  <p className="text-gray-700"><strong>Business Hours:</strong> Monday-Friday, 9 AM - 6 PM IST</p>
                </div>
                <div className="mt-4 pt-4 border-t border-orange-200">
                  <p className="text-sm text-gray-600">
                    <strong>Response Time:</strong> We respond to all return requests within 24 hours during business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Important Notes</h2>
              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">🕒 Time Sensitivity</h3>
                  <p className="text-gray-600 text-sm">
                    Please inspect your order immediately upon delivery and contact us within 
                    the specified timeframes to ensure eligibility for returns or exchanges.
                  </p>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">📦 Packaging</h3>
                  <p className="text-gray-600 text-sm">
                    Keep original packaging for at least 7 days after delivery. 
                    This helps ensure safe return shipping and faster processing.
                  </p>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">💬 Communication</h3>
                  <p className="text-gray-600 text-sm">
                    We're here to help! Don't hesitate to reach out with any questions 
                    or concerns about your order. Customer satisfaction is our priority.
                  </p>
                </div>
              </div>
            </div>

            {/* Policy Updates */}
            <div className="border-t pt-8">
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Policy Updates</h3>
                <p className="text-sm">
                  This policy may be updated from time to time. Any changes will be posted on this page 
                  with an updated revision date. Continued use of our services after changes constitutes 
                  acceptance of the updated policy.
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

export default CancelReturnPolicy;