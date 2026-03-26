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

export type ThemeColors = Record<string, string>;

export type Settings = {
  about_title?: string;
  about_text1?: string;
  about_text2?: string;
  about_image?: string;
  hero_line1?: string;
  hero_line2?: string;
  hero_line3?: string;
  hero_subtitle?: string;
  hero_image?: string;
  // theme palettes
  theme_classic?: ThemeColors;
  theme_midnight?: ThemeColors;
  theme_sunset?: ThemeColors;
  [k: string]: unknown;
};

export type Product = MenuItem;

export type User = { username?: string } & Record<string, unknown>;

export type Receipt = {
  orderId: string | number;
  createdAt: string;
  subtotal: string;
  discount: string;
  tax: string;
  total: string;
  couponCode?: string | null;
};
