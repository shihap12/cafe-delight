import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { menuItems } from "../data/menuItems";
import { buildApiUrl } from "../config/api";
import MenuCard from "./MenuCard";

const Menu = ({ addToCart }) => {
  const [filter, setFilter] = useState("All");
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supportsTilt, setSupportsTilt] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const mediaReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mediaHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    setPrefersReducedMotion(mediaReduce.matches);
    setSupportsTilt(mediaHover.matches);
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(buildApiUrl("menu"));

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const items = Array.isArray(data?.data) ? data.data : [];

        if (items.length === 0) {
          throw new Error("Empty menu response");
        }

        setAllItems(items);
        setFilteredItems(items);
      } catch (err) {
        console.error("Failed to load menu:", err);
        setError(
          "Unable to load menu from backend. Showing sample menu instead.",
        );
        setAllItems(menuItems);
        setFilteredItems(menuItems);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);
  useEffect(() => {
    if (filter === "All") {
      setFilteredItems(allItems);
    } else {
      setFilteredItems(allItems.filter((item) => item.category === filter));
    }
  }, [filter, allItems]);

  // Animate items when they change
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "clipPath",
        },
      );
    }
  }, [filteredItems, prefersReducedMotion]);

  const categories = ["All", "Drinks", "Desserts"];

  return (
    <section
      id="menu"
      className="py-16 px-4 min-h-screen themed-surface cafe-section-texture"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 accent-text font-display relative z-[60]">
          Our Menu
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={`menu-skeleton-${idx}`}
                className="rounded-xl border themed-card overflow-hidden"
              >
                <div className="h-56 animate-pulse bg-gradient-to-r from-stone-700 via-stone-600 to-stone-700" />
                <div className="p-6 space-y-3">
                  <div className="h-6 w-3/4 rounded bg-stone-600/80 animate-pulse" />
                  <div className="h-4 w-full rounded bg-stone-600/80 animate-pulse" />
                  <div className="h-4 w-2/3 rounded bg-stone-600/80 animate-pulse" />
                  <div className="h-10 w-full mt-4 rounded bg-stone-600/80 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-400 mb-12">{error}</div>
        ) : (
          <>
            {/* Filter Buttons */}
            <div className="flex justify-center gap-4 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-8 py-3 rounded-full font-bold transition-all duration-300 relative overflow-hidden group z-10 ${
                    filter === cat
                      ? "text-white shadow-lg scale-105"
                      : "text-[var(--btn-text)] border border-[var(--cafe-border)] hover:text-white hover:border-[var(--cafe-accent)]/50"
                  }`}
                  style={
                    filter === cat
                      ? {
                          background: `linear-gradient(to right, var(--btn-active-from), var(--btn-active-to))`,
                          boxShadow: `0 0 15px color-mix(in srgb, var(--btn-active-from) 50%, transparent)`,
                        }
                      : { backgroundColor: "var(--btn-bg)" }
                  }
                >
                  <span className="relative z-10">{cat}</span>
                  {filter !== cat && (
                    <div
                      className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                      style={{ backgroundColor: "var(--btn-bg-hover)" }}
                    ></div>
                  )}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div
              ref={containerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000"
            >
              {filteredItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  addToCart={addToCart}
                  supportsTilt={supportsTilt}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Menu;
