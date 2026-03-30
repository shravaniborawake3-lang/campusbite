import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Banknote, Loader2, QrCode, Smartphone } from "lucide-react";
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import type { CartItem, Page, User } from "../types";

type PaymentMethod = "upi" | "qr" | "cash";

interface PaymentPageProps {
  cartItems: CartItem[];
  user: User | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  onPaymentSuccess: (method: PaymentMethod) => void;
}

export function PaymentPage({
  cartItems,
  user,
  onNavigate,
  onLogout,
  onPaymentSuccess,
}: PaymentPageProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, ci) => sum + (ci.food.originalPrice + 10) * ci.quantity,
    0,
  );
  const total = subtotal + 5;

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onPaymentSuccess(selectedMethod);
    }, 2000);
  };

  const methods = [
    {
      id: "upi" as PaymentMethod,
      icon: Smartphone,
      label: "UPI Payment",
      desc: "Pay using UPI ID",
    },
    {
      id: "qr" as PaymentMethod,
      icon: QrCode,
      label: "Scan QR Code",
      desc: "Scan & pay with any UPI app",
    },
    {
      id: "cash" as PaymentMethod,
      icon: Banknote,
      label: "Cash on Pickup",
      desc: "Pay at the counter",
    },
  ];

  return (
    <div className="min-h-screen bg-background-alt">
      <Navbar
        cartItems={cartItems}
        user={user}
        onNavigate={onNavigate}
        currentPage="payment"
        onLogout={onLogout}
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <button
          type="button"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          onClick={() => onNavigate("cart")}
          data-ocid="payment.back_button"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-6">Payment</h1>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Left: Payment Methods */}
          <div className="md:col-span-3 space-y-4">
            <h2 className="font-semibold text-foreground text-sm uppercase tracking-wide">
              Choose Payment Method
            </h2>

            {methods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;
              return (
                <button
                  type="button"
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-accent"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                  data-ocid={`payment.${method.id}_option`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? "gradient-orange" : "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${isSelected ? "text-white" : "text-muted-foreground"}`}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {method.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {method.desc}
                      </p>
                    </div>
                    <div
                      className={`ml-auto w-4 h-4 rounded-full border-2 ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-border"
                      }`}
                    />
                  </div>

                  {/* UPI input */}
                  {isSelected && method.id === "upi" && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <Label
                        htmlFor="upi-id"
                        className="text-xs text-muted-foreground mb-1 block"
                      >
                        Enter UPI ID
                      </Label>
                      <Input
                        id="upi-id"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="rounded-xl h-10 text-sm"
                        data-ocid="payment.upi_input"
                      />
                    </div>
                  )}

                  {/* QR Code */}
                  {isSelected && method.id === "qr" && (
                    <div className="mt-3 pt-3 border-t border-border/50 flex flex-col items-center">
                      <img
                        src="/assets/generated/qr-code.dim_300x300.png"
                        alt="QR Code"
                        className="w-40 h-40 rounded-xl border border-border object-cover"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Scan using any UPI app (PhonePe, GPay, Paytm)
                      </p>
                    </div>
                  )}

                  {/* Cash on pickup */}
                  {isSelected && method.id === "cash" && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-sm text-muted-foreground">
                        💵 Pay ₹{total} at the counter when you pick up your
                        order.
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Summary */}
          <div className="md:col-span-2">
            <div className="bg-card rounded-2xl border border-border shadow-card p-5 sticky top-24">
              <h2 className="font-bold text-foreground mb-4">Order Summary</h2>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {cartItems.map((ci) => (
                  <div
                    key={ci.food.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-muted-foreground truncate mr-2">
                      {ci.food.name} × {ci.quantity}
                    </span>
                    <span className="font-medium shrink-0">
                      ₹{(ci.food.originalPrice + 10) * ci.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Platform fee</span>
                <span>₹5</span>
              </div>
              <div className="flex justify-between font-bold text-foreground text-lg mb-5">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                type="button"
                onClick={handlePay}
                disabled={loading}
                className="btn-orange w-full flex items-center justify-center gap-2 disabled:opacity-70"
                data-ocid="payment.pay_now_button"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : (
                  `Pay ₹${total}`
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
