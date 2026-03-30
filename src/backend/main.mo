import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Float "mo:core/Float";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  module OrderModule {
    public func compare(order1 : Order, order2 : Order) : Order.Order {
      Nat.compare(order1.orderId, order2.orderId);
    };
  };

  module FoodItem {
    public func compare(foodItem1 : FoodItem, foodItem2 : FoodItem) : Order.Order {
      Nat.compare(foodItem1.id, foodItem2.id);
    };
  };

  module CartItem {
    public func compare(cartItem1 : CartItem, cartItem2 : CartItem) : Order.Order {
      Nat.compare(cartItem1.foodId, cartItem2.foodId);
    };
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  type FoodItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    category : Text;
    imageUrl : Text;
    isVeg : Bool;
    available : Bool;
  };

  type CartItem = {
    foodId : Nat;
    quantity : Nat;
  };

  type OrderStatus = {
    #pending;
    #confirmed;
    #preparing;
    #ready;
    #completed;
    #cancelled;
  };

  type PaymentMethod = {
    #cash;
    #card;
    #upi;
    #netBanking;
  };

  type Order = {
    orderId : Nat;
    userId : Principal;
    items : [CartItem];
    totalAmount : Float;
    paymentMethod : PaymentMethod;
    status : OrderStatus;
    timestamp : Int;
  };

  // Initialize the access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Persistent State
  let foodItems = Map.empty<Nat, FoodItem>();
  let orders = Map.empty<Nat, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextFoodId = 0;
  var nextOrderId = 0;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not Principal.equal(caller, user) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or admin can view any profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Menu Management (Admins only)
  public shared ({ caller }) func addFoodItem(food : FoodItem) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add food items");
    };
    let foodId = nextFoodId;
    nextFoodId += 1;

    let newItem : FoodItem = {
      food with
      id = foodId;
    };

    foodItems.add(foodId, newItem);
    foodId;
  };

  public shared ({ caller }) func updateFoodItem(foodId : Nat, updatedFood : FoodItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update food items");
    };
    if (foodItems.containsKey(foodId)) { 
      foodItems.add(foodId, updatedFood);
    } else {
      Runtime.trap("Food item not found");
    };
  };

  public shared ({ caller }) func removeFoodItem(foodId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove food items");
    };
    if (not foodItems.containsKey(foodId)) { 
      Runtime.trap("Food item not found");
    };
    foodItems.remove(foodId);
  };

  // Order Management
  public shared ({ caller }) func placeOrder(items : [CartItem], totalAmount : Float, paymentMethod : PaymentMethod) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    let orderId = nextOrderId;
    nextOrderId += 1;

    let newOrder : Order = {
      orderId;
      userId = caller;
      items;
      totalAmount;
      paymentMethod;
      status = #pending;
      timestamp = Time.now();
    };

    orders.add(orderId, newOrder);
    orderId;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, newStatus : OrderStatus) : async () {
    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };
    
    let callerIsAdmin = AccessControl.isAdmin(accessControlState, caller);
    let callerOwnsOrder = Principal.equal(caller, order.userId);
    
    if (not (callerOwnsOrder or callerIsAdmin)) {
      Runtime.trap("Unauthorized: Only order owner or admin can update order status");
    };
    
    switch (order.status) {
      case (#completed) { Runtime.trap("Order is already completed. Cannot update status.") };
      case (#cancelled) { Runtime.trap("Order is already cancelled. Cannot update status.") };
      case (_) {
        let updatedOrder : Order = {
          order with
          status = newStatus;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async Order {
    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };
    
    let callerIsAdmin = AccessControl.isAdmin(accessControlState, caller);
    let callerOwnsOrder = Principal.equal(caller, order.userId);
    
    if (not (callerOwnsOrder or callerIsAdmin)) {
      Runtime.trap("Unauthorized: Can only view your own orders or admin can view any order");
    };
    order;
  };

  // Queries (Anyone can view menu, users/admins can view orders)
  public query ({ caller }) func getAllFoodItems() : async [FoodItem] {
    // No authorization needed - anyone including guests can view the menu
    foodItems.values().toArray().sort();
  };

  public query ({ caller }) func getUserOrders(userId : Principal) : async [Order] {
    if (not Principal.equal(caller, userId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders or admin can view any user's orders");
    };
    orders.values().toArray().filter(func(order) { Principal.equal(order.userId, userId) }).sort();
  };
};
