import { Minus, Plus, Star } from "lucide-react";
import { useState } from "react";
import type { FoodItem } from "../types";

interface FoodCardProps {
  item: FoodItem;
  onAddToCart: (item: FoodItem) => void;
  onRemoveFromCart: (item: FoodItem) => void;
  cartQuantity: number;
}

export function FoodCard({
  item,
  onAddToCart,
  onRemoveFromCart,
  cartQuantity,
}: FoodCardProps) {
  const [bouncing, setBouncing] = useState(false);
  const displayPrice = item.originalPrice + 10;

  const handleAdd = () => {
    onAddToCart(item);
    setBouncing(true);
    setTimeout(() => setBouncing(false), 400);
  };

  const handleMinus = () => {
    onRemoveFromCart(item);
  };

  return (
    <div
      className="bg-card rounded-2xl overflow-hidden border border-border shadow-card card-hover"
      data-ocid="menu.card"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        {/* Veg/Non-veg indicator */}
        <div className="absolute top-2 left-2">
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center bg-white ${
              item.isVeg ? "border-veg" : "border-nonveg"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                item.isVeg ? "bg-veg" : "bg-nonveg"
              }`}
            />
          </div>
        </div>
        {/* Category badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
            {item.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-sm text-foreground leading-tight">
            {item.name}
          </h3>
          <div className="flex items-center gap-0.5 shrink-0">
            <Star className="w-3 h-3 fill-star text-star" />
            <span className="text-xs font-medium text-foreground">
              {item.rating}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-foreground">
              ₹{displayPrice}
            </span>
            <span className="text-xs text-muted-foreground line-through ml-1">
              ₹{item.originalPrice}
            </span>
          </div>

          {cartQuantity === 0 ? (
            <button
              type="button"
              onClick={handleAdd}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 gradient-orange text-white hover:opacity-90 ${
                bouncing ? "animate-bounce-once" : ""
              }`}
              data-ocid="menu.add_to_cart_button"
            >
              <Plus className="w-3 h-3" /> ADD
            </button>
          ) : (
            <div
              className="flex items-center gap-2"
              data-ocid="menu.quantity_control"
            >
              <button
                type="button"
                onClick={handleMinus}
                className="w-7 h-7 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive flex items-center justify-center transition-colors"
                data-ocid="menu.quantity_minus_button"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-sm font-bold text-foreground min-w-[16px] text-center">
                {cartQuantity}
              </span>
              <button
                type="button"
                onClick={handleAdd}
                className="w-7 h-7 rounded-full gradient-orange text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                data-ocid="menu.quantity_plus_button"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
