import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FoodItem {
    id: bigint;
    name: string;
    description: string;
    available: boolean;
    imageUrl: string;
    category: string;
    isVeg: boolean;
    price: number;
}
export interface CartItem {
    quantity: bigint;
    foodId: bigint;
}
export interface Order {
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    userId: Principal;
    orderId: bigint;
    totalAmount: number;
    timestamp: bigint;
    items: Array<CartItem>;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum OrderStatus {
    preparing = "preparing",
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed",
    ready = "ready"
}
export enum PaymentMethod {
    upi = "upi",
    card = "card",
    cash = "cash",
    netBanking = "netBanking"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFoodItem(food: FoodItem): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllFoodItems(): Promise<Array<FoodItem>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrder(orderId: bigint): Promise<Order>;
    getUserOrders(userId: Principal): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(items: Array<CartItem>, totalAmount: number, paymentMethod: PaymentMethod): Promise<bigint>;
    removeFoodItem(foodId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateFoodItem(foodId: bigint, updatedFood: FoodItem): Promise<void>;
    updateOrderStatus(orderId: bigint, newStatus: OrderStatus): Promise<void>;
}
