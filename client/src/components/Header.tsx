import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { Link } from "wouter";

export default function Header() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'menu', label: 'Menu' },
    { id: 'booking', label: 'Reservations' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <h1 className="text-3xl font-playfair font-bold text-calluna-brown">Calluna</h1>
            <span className="text-lg font-lato text-calluna-orange ml-2">Bar & Grill</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-calluna-charcoal hover:text-calluna-brown transition-colors duration-200 font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-calluna-charcoal">Welcome, {user?.firstName}</span>
                {user?.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">Admin</Button>
                  </Link>
                )}
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/api/auth?action=logout"}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Link href="/auth">
                  <Button 
                    variant="ghost"
                    className="text-calluna-brown hover:text-calluna-orange transition-colors duration-200 font-medium"
                  >
                    Sign In
                  </Button>
                </Link>
                <Button 
                  onClick={() => scrollToSection('booking')}
                  className="bg-calluna-brown text-white px-6 py-2 rounded-lg hover:bg-calluna-orange transition-colors duration-200 font-medium"
                >
                  Book Now
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-6 w-6 text-calluna-brown" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-6 mt-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-playfair font-bold text-calluna-brown">Calluna</h2>
                    <span className="text-calluna-orange">Bar & Grill</span>
                  </div>
                </div>

                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="text-left text-calluna-charcoal hover:text-calluna-brown transition-colors duration-200 font-medium text-lg"
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                <div className="flex flex-col space-y-4 pt-6 border-t border-calluna-sand">
                  {isAuthenticated ? (
                    <>
                      <div className="text-calluna-charcoal">Welcome, {user?.firstName}</div>
                      {user?.role === 'admin' && (
                        <Link href="/admin">
                          <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                            Admin Panel
                          </Button>
                        </Link>
                      )}
                      <Button 
                        variant="outline"
                        onClick={() => {
                          window.location.href = "/api/auth?action=logout";
                          setIsOpen(false);
                        }}
                        className="w-full"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth">
                        <Button 
                          variant="outline"
                          onClick={() => setIsOpen(false)}
                          className="w-full"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Button 
                        onClick={() => {
                          scrollToSection('booking');
                          setIsOpen(false);
                        }}
                        className="w-full bg-calluna-brown hover:bg-calluna-orange"
                      >
                        Book Now
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
