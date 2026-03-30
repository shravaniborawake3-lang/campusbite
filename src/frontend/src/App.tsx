import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CartPage } from "./pages/CartPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";
import { LoginPage } from "./pages/LoginPage";
import { MenuPage } from "./pages/MenuPage";
import { PaymentPage } from "./pages/PaymentPage";
import type { CartItem, FoodItem, Page, User } from "./types";

type PaymentMethod = "upi" | "qr" | "cash";

const CART_KEY = "campusbite_cart";
const USER_KEY = "campusbite_user";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  // Load persisted data on mount
  useEffect(() => {
    const savedUser = loadUser();
    const savedCart = loadCart();
    if (savedUser) {
      setUser(savedUser);
      setPage("menu");
    }
    setCartItems(savedCart);
  }, []);

  // Persist cart
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const handleLogin = (u: User) => {
    setUser(u);
    setPage("menu");
  };

  const handleLogout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setPage("login");
  };

  const handleAddToCart = (item: FoodItem) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.food.id === item.id);
      if (existing) {
        toast.success(`${item.name} quantity updated!`);
        return prev.map((ci) =>
          ci.food.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci,
        );
      }
      toast.success(`${item.name} added to cart!`);
      return [...prev, { food: item, quantity: 1 }];
    });
  };

  const handleUpdateQty = (foodId: string, delta: number) => {
    setCartItems((prev) => {
      const updated = prev.map((ci) =>
        ci.food.id === foodId ? { ...ci, quantity: ci.quantity + delta } : ci,
      );
      return updated.filter((ci) => ci.quantity > 0);
    });
  };

  const handleRemoveFromCart = (item: FoodItem) => {
    handleUpdateQty(item.id, -1);
  };

  const handleRemove = (foodId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.food.id !== foodId));
    toast.success("Item removed from cart");
  };

  const handlePaymentSuccess = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setPage("confirmation");
  };

  const handleBackToMenu = () => {
    setCartItems([]);
    setPage("menu");
  };

  const navigate = (p: Page) => setPage(p);

  return (
    <div className="page-enter">
      <Toaster position="top-right" richColors />

      {page === "login" && <LoginPage onLogin={handleLogin} />}

      {page === "menu" && (
        <MenuPage
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          user={user}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}

      {page === "cart" && (
        <CartPage
          cartItems={cartItems}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemove}
          user={user}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}

      {page === "payment" && (
        <PaymentPage
          cartItems={cartItems}
          user={user}
          onNavigate={navigate}
          onLogout={handleLogout}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {page === "confirmation" && (
        <ConfirmationPage
          cartItems={cartItems}
          paymentMethod={paymentMethod}
          onNavigate={handleBackToMenu}
        />
      )}
    </div>
  );
}
