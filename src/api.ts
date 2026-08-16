import { API_BASE_URL } from "./config";
import type { FoodItem, Order, Driver } from "./types";

export async function fetchFoodItems(): Promise<FoodItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/menu/items`);
    if (!res.ok) throw new Error("Failed to fetch menu items");
    return await res.json();
  } catch (e) {
    console.error("API Error: falling back to static list", e);
    throw e;
  }
}

export async function saveFoodItem(item: Partial<FoodItem>): Promise<FoodItem> {
  const url = item.id ? `${API_BASE_URL}/api/menu/items/${item.id}` : `${API_BASE_URL}/api/menu/items`;
  const method = item.id ? "PUT" : "POST";
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Failed to save menu item");
  return await res.json();
}

export async function deleteFoodItem(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/menu/items/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete menu item");
}

export async function uploadFoodItemImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE_URL}/api/menu/items/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload image");
  const data = await res.json();
  return data.url;
}

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(`${API_BASE_URL}/api/orders`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  const data = await res.json();
  return data.map((ord: any) => ({
    id: `ORD-${ord.id}`,
    items: [ord.items],
    total: ord.totalAmount,
    status: ord.status === "PAID" ? "CONFIRMED" : ord.status === "DISPATCHED" ? "DELIVERING" : ord.status,
  }));
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  const numericId = id.replace("ORD-", "");
  const res = await fetch(`${API_BASE_URL}/api/orders/${numericId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update order status");
}

export async function fetchDrivers(): Promise<Driver[]> {
  const res = await fetch(`${API_BASE_URL}/api/delivery/drivers`);
  if (!res.ok) throw new Error("Failed to fetch drivers");
  return await res.json();
}

export async function registerDriver(driver: Partial<Driver>): Promise<Driver> {
  const res = await fetch(`${API_BASE_URL}/api/delivery/drivers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(driver),
  });
  if (!res.ok) throw new Error("Failed to register driver");
  return await res.json();
}

export async function updateDriverStatus(id: string, status: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/delivery/drivers/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update driver status");
}

export async function processPayment(orderId: string, amount: number, customerName: string): Promise<{ success: boolean, transactionId: string, message: string }> {
  const numericId = orderId.replace("ORD-", "");
  const res = await fetch(`${API_BASE_URL}/api/payments/charge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId: numericId, amount, customerName }),
  });
  if (!res.ok) throw new Error("Failed to process payment");
  return await res.json();
}

export async function fetchPaymentLogs(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/api/payments/logs`);
  if (!res.ok) throw new Error("Failed to fetch billing logs");
  return await res.json();
}

export async function createOrder(customerName: string, items: string, totalAmount: number): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerName, items, totalAmount }),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return await res.json();
}

