import { Badge } from "@/components/ui/badge";
import { Flame, LogOut, ShoppingCart, User } from "lucide-react";
import type { CartItem, Page, User as UserType } from "../types";

interface NavbarProps {
  cartItems: CartItem[];
  user: UserType | null;
  onNavigate: (page: Page) => void;
  currentPage: Page;
  onLogout: () => void;
}

export function Navbar({
  cartItems,
  user,
  onNavigate,
  currentPage,
  onLogout,
}: NavbarProps) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { label: "Explore", page: "menu" as Page },
    { label: "Today's Specials", page: "menu" as Page },
    { label: "My Orders", page: "menu" as Page },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-2 shrink-0"
          onClick={() => onNavigate("menu")}
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-lg font-bold leading-tight">
              <span className="text-foreground">Campus</span>
              <span className="text-gradient-orange">Bite</span>
            </span>
            <span className="text-[9px] text-muted-foreground leading-tight hidden sm:block">
              Saraswati College of Engineering, Kharghar, Navi Mumbai
            </span>
          </div>
        </button>

        {/* Nav links - desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.label}
              onClick={() => onNavigate(link.page)}
              className={`text-sm font-medium transition-colors ${
                currentPage === link.page
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="nav.link"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <button
            type="button"
            className="relative p-2 rounded-xl hover:bg-accent transition-colors"
            onClick={() => onNavigate("cart")}
            data-ocid="nav.cart_button"
          >
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-[10px] gradient-orange border-0 text-white">
                {totalItems}
              </Badge>
            )}
          </button>

          {/* User */}
          {user && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-orange flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-foreground hidden lg:block">
                {user.name.split(" ")[0]}
              </span>
            </div>
          )}

          {/* Logout */}
          <button
            type="button"
            onClick={onLogout}
            className="p-2 rounded-xl hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
            title="Logout"
            data-ocid="nav.logout_button"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
