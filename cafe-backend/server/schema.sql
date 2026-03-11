-- Schema for Cafe backend (MySQL)

CREATE DATABASE IF NOT EXISTS `cafe` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `cafe`;

-- Menu items
CREATE TABLE IF NOT EXISTS `menu_items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `price` DECIMAL(8,2) NOT NULL DEFAULT 0,
  `category` VARCHAR(80) NOT NULL,
  `image` VARCHAR(512) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `customer_name` VARCHAR(255) DEFAULT NULL,
  `customer_phone` VARCHAR(64) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Order items
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` INT UNSIGNED NOT NULL,
  `menu_item_id` INT UNSIGNED NOT NULL,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(8,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY (`order_id`),
  KEY (`menu_item_id`),
  CONSTRAINT `fk_order_items_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_menu` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Admin users
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Site settings (key-value store for customization)
CREATE TABLE IF NOT EXISTS `site_settings` (
  `setting_key` VARCHAR(100) NOT NULL,
  `setting_value` TEXT NOT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default admin (password: admin123 — change after first login)
INSERT INTO `admin_users` (`username`, `password_hash`) VALUES
('admin', '$2y$10$csBNrcq7Ufv19udvGJR5Vekc1sMdSjvK2DhJ99UyTgtlH0PjSqF6S');

-- Sample data for menu_items
INSERT INTO `menu_items` (`name`, `description`, `price`, `category`, `image`) VALUES
('Spanish Iced Latte', 'Sweet and creamy espresso-based drink with condensed milk.', 5.50, 'Drinks', '/images/spanish-latte.jpg'),
('Turkish Coffee', 'Rich and unfiltered coffee brewed in a traditional pot.', 4.00, 'Drinks', '/images/turkish-coffee.jpg'),
('Caramel Macchiato', 'Espresso with steamed milk and vanilla syrup, topped with caramel.', 6.00, 'Drinks', '/images/caramel-macchiato.webp'),
('Hot Chocolate', 'Rich cocoa with steamed milk and whipped cream.', 4.50, 'Drinks', '/images/hot-chocolate.jpg'),
('Iced Matcha Latte', 'Premium matcha green tea with milk and ice.', 5.75, 'Drinks', '/images/matcha-latte.jpg'),
('Classic Brownie', 'Fudgy chocolate brownie with a crackly top.', 3.50, 'Desserts', '/images/brownie.jpg'),
('Basque Cheesecake', 'Creamy cheesecake with a caramelized burnt top.', 7.00, 'Desserts', '/images/basque-cheesecake.jpg'),
('Chocolate Lava Cake', 'Warm chocolate cake with a molten center.', 6.50, 'Desserts', '/images/lava-cake.webp'),
('Honey Cake (Medovik)', 'Layered sponge cake with honey and cream filling.', 7.50, 'Desserts', '/images/honey-cake.jpg'),
('Lotus Biscoff Cheesecake', 'Creamy cheesecake with a Lotus Biscoff crust and topping.', 7.25, 'Desserts', '/images/lotus-cheesecake.webp'),
('NYC Cheesecake', 'Classic New York style cheesecake, rich and dense.', 6.75, 'Desserts', '/images/nyc-cheesecake.webp'),
('Tiramisu Slice', 'Coffee-soaked ladyfingers with mascarpone cream.', 6.25, 'Desserts', '/images/tiramisu.webp'),
('Caffè Latte', 'Creamy steamed milk with rich espresso and latte art.', 5.00, 'Drinks', '/images/caffe-latte.jpg'),
('Barista\'s Special', 'House special brewed by our expert baristas.', 4.25, 'Drinks', '/images/barista.webp'),
('House Coffee Beans (250g)', 'Freshly roasted beans to brew at home.', 8.00, 'Drinks', '/images/beans.webp'),
('Signature Espresso', 'Concentrated espresso shot with a silky crema.', 3.00, 'Drinks', '/images/signature-espresso.jpg'),
('Hario Pour Over', 'Single pour-over brew using our Hario dripper for clarity.', 4.75, 'Drinks', '/images/hario.avif'),
('Chocolate \u00c9clair', 'Delicate choux pastry filled with cream and topped with rich chocolate.', 5.50, 'Desserts', '/images/chocolate-eclair.jpg');
