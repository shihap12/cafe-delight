export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Spanish Iced Latte",
    description: "Sweet and creamy espresso-based drink with condensed milk.",
    price: 5.5,
    category: "Drinks",
    image: "/images/spanish-latte.jpg",
  },
  {
    id: 2,
    name: "Turkish Coffee",
    description: "Rich and unfiltered coffee brewed in a traditional pot.",
    price: 4.0,
    category: "Drinks",
    image: "/images/turkish-coffee.jpg",
  },
  {
    id: 3,
    name: "Caramel Macchiato",
    description:
      "Espresso with steamed milk and vanilla syrup, topped with caramel.",
    price: 6.0,
    category: "Drinks",
    image: "/images/caramel-macchiato.webp",
  },
  {
    id: 4,
    name: "Hot Chocolate",
    description: "Rich cocoa with steamed milk and whipped cream.",
    price: 4.5,
    category: "Drinks",
    image: "/images/hot-chocolate.jpg",
  },
  {
    id: 5,
    name: "Iced Matcha Latte",
    description: "Premium matcha green tea with milk and ice.",
    price: 5.75,
    category: "Drinks",
    image: "/images/matcha-latte.jpg",
  },
  {
    id: 6,
    name: "Classic Brownie",
    description: "Fudgy chocolate brownie with a crackly top.",
    price: 3.5,
    category: "Desserts",
    image: "/images/brownie.jpg",
  },
  {
    id: 7,
    name: "Basque Cheesecake",
    description: "Creamy cheesecake with a caramelized burnt top.",
    price: 7.0,
    category: "Desserts",
    image: "/images/basque-cheesecake.jpg",
  },
  {
    id: 8,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center.",
    price: 6.5,
    category: "Desserts",
    image: "/images/lava-cake.webp",
  },
  {
    id: 9,
    name: "Honey Cake (Medovik)",
    description: "Layered sponge cake with honey and cream filling.",
    price: 7.5,
    category: "Desserts",
    image: "/images/honey-cake.jpg",
  },
  {
    id: 10,
    name: "Lotus Biscoff Cheesecake",
    description: "Creamy cheesecake with a Lotus Biscoff crust and topping.",
    price: 7.25,
    category: "Desserts",
    image: "/images/lotus-cheesecake.webp",
  },
  {
    id: 11,
    name: "NYC Cheesecake",
    description: "Classic New York style cheesecake, rich and dense.",
    price: 6.75,
    category: "Desserts",
    image: "/images/nyc-cheesecake.webp",
  },
  {
    id: 12,
    name: "Tiramisu Slice",
    description: "Coffee-soaked ladyfingers with mascarpone cream.",
    price: 6.25,
    category: "Desserts",
    image: "/images/tiramisu.webp",
  },
  {
    id: 13,
    name: "Caffè Latte",
    description: "Creamy steamed milk with rich espresso and latte art.",
    price: 5.0,
    category: "Drinks",
    image: "/images/caffe-latte.jpg",
  },
  {
    id: 14,
    name: "Barista's Special",
    description: "House special brewed by our expert baristas.",
    price: 4.25,
    category: "Drinks",
    image: "/images/barista.webp",
  },
  {
    id: 15,
    name: "House Coffee Beans (250g)",
    description: "Freshly roasted beans to brew at home.",
    price: 8.0,
    category: "Drinks",
    image: "/images/beans.webp",
  },
  {
    id: 16,
    name: "Signature Espresso",
    description: "Concentrated espresso shot with a silky crema.",
    price: 3.0,
    category: "Drinks",
    image: "/images/signature-espresso.jpg",
  },
  {
    id: 17,
    name: "Hario Pour Over",
    description: "Single pour-over brew using our Hario dripper for clarity.",
    price: 4.75,
    category: "Drinks",
    image: "/images/hario.avif",
  },
  {
    id: 18,
    name: "Chocolate \u00c9clair",
    description:
      "Delicate choux pastry filled with cream and topped with rich chocolate.",
    price: 5.5,
    category: "Desserts",
    image: "/images/chocolate-eclair.jpg",
  },
];
