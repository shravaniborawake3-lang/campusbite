export type Page = "login" | "menu" | "cart" | "payment" | "confirmation";

export interface FoodItem {
  id: string;
  name: string;
  category: "Breakfast" | "Lunch" | "Snacks" | "Drinks";
  originalPrice: number;
  isVeg: boolean;
  rating: number;
  description: string;
  image: string;
}

export interface CartItem {
  food: FoodItem;
  quantity: number;
}

export interface User {
  name: string;
  email: string;
}
