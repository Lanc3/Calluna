import { Facebook, Instagram, Twitter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { ContactInfo, OpeningHours } from "@shared/schema";

export default function Footer() {
  const { data: contactInfo } = useQuery<ContactInfo[]>({
    queryKey: ["/api/contact"],
  });

  const { data: openingHours } = useQuery<OpeningHours[]>({
    queryKey: ["/api/hours"],
  });

  // Group opening hours by day and format for display
  const formatHours = (hours: OpeningHours[]) => {
    const daysMap = new Map();
    hours.forEach(h => {
      daysMap.set(h.dayOfWeek, h);
    });
    
    const groupedHours: { label: string; time: string }[] = [];
    
    // Monday-Thursday (1-4)
    const weekdayHours = daysMap.get(1);
    if (weekdayHours && !weekdayHours.isClosed) {
      groupedHours.push({
        label: "Monday - Thursday",
        time: `${weekdayHours.openTime} - ${weekdayHours.closeTime}`
      });
    }
    
    // Friday-Saturday (5-6)
    const fridayHours = daysMap.get(5);
    if (fridayHours && !fridayHours.isClosed) {
      groupedHours.push({
        label: "Friday - Saturday",
        time: `${fridayHours.openTime} - ${fridayHours.closeTime}`
      });
    }
    
    // Sunday (0)
    const sundayHours = daysMap.get(0);
    if (sundayHours && !sundayHours.isClosed) {
      groupedHours.push({
        label: "Sunday",
        time: `${sundayHours.openTime} - ${sundayHours.closeTime}`
      });
    }
    
    return groupedHours;
  };

  const displayHours = openingHours ? formatHours(openingHours) : [];
  const phoneContact = contactInfo?.find(c => c.type === 'phone');
  const emailContact = contactInfo?.find(c => c.type === 'email');
  const addressContact = contactInfo?.find(c => c.type === 'address');
  return (
    <footer id="contact" className="bg-calluna-brown text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-playfair font-bold mb-4">Calluna Bar & Grill</h3>
            <p className="text-calluna-sand mb-6 leading-relaxed">
              Experience exceptional dining in an atmosphere of refined elegance. 
              Our commitment to culinary excellence and impeccable service creates 
              unforgettable moments for every guest.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-calluna-sand hover:text-white transition-colors duration-200">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-calluna-sand hover:text-white transition-colors duration-200">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-calluna-sand hover:text-white transition-colors duration-200">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-playfair font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-calluna-sand">
              {addressContact && (
                <div className="flex items-start">
                  <div className="w-5 h-5 mt-1 mr-3">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div>
                    {addressContact.value.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
              {!addressContact && (
                <div className="flex items-start">
                  <div className="w-5 h-5 mt-1 mr-3">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div>
                    <p>123 Gourmet Street</p>
                    <p>Culinary District, NY 10001</p>
                  </div>
                </div>
              )}
              {phoneContact && (
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-3">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </div>
                  <span>{phoneContact.value}</span>
                </div>
              )}
              {!phoneContact && (
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-3">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </div>
                  <span>(555) 123-4567</span>
                </div>
              )}
              {emailContact && (
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-3">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <span>{emailContact.value}</span>
                </div>
              )}
              {!emailContact && (
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-3">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <span>info@callunabar.com</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-playfair font-semibold mb-4">Hours</h4>
            <div className="space-y-2 text-calluna-sand text-sm">
              {displayHours.length > 0 ? (
                displayHours.map((hour, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{hour.label}</span>
                    <span>{hour.time}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>Monday - Thursday</span>
                    <span>5:00 PM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Friday - Saturday</span>
                    <span>5:00 PM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>4:00 PM - 9:00 PM</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <hr className="border-calluna-sand my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-calluna-sand">&copy; 2024 Calluna Bar & Grill. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6 text-calluna-sand">
            <Link href="/privacy-policy" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors duration-200">
              Terms of Service
            </Link>
            <Link href="/accessibility" className="hover:text-white transition-colors duration-200">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
