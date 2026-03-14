export type Theme = "classic" | "midnight" | "sunset";

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

export type CartItem = MenuItem & { quantity: number };

export type ApiResponse<T> = {
  data?: T;
  success?: boolean;
  error?: string;
  pages?: number;
  page?: number;
};

export type Settings = Record<string, any>;

export type Product = MenuItem;

export type User = { username?: string; [k: string]: any };
