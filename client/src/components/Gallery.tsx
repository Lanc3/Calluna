import { useQuery } from "@tanstack/react-query";
import type { GalleryImage } from "@shared/schema";

// Default gallery images for when no database images are available
const defaultImages = [
  {
    id: '1',
    title: 'Restaurant Interior',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
    alt: 'Modern restaurant dining room with elegant table settings and warm ambient lighting'
  },
  {
    id: '2', 
    title: 'Gourmet Dish',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
    alt: 'Exquisite plated fine dining dish with artistic presentation'
  },
  {
    id: '3',
    title: 'Craft Cocktail',
    url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
    alt: 'Sophisticated cocktail with garnish in elegant glassware'
  },
  {
    id: '4',
    title: 'Restaurant Bar',
    url: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
    alt: 'Restaurant bar area with premium spirits and elegant lighting'
  },
  {
    id: '5',
    title: 'Seafood Dish',
    url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
    alt: 'Beautifully plated seafood dish with artistic garnish'
  },
  {
    id: '6',
    title: 'Private Dining',
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
    alt: 'Private dining area with intimate lighting and luxury furnishings'
  }
];

export default function Gallery() {
  const { data: galleryImages } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
    retry: false,
  });

  // Use database images if available, otherwise fall back to default images
  const images = galleryImages && galleryImages.length > 0 ? galleryImages : defaultImages;

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-calluna-brown mb-4">Gallery</h2>
          <p className="text-xl text-calluna-charcoal max-w-2xl mx-auto">Experience the ambiance and artistry that defines Calluna Bar & Grill</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div 
              key={image.id} 
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <img 
                src={image.url} 
                alt={image.alt} 
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="font-playfair font-semibold text-lg">{image.title || image.alt}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
