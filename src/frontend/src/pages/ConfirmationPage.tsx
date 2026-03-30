import { CheckCircle, Clock, MapPin } from "lucide-react";
import { useMemo } from "react";
import type { CartItem } from "../types";

type PaymentMethod = "upi" | "qr" | "cash";

interface ConfirmationPageProps {
  cartItems: CartItem[];
  paymentMethod: PaymentMethod;
  onNavigate: (page: "menu") => void;
}

const CONFETTI_COLORS = [
  "oklch(0.65 0.20 45)",
  "oklch(0.78 0.17 72)",
  "oklch(0.73 0.20 145)",
];

export function ConfirmationPage({
  cartItems,
  paymentMethod,
  onNavigate,
}: ConfirmationPageProps) {
  const orderId = useMemo(() => {
    const digits = Math.floor(100000 + Math.random() * 900000);
    return `CB${digits}`;
  }, []);

  const subtotal = cartItems.reduce(
    (sum, ci) => sum + (ci.food.originalPrice + 10) * ci.quantity,
    0,
  );
  const total = subtotal + 5;

  const methodLabel: Record<PaymentMethod, string> = {
    upi: "UPI Payment",
    qr: "QR Code Scan",
    cash: "Cash on Pickup",
  };

  const confettiItems = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="min-h-screen bg-background-alt flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {confettiItems.map((i) => (
        <div
          key={`confetti-${i}`}
          className="absolute w-3 h-3 rounded-full pointer-events-none"
          style={{
            left: `${(i * 8.3) % 100}%`,
            top: "-20px",
            background: CONFETTI_COLORS[i % 3],
            animation: `confetti-fall ${1.5 + (i % 5) * 0.4}s ease-in ${i * 0.15}s forwards`,
          }}
        />
      ))}

      <div className="w-full max-w-md text-center page-enter">
        <div className="flex justify-center mb-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center animate-circle-scale"
            style={{ background: "oklch(0.73 0.20 145)" }}
          >
            <svg
              viewBox="0 0 52 52"
              className="w-12 h-12"
              aria-label="Order confirmed checkmark"
            >
              <title>Order confirmed</title>
              <polyline
                points="14,26 22,34 38,18"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-checkmark"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          Order Placed Successfully! 🎉
        </h1>
        <p className="text-muted-foreground mb-6">
          Your food is being prepared. Get ready to pick it up!
        </p>

        <div className="bg-card rounded-2xl border border-border shadow-card p-5 mb-4 text-left">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Order ID</p>
              <p className="text-lg font-bold text-primary">{orderId}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-veg" />
          </div>

          <div className="space-y-2 mb-4">
            {cartItems.map((ci) => (
              <div key={ci.food.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {ci.food.name} x {ci.quantity}
                </span>
                <span className="font-medium">
                  ₹{(ci.food.originalPrice + 10) * ci.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm text-muted-foreground border-t border-border pt-3 mb-1">
            <span>Platform fee</span>
            <span>₹5</span>
          </div>
          <div className="flex justify-between font-bold text-foreground">
            <span>Total Paid</span>
            <span>₹{total}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Payment: {methodLabel[paymentMethod]}
          </p>
        </div>

        <div className="bg-accent rounded-2xl p-4 mb-6 text-left space-y-3">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">
                Estimated Pickup Time
              </p>
              <p className="text-sm font-semibold text-foreground">
                15-20 minutes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Pickup Location</p>
              <p className="text-sm font-semibold text-foreground">
                Main Canteen, Ground Floor
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("menu")}
          className="btn-orange w-full"
          data-ocid="confirmation.back_to_menu_button"
        >
          Back to Menu
        </button>

        <p className="text-xs text-muted-foreground mt-4">
          &copy; {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
