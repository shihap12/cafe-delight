import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import About from "./components/About";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

function App() {
  const THEMES = ["classic", "midnight", "sunset"];

  const MOTION = {
    fast: 0.35,
    base: 0.6,
    slow: 0.9,
  };

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cafe-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("cafe-theme");
      if (saved === "day") return "classic";
      if (saved === "night") return "midnight";
      return THEMES.includes(saved) ? saved : "classic";
    } catch {
      return "classic";
    }
  });

  const [siteSettings, setSiteSettings] = useState({});

  const appRef = useRef(null);
  const revealLayerRef = useRef(null);
  const titleRef = useRef(null);
  const btnRef = useRef(null);
  const heroRef = useRef(null);
  const aboutWrapRef = useRef(null);
  const menuWrapRef = useRef(null);
  const footerWrapRef = useRef(null);

  // Fetch site settings from backend
  useEffect(() => {
    fetch("/api/settings.php")
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setSiteSettings(d.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("cafe-theme", theme);
  }, [theme]);

  // Apply admin theme color overrides
  useEffect(() => {
    const root = document.documentElement;
    const cssVars = [
      "--cafe-bg",
      "--cafe-text",
      "--cafe-muted",
      "--cafe-accent",
      "--cafe-accent-2",
      "--cafe-surface",
      "--cafe-surface-card",
      "--cafe-surface-footer",
      "--cafe-surface-text",
      "--cafe-surface-muted",
      "--cafe-border",
    ];
    cssVars.forEach((v) => root.style.removeProperty(v));

    const themeKey = `theme_${theme}`;
    const colors = siteSettings[themeKey];
    if (colors && typeof colors === "object") {
      const map = {
        cafeBg: "--cafe-bg",
        cafeText: "--cafe-text",
        cafeMuted: "--cafe-muted",
        cafeAccent: "--cafe-accent",
        cafeAccent2: "--cafe-accent-2",
        cafeSurface: "--cafe-surface",
        cafeSurfaceCard: "--cafe-surface-card",
        cafeSurfaceFooter: "--cafe-surface-footer",
        cafeSurfaceText: "--cafe-surface-text",
        cafeSurfaceMuted: "--cafe-surface-muted",
        cafeBorder: "--cafe-border",
      };
      Object.entries(colors).forEach(([key, val]) => {
        if (map[key] && val) root.style.setProperty(map[key], val);
      });
    }
  }, [theme, siteSettings]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ctx = gsap.context(() => {
      if (!prefersReducedMotion && revealLayerRef.current) {
        gsap.fromTo(
          revealLayerRef.current,
          { opacity: 1 },
          { opacity: 0, duration: 0.75, ease: "power2.out", delay: 0.05 },
        );
      }

      [aboutWrapRef.current, menuWrapRef.current, footerWrapRef.current]
        .filter(Boolean)
        .forEach((section) => {
          gsap.fromTo(
            section,
            { y: prefersReducedMotion ? 0 : 36, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: prefersReducedMotion ? 0.2 : 0.7,
              ease: "power2.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: section,
                start: "top 82%",
                toggleActions: "play none none none",
              },
            },
          );
        });
    }, appRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!cartPulse) return;
    const t = setTimeout(() => setCartPulse(false), 450);
    return () => clearTimeout(t);
  }, [cartPulse]);

  useEffect(() => {
    localStorage.setItem("cafe-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
    setCartPulse(true);
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateCartItemQuantity = (itemId, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const scrollToMenu = () => {
    gsap.to(window, { duration: 1, scrollTo: "#menu", ease: "power2.inOut" });
  };

  const scrollToAbout = () => {
    gsap.to(window, { duration: 1, scrollTo: "#about", ease: "power2.inOut" });
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cycleTheme = () => {
    setTheme((prev) => {
      const currentIndex = THEMES.indexOf(prev);
      const nextIndex =
        currentIndex === -1 ? 0 : (currentIndex + 1) % THEMES.length;
      return THEMES[nextIndex];
    });
  };

  const themeLabel =
    theme === "classic"
      ? "Classic"
      : theme === "midnight"
        ? "Midnight"
        : "Sunset";

  return (
    <div
      ref={appRef}
      className="min-h-screen relative font-sans transition-colors duration-500"
    >
      <div
        ref={revealLayerRef}
        className="fixed inset-0 z-[80] pointer-events-none app-reveal-layer"
      />

      {/* Cart Component */}
      <Cart
        items={cartItems}
        removeFromCart={removeFromCart}
        updateItemQuantity={updateCartItemQuantity}
        clearCart={clearCart}
        isOpen={isCartOpen}
        closeCart={() => setIsCartOpen(false)}
      />

      {/* Navigation */}
      <Navbar
        isNavOpen={isNavOpen}
        setIsNavOpen={setIsNavOpen}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartItemCount={cartItemCount}
        cartPulse={cartPulse}
        theme={theme}
        cycleTheme={cycleTheme}
        themeLabel={themeLabel}
        scrollToMenu={scrollToMenu}
        scrollToAbout={scrollToAbout}
      />

      {/* Hero Section */}
      <Hero
        ref={heroRef}
        titleRef={titleRef}
        btnRef={btnRef}
        scrollToMenu={scrollToMenu}
        theme={theme}
        settings={siteSettings}
      />

      {/* About Section — pulled up to overlap with Hero's gradient */}
      <div ref={aboutWrapRef} className="relative z-10 -mt-12">
        <About settings={siteSettings} />
      </div>

      {/* Menu Section */}
      <div ref={menuWrapRef}>
        <Menu addToCart={addToCart} />
      </div>

      {/* Footer Section */}
      <div ref={footerWrapRef}>
        <Footer settings={siteSettings} />
      </div>
    </div>
  );
}

export default App;
