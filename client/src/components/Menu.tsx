import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { MenuCategory, MenuItem } from "@shared/schema";

// Default menu data for when no database data is available
const defaultCategories = [
  { id: '1', name: 'Appetizers', displayOrder: 1 },
  { id: '2', name: 'Main Courses', displayOrder: 2 },
  { id: '3', name: 'Desserts', displayOrder: 3 },
  { id: '4', name: 'Beverages', displayOrder: 4 },
];

const defaultMenuItems = [
  // Appetizers
  { id: '1', categoryId: '1', name: 'Pan-Seared Scallops', description: 'Fresh Atlantic scallops with cauliflower purée and crispy pancetta', price: '18.00', displayOrder: 1 },
  { id: '2', categoryId: '1', name: 'Truffle Arancini', description: 'Crispy risotto balls with black truffle and parmesan cream', price: '14.00', displayOrder: 2 },
  { id: '3', categoryId: '1', name: 'Beef Carpaccio', description: 'Thinly sliced tenderloin with arugula, capers, and aged parmesan', price: '16.00', displayOrder: 3 },
  { id: '4', categoryId: '1', name: 'Oysters Rockefeller', description: 'Fresh oysters baked with spinach, herbs, and hollandaise', price: '22.00', displayOrder: 4 },
  
  // Main Courses
  { id: '5', categoryId: '2', name: 'Wagyu Ribeye', description: '12oz prime cut with roasted vegetables and red wine jus', price: '65.00', displayOrder: 1 },
  { id: '6', categoryId: '2', name: 'Chilean Sea Bass', description: 'Miso-glazed with jasmine rice and seasonal vegetables', price: '42.00', displayOrder: 2 },
  { id: '7', categoryId: '2', name: 'Duck Confit', description: 'Slow-cooked duck leg with cherry gastrique and potato gratin', price: '38.00', displayOrder: 3 },
  { id: '8', categoryId: '2', name: 'Lobster Thermidor', description: 'Fresh lobster tail with cognac cream sauce and herbs', price: '48.00', displayOrder: 4 },
  
  // Desserts
  { id: '9', categoryId: '3', name: 'Chocolate Soufflé', description: 'Rich dark chocolate soufflé with vanilla bean ice cream', price: '12.00', displayOrder: 1 },
  { id: '10', categoryId: '3', name: 'Crème Brûlée', description: 'Classic vanilla custard with caramelized sugar', price: '10.00', displayOrder: 2 },
  { id: '11', categoryId: '3', name: 'Tiramisu', description: 'House-made with espresso-soaked ladyfingers and mascarpone', price: '11.00', displayOrder: 3 },
  
  // Beverages
  { id: '12', categoryId: '4', name: 'Calluna Old Fashioned', description: 'Bourbon, maple syrup, orange bitters, smoked cherry', price: '16.00', displayOrder: 1 },
  { id: '13', categoryId: '4', name: 'Craft Beer Selection', description: 'Rotating selection of local and international craft beers', price: '8.00', displayOrder: 2 },
  { id: '14', categoryId: '4', name: 'Wine Pairing', description: 'Sommelier-selected wines to complement your meal', price: '25.00', displayOrder: 3 },
];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('1');

  const { data: menuCategories } = useQuery<MenuCategory[]>({
    queryKey: ["/api/menu/categories"],
    retry: false,
  });

  const { data: menuItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu/items"],
    retry: false,
  });

  // Use database data if available, otherwise fall back to default data
  const categories = menuCategories && menuCategories.length > 0 ? menuCategories : defaultCategories;
  const items = menuItems && menuItems.length > 0 ? menuItems : defaultMenuItems;

  const getItemsForCategory = (categoryId: string) => {
    return items.filter(item => item.categoryId === categoryId);
  };

  return (
    <section id="menu" className="py-20 bg-calluna-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-calluna-brown mb-4">Our Menu</h2>
          <p className="text-xl text-calluna-charcoal max-w-2xl mx-auto">Crafted with passion, served with pride</p>
        </div>

        {/* Menu Categories */}
        <div className="flex flex-wrap justify-center mb-12 gap-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-calluna-brown text-white'
                  : 'bg-white text-calluna-brown hover:bg-calluna-brown hover:text-white'
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {getItemsForCategory(activeCategory).map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-playfair font-semibold text-calluna-brown">{item.name}</h3>
                <span className="text-calluna-orange font-bold text-lg">${item.price}</span>
              </div>
              <p className="text-calluna-charcoal leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {getItemsForCategory(activeCategory).length === 0 && (
          <div className="text-center py-12">
            <p className="text-calluna-charcoal text-lg">No items available in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
