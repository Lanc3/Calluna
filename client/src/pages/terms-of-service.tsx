import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-calluna-cream">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-playfair font-bold text-calluna-brown mb-8">
            Terms of Service
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
                1. Acceptance of Terms
              </h2>
              <p className="mb-4">
                By accessing and using the Calluna Bar & Grill website and making reservations through our platform, you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service govern your use of our website, reservation system, and dining services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                2. Reservation Policy
              </h2>
              <h3 className="text-xl font-semibold text-calluna-brown mb-3">Booking Requirements</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>All reservations require accurate contact information</li>
                <li>Party size must be specified and cannot exceed table capacity</li>
                <li>Special dietary requirements should be noted at time of booking</li>
                <li>Large party reservations (8+ guests) may require advance deposit</li>
              </ul>

              <h3 className="text-xl font-semibold text-calluna-brown mb-3">Cancellation Policy</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Cancellations must be made at least 2 hours before reservation time</li>
                <li>No-shows may be subject to a cancellation fee</li>
                <li>Late arrivals beyond 15 minutes may result in table reassignment</li>
                <li>Same-day cancellations for parties of 6+ may incur charges</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                3. Dining Policies
              </h2>
              <h3 className="text-xl font-semibold text-calluna-brown mb-3">Dress Code</h3>
              <p className="mb-4">
                We maintain a smart casual to business casual dress code. We reserve the right to refuse service to guests whose attire does not meet our standards.
              </p>

              <h3 className="text-xl font-semibold text-calluna-brown mb-3">Age Policy</h3>
              <p className="mb-4">
                Minors are welcome when accompanied by adults. Our bar area may have age restrictions during certain hours. Valid ID required for alcoholic beverage service.
              </p>

              <h3 className="text-xl font-semibold text-calluna-brown mb-3">Special Dietary Needs</h3>
              <p className="mb-4">
                We make every effort to accommodate dietary restrictions and allergies. Please inform us of any special requirements when making your reservation or notify your server upon arrival.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                4. Payment and Pricing
              </h2>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>All prices are subject to applicable taxes and service charges</li>
                <li>Menu prices and availability subject to change without notice</li>
                <li>We accept major credit cards, debit cards, and cash</li>
                <li>Gratuity is at the discretion of the guest</li>
                <li>Automatic gratuity may be added for parties of 6 or more</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                5. Website Use and Conduct
              </h2>
              <p className="mb-4">When using our website, you agree to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Provide accurate and truthful information</li>
                <li>Use the reservation system only for legitimate dining purposes</li>
                <li>Not make false or fraudulent reservations</li>
                <li>Respect other guests' privacy and dining experience</li>
                <li>Not engage in disruptive or inappropriate behavior</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                6. Limitation of Liability
              </h2>
              <p className="mb-4">
                Calluna Bar & Grill shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services or website. Our liability is limited to the maximum extent permitted by law.
              </p>
              <p className="mb-4">
                We are not responsible for personal belongings left on the premises. Guests dine at their own risk regarding food allergies and dietary restrictions despite our best efforts to accommodate special needs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                7. Privacy and Data Protection
              </h2>
              <p className="mb-4">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information. By using our services, you consent to our data practices as described in our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                8. Intellectual Property
              </h2>
              <p className="mb-4">
                All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of Calluna Bar & Grill and is protected by copyright and trademark laws. Unauthorized use is prohibited.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                9. Right to Refuse Service
              </h2>
              <p className="mb-4">
                We reserve the right to refuse service to any person for any reason, including but not limited to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Violation of dress code or conduct policies</li>
                <li>Intoxication or disruptive behavior</li>
                <li>Failure to comply with health and safety requirements</li>
                <li>Fraudulent reservation activities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                10. Force Majeure
              </h2>
              <p className="mb-4">
                We are not liable for any failure to perform our obligations due to circumstances beyond our reasonable control, including but not limited to natural disasters, government regulations, labor disputes, or other unforeseeable events.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                11. Modifications to Terms
              </h2>
              <p className="mb-4">
                We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services constitutes acceptance of any modifications.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                12. Governing Law
              </h2>
              <p className="mb-4">
                These Terms of Service are governed by the laws of New York State. Any disputes arising from these terms will be resolved in the courts of New York State.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                13. Contact Information
              </h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-calluna-cream p-4 rounded-lg">
                <p><strong>Calluna Bar & Grill</strong></p>
                <p>123 Gourmet Street</p>
                <p>Culinary District, NY 10001</p>
                <p>Phone: (555) 123-4567</p>
                <p>Email: legal@callunabar.com</p>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-600">
                By making a reservation or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}