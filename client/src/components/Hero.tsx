import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center text-white overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: `linear-gradient(rgba(139, 69, 19, 0.4), rgba(139, 69, 19, 0.4)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')`
        }}
      />
      
      <div className="relative z-10 text-center max-w-4xl px-4">
        <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 leading-tight">
          Exceptional Dining<br />
          <span className="text-calluna-sand">Experience</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-light leading-relaxed">
          Discover culinary excellence in an atmosphere of refined elegance
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => scrollToSection('booking')}
            className="bg-calluna-brown text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-calluna-orange transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Reserve Your Table
          </Button>
          <Button 
            variant="outline"
            onClick={() => scrollToSection('menu')}
            className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-calluna-brown transition-all duration-200"
          >
            View Menu
          </Button>
        </div>
      </div>
    </section>
  );
}
