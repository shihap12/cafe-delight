import React, { forwardRef } from "react";

const Hero = forwardRef(
  ({ titleRef, subtitleRef, btnRef, videoRef, scrollToMenu }, ref) => {
    return (
      <header ref={ref} className="relative h-[200vh]">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center text-center text-white px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover scale-105"
            >
              <source src="/images/Cafe-Video1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          <div className="relative z-10 max-w-4xl">
            <h1
              ref={titleRef}
              className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-2xl font-display"
            >
              Taste the Passion
            </h1>
            <p
              ref={subtitleRef}
              className="text-xl md:text-2xl mb-10 font-light max-w-2xl mx-auto drop-shadow-lg text-stone-100"
            >
              Experience the finest coffee and desserts in a cozy atmosphere.
              Order online now.
            </p>
            <button
              ref={btnRef}
              onClick={scrollToMenu}
              className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-4 px-12 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] cursor-pointer group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Order Now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full"></div>
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 animate-bounce z-10 opacity-70">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </header>
    );
  },
);

Hero.displayName = "Hero";

export default Hero;
