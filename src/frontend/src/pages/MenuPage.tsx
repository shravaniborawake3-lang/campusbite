import { ChefHat, Clock } from "lucide-react";
import { useState } from "react";
import { FoodCard } from "../components/FoodCard";
import { Navbar } from "../components/Navbar";
import { foodItems } from "../data/foodItems";
import type { CartItem, FoodItem, Page, User } from "../types";

type Category = "All" | "Breakfast" | "Lunch" | "Snacks" | "Drinks" | "Popular";

interface MenuPageProps {
  cartItems: CartItem[];
  onAddToCart: (item: FoodItem) => void;
  onRemoveFromCart: (item: FoodItem) => void;
  user: User | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function MenuPage({
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  user,
  onNavigate,
  onLogout,
}: MenuPageProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const categories: Category[] = [
    "All",
    "Breakfast",
    "Lunch",
    "Snacks",
    "Drinks",
    "Popular",
  ];

  const filteredItems = foodItems.filter((item) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Popular") return item.rating >= 4.5;
    return item.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-background-alt">
      <Navbar
        cartItems={cartItems}
        user={user}
        onNavigate={onNavigate}
        currentPage="menu"
        onLogout={onLogout}
      />

      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="gradient-orange-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
                  <Clock className="w-3.5 h-3.5 text-white" />
                  <span className="text-white text-xs font-medium">
                    15-20 min pickup
                  </span>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                Order Fresh,
                <br />
                Pick Up Fast 🔥
              </h1>
              <p className="text-white/85 text-base md:text-lg mb-2">
                Pre-order from your campus canteen — skip the queue, eat on
                time.
              </p>
              <p className="text-white/70 text-sm mb-6 font-medium">
                🎓 Saraswati College of Engineering, Kharghar, Navi Mumbai
              </p>
              <button
                type="button"
                className="bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-all active:scale-95"
                onClick={() =>
                  document
                    .getElementById("menu-grid")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                data-ocid="menu.explore_button"
              >
                Explore Menu
              </button>
            </div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 pointer-events-none" />
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide no-scrollbar">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "gradient-orange text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                data-ocid="menu.category_tab"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Food Grid */}
      <main id="menu-grid" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-2 mb-6">
          <ChefHat className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            {activeCategory === "All" ? "All Items" : activeCategory}
          </h2>
          <span className="text-sm text-muted-foreground">
            ({filteredItems.length} items)
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16" data-ocid="menu.empty_state">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="text-muted-foreground">No items in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
                cartQuantity={
                  cartItems.find((ci) => ci.food.id === item.id)?.quantity ?? 0
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
