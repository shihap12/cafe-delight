# ☕ Cafe Delight

A full-stack online café ordering app built with **React** (frontend) and **PHP + MySQL** (backend). Customers can browse the menu, add items to a cart, apply coupons, and place orders — all with smooth GSAP animations and multiple theme options.

---

## 📸 Features

- **Interactive Menu** — filterable by category (Drinks / Desserts) with 3D tilt card effects
- **Shopping Cart** — slide-in drawer with quantity controls, coupon codes, and order confirmation
- **3 Themes** — Classic, Midnight, and Sunset (persisted in localStorage)
- **Smooth Animations** — hero video scroll-scrubbing, section reveals, and cart transitions via GSAP
- **Order System** — checkout form submits orders to a PHP/MySQL backend
- **Fallback Mode** — if the backend is unavailable, the menu loads from local sample data and orders are confirmed locally
- **Responsive** — mobile nav, adaptive grid layout

---

## 🗂️ Project Structure

```
cafe/                          ← Frontend (Vite + React)
├── public/images/             ← Static images & video
├── src/
│   ├── main.jsx               ← React entry point
│   ├── App.jsx                ← Root component (state, animations, layout)
│   ├── index.css              ← Tailwind + theme CSS variables
│   ├── config/
│   │   └── api.js             ← API URL builder
│   ├── data/
│   │   └── menuItems.js       ← Fallback menu data
│   └── components/
│       ├── Navbar.jsx          ← Top navigation bar + mobile menu + theme toggle
│       ├── Hero.jsx            ← Hero section with video background
│       ├── About.jsx           ← About section
│       ├── Menu.jsx            ← Menu section (fetch, filter, grid)
│       ├── MenuCard.jsx        ← Individual menu item card (tilt effect)
│       ├── Cart.jsx            ← Cart drawer (logic + layout)
│       ├── CartItem.jsx        ← Single cart item row
│       ├── OrderSummary.jsx    ← Totals, coupon, customer form, confirm button
│       └── Footer.jsx          ← Footer with social links
├── package.json
├── vite.config.js             ← Vite config with API proxy to XAMPP
└── postcss.config.cjs

server/                        ← Backend (PHP + MySQL, hosted via XAMPP)
├── config.php                 ← DB connection settings
├── db.php                     ← PDO connection helper
├── schema.sql                 ← Database schema + sample data
├── setup.php                  ← One-time DB setup script
└── api/
    ├── menu.php               ← GET  /api/menu  → returns all menu items
    └── order.php              ← POST /api/order → creates an order
```

---

## ⚙️ Tech Stack

| Layer      | Technology                           |
| ---------- | ------------------------------------ |
| Frontend   | React 19, Vite 7, Tailwind CSS 4     |
| Animation  | GSAP (ScrollTrigger, ScrollToPlugin) |
| Icons      | react-icons (Font Awesome)           |
| Backend    | PHP 8+ (PDO)                         |
| Database   | MySQL (InnoDB, utf8mb4)              |
| Dev Server | XAMPP (Apache + MySQL)               |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **XAMPP** (or any Apache + MySQL + PHP setup)

### 1. Frontend Setup

```bash
cd cafe
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`. API calls are proxied to `http://localhost/cafe/server/api/` via Vite config.

### 2. Backend Setup

1. Copy (or symlink) the `server/` folder into your XAMPP htdocs:
   ```
   C:\xampp\htdocs\cafe\server\
   ```
2. Start **Apache** and **MySQL** from the XAMPP Control Panel.

3. Run the setup script to create the database and seed data:

   ```
   http://localhost/cafe/server/setup.php
   ```

   This creates the `cafe` database with `menu_items`, `orders`, and `order_items` tables, and inserts sample menu items.

4. Verify the API works:
   ```
   http://localhost/cafe/server/api/menu.php
   ```

### 3. Build for Production

```bash
npm run build
npm run preview
```

Output goes to `dist/`.

---

## 🔌 API Endpoints

### `GET /api/menu`

Returns all menu items.

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Spanish Iced Latte",
      "description": "Sweet and creamy espresso-based drink...",
      "price": "5.50",
      "category": "Drinks",
      "image": "/images/spanish-latte.jpg"
    }
  ]
}
```

### `POST /api/order`

Creates a new order.

**Request body:**

```json
{
  "customer": {
    "name": "Ahmad",
    "phone": "+962791234567",
    "notes": "Extra sugar please"
  },
  "items": [
    { "id": 1, "name": "Spanish Iced Latte", "price": 5.5, "quantity": 2 }
  ],
  "coupon": "WELCOME10",
  "subtotal": 11.0,
  "discount": 1.1,
  "tax": 0.99,
  "total": 10.89
}
```

**Response:**

```json
{
  "success": true,
  "orderId": 42
}
```

---

## 🗃️ Database Schema

Three tables in the `cafe` database:

- **`menu_items`** — id, name, description, price, category, image
- **`orders`** — id, customer_name, customer_phone, notes, total_amount, created_at
- **`order_items`** — id, order_id (FK), menu_item_id (FK), quantity, unit_price

Run `server/schema.sql` or visit `setup.php` to initialize.

---

## 🎨 Themes

Switch themes from the navbar button. Themes are saved in `localStorage`.

| Theme    | Style                        |
| -------- | ---------------------------- |
| Classic  | Warm browns & amber tones    |
| Midnight | Deep navy & cool blues       |
| Sunset   | Warm rose & golden gradients |

---

## 🎟️ Coupon Codes

| Code      | Discount    |
| --------- | ----------- |
| WELCOME10 | 10% off     |
| SWEET5    | $5 flat off |
| CAFE15    | 15% off     |

---

## 📜 Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start Vite dev server    |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build |

- Database schema: `server/schema.sql`
- Vite proxy configured to forward `/api/*` to the PHP server
- Cart enhancements:
  - Persist cart items with `localStorage`
  - Quantity controls (`+` / `-`) in cart
  - Checkout form (name, phone, notes)
- Resilient UX:
  - If backend menu is unavailable, app falls back to local sample data
  - If order API is unavailable, order is still confirmed locally in UI

---

## 🛠️ Setup (PHP + MySQL)

### 1) Create the database and seed data

1. Start MySQL server (e.g., via XAMPP, WAMP, or your system MySQL).

2. **Option A (recommended): run the setup script via PHP**

- Run the PHP server (see next section) and open:

  ```
  http://localhost:8000/setup.php
  ```

  This will execute `server/schema.sql` and create the `cafe` database + tables + sample menu data.

3. **Option B (CLI): run the schema script manually**

```bash
mysql -u root -p < server/schema.sql
```

> Adjust the `-u` / `-p` options if you use a different user.

### 2) Configure database credentials

Edit `server/config.php` and adjust the values for:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`

Or set environment variables (recommended):

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`

### 3) Run the PHP backend server

From the project root:

```bash
php -S localhost:8000 -t server
```

### 4) Run the frontend (Vite)

In another terminal:

```bash
npm install
npm run dev
```

Then open: **http://localhost:5173/**

> Vite is configured to proxy `/api/*` to `http://localhost/cafe/server/api/*` (XAMPP layout).

If your backend is on a different base URL, create `.env` in the project root and set:

```bash
VITE_API_BASE=http://localhost:8000/api
```

---

## 🔎 How it works

- The React app fetches menu items from `/api/menu`.
- Orders are submitted from the cart checkout form to `/api/order`.
- Cart data is saved in browser storage so refreshes do not clear the current order.

---

## ✅ Next steps

If you want, I can add:

- Authentication (simple admin panel)
- More API endpoints (admin CRUD for menu items)
- Order history / receipt page and admin order dashboard
