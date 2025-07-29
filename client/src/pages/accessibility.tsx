import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Accessibility() {
  return (
    <div className="min-h-screen bg-calluna-cream">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-playfair font-bold text-calluna-brown mb-8">
            Accessibility Statement
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
                Our Commitment to Accessibility
              </h2>
              <p className="mb-4">
                At Calluna Bar & Grill, we are committed to ensuring that our restaurant and website are accessible to all guests, including those with disabilities. We strive to provide an inclusive dining experience and digital platform that welcomes everyone.
              </p>
              <p className="mb-4">
                We continuously work to improve accessibility and remove barriers that may prevent interaction with or access to our services, both in-person and online.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                Physical Accessibility Features
              </h2>
              <h3 className="text-xl font-semibold text-calluna-brown mb-3">Restaurant Access</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Wheelchair accessible entrance with automatic doors</li>
                <li>Accessible parking spaces available in front of the restaurant</li>
                <li>Wide aisles and pathways throughout the dining areas</li>
                <li>Accessible restrooms with grab bars and proper clearances</li>
                <li>Tables at various heights to accommodate wheelchair users</li>
                <li>Step-free access to all public areas of the restaurant</li>
              </ul>

              <h3 className="text-xl font-semibold text-calluna-brown mb-3">Seating Accommodations</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Adjustable and removable chairs at select tables</li>
                <li>Booth seating with transfer space available</li>
                <li>Quiet seating areas for guests with sensory sensitivities</li>
                <li>Well-lit dining areas with adjustable lighting options</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                Service Accommodations
              </h2>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Large print menus available upon request</li>
                <li>Braille menus available with advance notice</li>
                <li>Staff training on disability awareness and assistance</li>
                <li>Assistance with menu reading and item descriptions</li>
                <li>Flexible service options for different needs</li>
                <li>Service animals welcome in all areas</li>
                <li>Assistance with food cutting and preparation when needed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                Digital Accessibility
              </h2>
              <h3 className="text-xl font-semibold text-calluna-brown mb-3">Website Features</h3>
              <p className="mb-4">
                Our website is designed to be compatible with assistive technologies and follows web accessibility guidelines:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Keyboard navigation support for all interactive elements</li>
                <li>Screen reader compatible content and structure</li>
                <li>High contrast color schemes for better visibility</li>
                <li>Descriptive alt text for all images</li>
                <li>Proper heading structure for easy navigation</li>
                <li>Focus indicators for interactive elements</li>
                <li>Scalable text that works with browser zoom</li>
              </ul>

              <h3 className="text-xl font-semibold text-calluna-brown mb-3">Reservation System</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Accessible form fields with clear labels</li>
                <li>Error messages that are clearly announced</li>
                <li>Time limits that can be extended upon request</li>
                <li>Alternative booking methods via phone</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                Dietary Accommodations
              </h2>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Comprehensive allergen information available</li>
                <li>Gluten-free menu options clearly marked</li>
                <li>Vegetarian and vegan options available</li>
                <li>Custom meal preparation for specific dietary needs</li>
                <li>Detailed ingredient lists provided upon request</li>
                <li>Kitchen staff trained on allergen protocols</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                Communication Support
              </h2>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Written communication options for hearing-impaired guests</li>
                <li>Visual cues and gestures to supplement verbal communication</li>
                <li>Patient and clear communication from all staff members</li>
                <li>Multiple contact methods available (phone, email, in-person)</li>
                <li>TTY/TDD services available upon request</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                Standards and Guidelines
              </h2>
              <p className="mb-4">
                We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards and the Americans with Disabilities Act (ADA) requirements. Our accessibility efforts include:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Regular accessibility audits and improvements</li>
                <li>Staff training on accessibility best practices</li>
                <li>Ongoing testing with assistive technologies</li>
                <li>Collaboration with accessibility consultants</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                Requesting Accommodations
              </h2>
              <p className="mb-4">
                We encourage guests to let us know about any specific accommodations needed when making reservations. This allows us to prepare and ensure the best possible experience. Accommodations can be requested:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>When making online reservations (special requests field)</li>
                <li>By calling our restaurant directly</li>
                <li>By speaking with our host or manager upon arrival</li>
                <li>Through our contact form on the website</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                Feedback and Continuous Improvement
              </h2>
              <p className="mb-4">
                We welcome feedback about our accessibility features and services. Your input helps us identify areas for improvement and better serve all our guests. Please let us know if you encounter any barriers or have suggestions for improving accessibility.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                Third-Party Content
              </h2>
              <p className="mb-4">
                While we strive to ensure accessibility across our entire digital presence, some third-party content or services integrated into our website may not fully meet accessibility standards. We work with our vendors to improve accessibility and provide alternative access methods when possible.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold text-calluna-brown mb-4">
                Contact Us for Accessibility Support
              </h2>
              <p className="mb-4">
                If you need assistance with accessibility features, have suggestions for improvement, or encounter any barriers, please contact us:
              </p>
              <div className="bg-calluna-cream p-4 rounded-lg">
                <p><strong>Calluna Bar & Grill - Accessibility Coordinator</strong></p>
                <p>123 Gourmet Street</p>
                <p>Culinary District, NY 10001</p>
                <p>Phone: (555) 123-4567</p>
                <p>Email: accessibility@callunabar.com</p>
                <p>TTY: (555) 123-4568</p>
              </div>
              <p className="mt-4">
                We aim to respond to accessibility-related inquiries within 2 business days and will work with you to provide reasonable accommodations.
              </p>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-600">
                This accessibility statement demonstrates our ongoing commitment to inclusive service. We regularly review and update our accessibility practices to ensure we continue to serve all guests effectively.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}