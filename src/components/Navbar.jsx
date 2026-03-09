import React from "react";

const Navbar = ({
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-amber-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18.5 3H6C4.9 3 4 3.9 4 5v1.28c-.6.35-1 .98-1 1.72v1c0 1.1.9 2 2 2h1v6c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-6h1c1.1 0 2-.9 2-2V8c0-.74-.4-1.37-1-1.72V5c0-.55-.22-1.05-.59-1.41C19.05 3.22 18.55 3 18 3h.5zM6 5h12v1H6V5zm13 4H5V8h14v1z" />
          </svg>
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
              onClick={() => setIsNavOpen((v) => !v)}
              className="p-2 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v2m0 14v2m7-9h2M3 12H5m12.364-6.364l1.414 1.414M5.636 18.364l1.414-1.414m0-9.9L5.636 5.636m12.728 12.728l-1.414-1.414M12 8a4 4 0 100 8 4 4 0 000-8z"
                />
              </svg>
            ) : theme === "midnight" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12a9 9 0 1118 0c0 4.97-4.03 9-9 9s-9-4.03-9-9zm9-4a1 1 0 000 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                />
              </svg>
            )}
            <span className="hidden lg:inline text-xs tracking-wide">
              {themeLabel}
            </span>
          </button>

          <button
            onClick={() => setIsCartOpen((v) => !v)}
            aria-pressed={isCartOpen}
            className="relative p-2 hover:bg-white/20 rounded-full transition-colors group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
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

      {/* Mobile nav panel */}
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
