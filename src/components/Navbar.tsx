import React from "react";
import {
  FaCoffee,
  FaBars,
  FaSun,
  FaMoon,
  FaAdjust,
  FaShoppingCart,
} from "react-icons/fa";
import { Theme } from "../types";

type NavbarProps = {
  isNavOpen: boolean;
  setIsNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cartItemCount: number;
  cartPulse: boolean;
  theme: Theme;
  cycleTheme: () => void;
  themeLabel: string;
  scrollToMenu: () => void;
  scrollToAbout: () => void;
};

const Navbar: React.FC<NavbarProps> = ({
  isNavOpen,
  setIsNavOpen,
  isCartOpen,
  setIsCartOpen,
  cartItemCount,
  cartPulse,
  theme,
  cycleTheme,
  themeLabel,
  scrollToMenu,
  scrollToAbout,
}) => {
  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-6 text-white bg-black/20 backdrop-blur-sm transition-all duration-300">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter drop-shadow-md">
          <FaCoffee className="h-7 w-7 text-amber-400" />
          <span
            className="italic"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Cafe Delight
          </span>
        </div>
        <div className="flex items-center gap-4 font-medium">
          <div className="md:hidden">
            <button
              onClick={() => setIsNavOpen((v: boolean) => !v)}
              className="p-2 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>

          <div
            className="hidden md:flex space-x-8"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
            }}
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hover:text-amber-300 transition-colors"
            >
              Home
            </button>
            <button
              onClick={scrollToMenu}
              className="hover:text-amber-300 transition-colors"
            >
              Menu
            </button>
            <button
              onClick={scrollToAbout}
              className="hover:text-amber-300 transition-colors"
            >
              About
            </button>
          </div>

          <button
            onClick={cycleTheme}
            className="p-2 rounded-full hover:bg-white/20 transition-colors flex items-center gap-2"
            aria-label="Toggle theme"
            title={`Theme: ${themeLabel}`}
          >
            {theme === "classic" ? (
              <FaSun className="h-5 w-5" />
            ) : theme === "midnight" ? (
              <FaMoon className="h-5 w-5" />
            ) : (
              <FaAdjust className="h-5 w-5" />
            )}
            <span className="hidden lg:inline text-xs tracking-wide">
              {themeLabel}
            </span>
          </button>

          <button
            onClick={() => setIsCartOpen((v: boolean) => !v)}
            aria-pressed={isCartOpen}
            className="relative p-2 hover:bg-white/20 rounded-full transition-colors group"
          >
            <FaShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
            {cartItemCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-transform ${cartPulse ? "scale-125" : "scale-100"}`}
              >
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <div
        className={`md:hidden fixed top-16 left-0 w-full z-40 transition-transform ${isNavOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="bg-black/95 text-white py-4">
          <div
            className="flex flex-col items-center space-y-3"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
            }}
          >
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setIsNavOpen(false);
              }}
              className="py-2 px-6"
            >
              Home
            </button>
            <button
              onClick={() => {
                scrollToMenu();
                setIsNavOpen(false);
              }}
              className="py-2 px-6"
            >
              Menu
            </button>
            <button
              onClick={() => {
                scrollToAbout();
                setIsNavOpen(false);
              }}
              className="py-2 px-6"
            >
              About
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
