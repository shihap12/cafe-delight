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

  const appRef = useRef(null);
  const revealLayerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const btnRef = useRef(null);
  const videoRef = useRef(null);
  const heroRef = useRef(null);
  const aboutWrapRef = useRef(null);
  const menuWrapRef = useRef(null);
  const footerWrapRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("cafe-theme", theme);
  }, [theme]);

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

      // Initial animations
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (!prefersReducedMotion) {
        tl.fromTo(
          titleRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: MOTION.slow, delay: 0.2 },
        )
          .fromTo(
            subtitleRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: MOTION.base },
            "-=0.4",
          )
          .fromTo(
            btnRef.current,
            { scale: 0.92, opacity: 0 },
            { scale: 1, opacity: 1, duration: MOTION.fast },
            "-=0.2",
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
              scrollTrigger: {
                trigger: section,
                start: "top 82%",
                toggleActions: "play none none none",
              },
            },
          );
        });
    }, appRef);

    // Video Scrubbing Animation
    const video = videoRef.current;
    if (video && !prefersReducedMotion) {
      video.pause();

      const setupScrollTrigger = () => {
        if (!video.duration) return;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.7,
              onUpdate: () => {
                if (!video.paused) video.pause();
              },
            },
          })
          .fromTo(
            video,
            { currentTime: 0 },
            { currentTime: video.duration, ease: "none" },
          );
      };

      if (video.readyState >= 1) {
        setupScrollTrigger();
      } else {
        video.onloadedmetadata = setupScrollTrigger;
      }
    }

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
        subtitleRef={subtitleRef}
        btnRef={btnRef}
        videoRef={videoRef}
        scrollToMenu={scrollToMenu}
      />

      {/* About Section */}
      <div ref={aboutWrapRef} className="relative z-10 -mt-40">
        <About />
      </div>

      {/* Menu Section */}
      <div ref={menuWrapRef}>
        <Menu addToCart={addToCart} />
      </div>

      {/* Footer Section */}
      <div ref={footerWrapRef}>
        <Footer />
      </div>
    </div>
  );
}

export default App;
