import { Separator } from "@/components/ui/separator";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Navbar } from "../components/Navbar";
import type { CartItem, Page, User } from "../types";

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQty: (foodId: string, delta: number) => void;
  onRemove: (foodId: string) => void;
  user: User | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function CartPage({
  cartItems,
  onUpdateQty,
  onRemove,
  user,
  onNavigate,
  onLogout,
}: CartPageProps) {
  const subtotal = cartItems.reduce(
    (sum, ci) => sum + (ci.food.originalPrice + 10) * ci.quantity,
    0,
  );
  const platformFee = 5;
  const total = subtotal + platformFee;

  return (
    <div className="min-h-screen bg-background-alt">
      <Navbar
        cartItems={cartItems}
        user={user}
        onNavigate={onNavigate}
        currentPage="cart"
        onLogout={onLogout}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20" data-ocid="cart.empty_state">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-6">
              Add some delicious food to get started!
            </p>
            <button
              type="button"
              onClick={() => onNavigate("menu")}
              className="btn-orange"
              data-ocid="cart.browse_menu_button"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="flex-1 space-y-3" data-ocid="cart.list">
              {cartItems.map((ci, index) => (
                <div
                  key={ci.food.id}
                  className="bg-card rounded-2xl border border-border shadow-card p-4 flex gap-4 items-center"
                  data-ocid={`cart.item.${index + 1}`}
                >
                  <img
                    src={ci.food.image}
                    alt={ci.food.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground truncate">
                      {ci.food.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {ci.food.category}
                    </p>
                    <p className="text-sm font-bold text-foreground mt-1">
                      ₹{(ci.food.originalPrice + 10) * ci.quantity}
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onUpdateQty(ci.food.id, -1)}
                      className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      data-ocid={`cart.qty_minus.${index + 1}`}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {ci.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(ci.food.id, 1)}
                      className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      data-ocid={`cart.qty_plus.${index + 1}`}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(ci.food.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors ml-1"
                      data-ocid={`cart.delete_button.${index + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:w-80 shrink-0">
              <div
                className="bg-card rounded-2xl border border-border shadow-card p-5 sticky top-24"
                data-ocid="cart.summary_panel"
              >
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                  <h2 className="font-bold text-foreground">Order Summary</h2>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>
                      Subtotal ({cartItems.length} item
                      {cartItems.length > 1 ? "s" : ""})
                    </span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Platform fee</span>
                    <span>₹{platformFee}</span>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="flex justify-between font-bold text-foreground text-base mb-4">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate("payment")}
                  className="btn-orange w-full flex items-center justify-center gap-2"
                  data-ocid="cart.proceed_to_payment_button"
                >
                  Proceed to Payment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
