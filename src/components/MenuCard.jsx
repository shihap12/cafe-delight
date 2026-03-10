import React from "react";
import gsap from "gsap";
import { FaPlus } from "react-icons/fa";

const MenuCard = ({ item, addToCart, supportsTilt }) => {
  const handleMouseMove = (e) => {
    if (!supportsTilt) return;
    const card = document.getElementById(`card-${item.id}`);
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normalizedX = (x - centerX) / centerX;
    const normalizedY = (y - centerY) / centerY;
    const edgeSafeZone = 34;
    const distanceToSide = Math.min(x, rect.width - x);
    const edgeDamp = gsap.utils.clamp(0.18, 1, distanceToSide / edgeSafeZone);

    const translateX = normalizedX * 14 * edgeDamp;
    const translateY = normalizedY * 6 * edgeDamp;
    const rotateX = normalizedY * -4.5 * edgeDamp;
    const rotateY = normalizedX * 8 * edgeDamp;

    gsap.to(card, {
      x: translateX,
      y: translateY,
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.22,
      ease: "power2.out",
      transformPerspective: 1000,
      scale: 1.015,
    });
  };

  const handleMouseLeave = () => {
    if (!supportsTilt) return;
    const card = document.getElementById(`card-${item.id}`);
    if (!card) return;
    gsap.to(card, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.45,
      ease: "expo.out",
    });
  };

  return (
    <div
      id={`card-${item.id}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="rounded-xl h-full animated-edge-glow transform-style-3d will-change-transform"
    >
      <div className="themed-card rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-full group border relative">
        <div className="h-56 overflow-hidden relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transform group-hover:scale-110 group-hover:brightness-110 transition-all duration-500"
          />
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-amber-400 shadow-sm border border-amber-900/50 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-500 transition-colors duration-300">
            ${Number(item.price).toFixed(2)}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold group-hover:text-amber-400 transition-colors duration-300">
              {item.name}
            </h3>
          </div>
          <p className="themed-muted text-sm mb-6 flex-grow">
            {item.description}
          </p>

          <button
            onClick={() => addToCart(item)}
            className="w-full font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-md relative overflow-hidden group border border-transparent hover:border-[var(--cafe-accent)]/30"
            style={{
              backgroundColor: "var(--btn-bg)",
              color: "var(--btn-text)",
            }}
          >
            <span
              className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out"
              style={{
                background: `linear-gradient(to right, var(--btn-active-from), var(--btn-active-to))`,
              }}
            ></span>
            <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
              <FaPlus className="h-5 w-5 transform group-hover:rotate-180 transition-transform duration-500" />
              Add to Order
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
