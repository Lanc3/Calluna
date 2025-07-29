import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Menu from "@/components/Menu";
import BookingSystem from "@/components/BookingSystem";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-calluna-cream">
      <Header />
      {user?.role === 'admin' && (
        <div className="bg-calluna-brown text-white py-3 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center gap-4">
            <span>Welcome back, {user.firstName}! You have admin access.</span>
            <Link href="/admin">
              <Button variant="secondary" size="sm">
                Go to Admin Panel
              </Button>
            </Link>
          </div>
        </div>
      )}
      <Hero />
      <Gallery />
      <Menu />
      <BookingSystem />
      <Footer />
    </div>
  );
}
