import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-calluna-cream">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-playfair font-bold text-calluna-brown mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none text-calluna-charcoal">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                1. Information We Collect
              </h2>
              <p className="mb-4">
                At Calluna Bar & Grill, we collect information you provide directly to us when making reservations or contacting us:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Name and contact information (phone number, email address)</li>
                <li>Reservation details (date, time, party size, special requests)</li>
                <li>Dietary restrictions and special accommodations</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                2. How We Use Your Information
              </h2>
              <p className="mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Process and confirm your restaurant reservations</li>
                <li>Communicate with you about your bookings</li>
                <li>Accommodate special dietary needs and preferences</li>
                <li>Improve our restaurant services and customer experience</li>
                <li>Send you updates about our menu, events, and special offers (with your consent)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                3. Information Sharing
              </h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations or respond to lawful requests</li>
                <li>To protect our rights, property, or safety, or that of our customers</li>
                <li>With trusted service providers who assist in our operations (under strict confidentiality agreements)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                4. Data Security
              </h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Secure data transmission using encryption technology</li>
                <li>Limited access to personal information on a need-to-know basis</li>
                <li>Regular security assessments and updates</li>
                <li>Secure storage of reservation and customer data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                5. Cookies and Tracking
              </h2>
              <p className="mb-4">
                Our website may use cookies and similar tracking technologies to enhance your browsing experience. These help us:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Improve our website functionality and performance</li>
              </ul>
              <p>
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                6. Your Rights
              </h2>
              <p className="mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Access and review your personal information</li>
                <li>Request corrections to inaccurate information</li>
                <li>Request deletion of your personal data</li>
                <li>Opt out of marketing communications</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                7. Data Retention
              </h2>
              <p>
                We retain your personal information only as long as necessary to fulfill the purposes outlined in this privacy policy, comply with legal obligations, resolve disputes, and enforce our agreements. Reservation data is typically retained for 2 years for operational and customer service purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                8. Children's Privacy
              </h2>
              <p>
                Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                9. Changes to This Policy
              </h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                10. Contact Us
              </h2>
              <p className="mb-4">
                If you have any questions about this privacy policy or our data practices, please contact us:
              </p>
              <div className="bg-calluna-cream p-4 rounded-lg">
                <p><strong>Calluna Bar & Grill</strong></p>
                <p>123 Gourmet Street</p>
                <p>Culinary District, NY 10001</p>
                <p>Phone: (555) 123-4567</p>
                <p>Email: privacy@callunabar.com</p>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-600">
                This privacy policy complies with applicable data protection laws and regulations. 
                We are committed to protecting your privacy and maintaining the confidentiality of your personal information.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}