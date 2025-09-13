import React from 'react';
import Header from './Header';
import Footer from './Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-8xl mb-4 block">🔒</span>
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Privacy <span className="text-orange-600">Policy</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg space-y-8">
            
            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                SoftGlow ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you visit our website 
                or make purchases from us. Please read this privacy policy carefully.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                <li>Create an account on our website</li>
                <li>Make a purchase or place an order</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us through our contact form</li>
                <li>Participate in surveys or promotions</li>
                <li>Leave reviews or feedback</li>
              </ul>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                This information may include:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                <li>Name and contact information (email, phone number, address)</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely by third-party payment processors)</li>
                <li>Order history and preferences</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">2.2 Automatically Collected Information</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                When you visit our website, we may automatically collect certain information about your device and usage:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website</li>
                <li>Device information</li>
              </ul>
            </div>

            {/* How We Use Your Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Processing and fulfilling your orders</li>
                <li>Providing customer service and support</li>
                <li>Sending order confirmations and shipping updates</li>
                <li>Communicating about products, services, and promotions (with your consent)</li>
                <li>Improving our website and user experience</li>
                <li>Analyzing website usage and trends</li>
                <li>Preventing fraud and ensuring security</li>
                <li>Complying with legal obligations</li>
                <li>Personalizing your shopping experience</li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your 
                information in the following circumstances:
              </p>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">4.1 Service Providers</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may share information with trusted third-party service providers who assist us in:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                <li>Payment processing</li>
                <li>Shipping and delivery</li>
                <li>Email marketing</li>
                <li>Website analytics</li>
                <li>Customer support</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">4.2 Legal Requirements</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may disclose your information if required by law or in response to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Legal processes or government requests</li>
                <li>Protection of our rights and property</li>
                <li>Prevention of fraud or illegal activities</li>
                <li>Protection of user safety</li>
              </ul>
            </div>

            {/* Cookies and Tracking */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Cookies and Tracking Technologies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience:
              </p>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">5.1 Types of Cookies</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                <li><strong>Essential Cookies:</strong> Necessary for website functionality</li>
                <li><strong>Performance Cookies:</strong> Help us understand how visitors use our site</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">5.2 Managing Cookies</h3>
              <p className="text-gray-600 leading-relaxed">
                You can control cookies through your browser settings. However, disabling certain cookies 
                may affect website functionality and your user experience.
              </p>
            </div>

            {/* Data Security */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Data Security</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We implement appropriate security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>SSL encryption for data transmission</li>
                <li>Secure payment processing through trusted providers</li>
                <li>Regular security assessments and updates</li>
                <li>Limited access to personal information</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                However, no method of transmission over the internet is 100% secure. While we strive to 
                protect your information, we cannot guarantee absolute security.
              </p>
            </div>

            {/* Data Retention */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Data Retention</h2>
              <p className="text-gray-600 leading-relaxed">
                We retain your personal information only as long as necessary to fulfill the purposes outlined 
                in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. 
                When information is no longer needed, we securely delete or anonymize it.
              </p>
            </div>

            {/* Your Rights */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Your Rights and Choices</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </div>

            {/* Third-Party Links */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Third-Party Links</h2>
              <p className="text-gray-600 leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the 
                privacy practices or content of these external sites. We encourage you to review the 
                privacy policies of any third-party sites you visit.
              </p>
            </div>

            {/* Children's Privacy */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                Our services are not intended for children under 13 years of age. We do not knowingly 
                collect personal information from children under 13. If we become aware that we have 
                collected such information, we will take steps to delete it promptly.
              </p>
            </div>

            {/* International Transfers */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">11. International Data Transfers</h2>
              <p className="text-gray-600 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place to protect your information in accordance 
                with this privacy policy.
              </p>
            </div>

            {/* Changes to Privacy Policy */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material 
                changes by posting the new policy on our website and updating the "Last updated" date. 
                Your continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">13. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-orange-50 rounded-lg p-6">
                <div className="space-y-3">
                  <p className="text-gray-700"><strong>Email:</strong> softglow@gmail.com</p>
                  <p className="text-gray-700"><strong>WhatsApp:</strong> +91 8083079692</p>
                  <p className="text-gray-700"><strong>Address:</strong> Ranchi, Jharkhand, India</p>
                </div>
                <div className="mt-4 pt-4 border-t border-orange-200">
                  <p className="text-sm text-gray-600">
                    We are committed to resolving any privacy concerns you may have and will respond 
                    to your inquiries within 30 days.
                  </p>
                </div>
              </div>
            </div>

            {/* Consent */}
            <div className="border-t pt-8">
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Your Consent</h3>
                <p className="text-sm">
                  By using our website and services, you consent to the collection and use of your 
                  information as described in this Privacy Policy. If you do not agree with this 
                  policy, please do not use our services.
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

export default PrivacyPolicy;