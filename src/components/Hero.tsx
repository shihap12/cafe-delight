import React, { forwardRef, useRef, useEffect } from "react";
import { FaArrowRight, FaArrowDown } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type LetterSpansProps = {
  word: string;
  className?: string;
  innerRef?: React.Ref<HTMLSpanElement>;
};

function LetterSpans({ word, className, innerRef }: LetterSpansProps) {
  return (
    <span ref={innerRef as React.Ref<HTMLSpanElement>} className={className}>
      {word.split("").map((ch, i) => (
        <span
          key={i}
          className="letter inline-block"
          style={{ willChange: "transform" }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

const THEME_STYLES = {
  classic: {
    bg: "linear-gradient(135deg, #1a0e05 0%, #2c1810 30%, #1e1208 60%, #0f0a06 100%)",
    glow1: "#d97706",
    glow2: "#ea580c",
    accent: "text-amber-400",
    accent2: "text-orange-500",
    btnGrad: "from-amber-500 to-orange-600",
    btnShadow: "rgba(245,158,11,0.4)",
    imgOverlay: "from-[#1a0e05]/80 via-[#2c1810]/40 to-transparent",
    imgBorder: "border-amber-500/20",
    imgGlow: "shadow-[0_0_60px_rgba(217,119,6,0.15)]",
  },
  midnight: {
    bg: "linear-gradient(135deg, #06070a 0%, #0f1320 30%, #131926 60%, #0a0d14 100%)",
    glow1: "#60a5fa",
    glow2: "#a78bfa",
    accent: "text-blue-400",
    accent2: "text-violet-400",
    btnGrad: "from-blue-500 to-violet-600",
    btnShadow: "rgba(96,165,250,0.4)",
    imgOverlay: "from-[#06070a]/80 via-[#131926]/40 to-transparent",
    imgBorder: "border-blue-500/20",
    imgGlow: "shadow-[0_0_60px_rgba(96,165,250,0.15)]",
  },
  sunset: {
    bg: "linear-gradient(135deg, #2f1a10 0%, #5c2d15 30%, #3a2316 60%, #1f1008 100%)",
    glow1: "#fb7185",
    glow2: "#f97316",
    accent: "text-rose-400",
    accent2: "text-orange-400",
    btnGrad: "from-rose-500 to-orange-600",
    btnShadow: "rgba(251,113,133,0.4)",
    imgOverlay: "from-[#2f1a10]/80 via-[#3a2316]/40 to-transparent",
    imgBorder: "border-rose-500/20",
    imgGlow: "shadow-[0_0_60px_rgba(251,113,133,0.15)]",
  },
} as const;

type Settings = {
  hero_line1?: string;
  hero_line2?: string;
  hero_line3?: string;
  hero_subtitle?: string;
  hero_image?: string;
  [k: string]: any;
};

type HeroProps = {
  titleRef?: React.Ref<HTMLDivElement> | null;
  btnRef?: React.Ref<HTMLButtonElement> | null;
  scrollToMenu?: () => void;
  theme?: keyof typeof THEME_STYLES;
  settings?: Settings;
};

const Hero = forwardRef<HTMLElement, HeroProps>(
  (
    { titleRef, btnRef, scrollToMenu, theme = "classic", settings = {} },
    ref,
  ) => {
    const imageWrapRef = useRef<HTMLDivElement | null>(null);
    const line1Ref = useRef<HTMLSpanElement | null>(null);
    const line2Ref = useRef<HTMLSpanElement | null>(null);
    const line3Ref = useRef<HTMLSpanElement | null>(null);
    const taglineRef = useRef<HTMLParagraphElement | null>(null);
    const heroContentRef = useRef<HTMLDivElement | null>(null);

    const t = THEME_STYLES[theme] || THEME_STYLES.classic;

    const heroLine1 = settings.hero_line1 || "Taste";
    const heroLine2 = settings.hero_line2 || "The";
    const heroLine3 = settings.hero_line3 || "Passion";
    const heroSubtitle =
      settings.hero_subtitle ||
      "Experience the finest coffee and desserts in a cozy atmosphere. Order online now.";
    const heroImage = settings.hero_image || "/images/latte-art.jpg";

    useEffect(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReducedMotion) return;

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          delay: 0.3,
        });

        tl.fromTo(
          line1Ref.current,
          { x: 300, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.9 },
        );

        tl.fromTo(
          line2Ref.current,
          { y: -200, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.5",
        );

        tl.fromTo(
          line3Ref.current,
          { y: 200, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.5",
        );

        tl.to([line1Ref.current, line2Ref.current, line3Ref.current], {
          keyframes: [
            { y: -8, duration: 0.2 },
            { y: 5, duration: 0.15 },
            { y: -3, duration: 0.12 },
            { y: 0, duration: 0.1 },
          ],
          stagger: 0.08,
          ease: "power2.inOut",
        });

        tl.fromTo(
          taglineRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.3",
        ).fromTo(
          btnRef as any,
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5 },
          "-=0.2",
        );

        tl.fromTo(
          imageWrapRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" },
          "-=1.0",
        );

        const allLetters =
          heroContentRef.current?.querySelectorAll("h1 .letter") || [];
        if (allLetters.length) {
          tl.add(() => {
            const waveTl = gsap.timeline({ repeat: -1 });
            allLetters.forEach((letter: Element, i: number) => {
              const offset = i * 0.08;
              waveTl.to(
                letter,
                {
                  scale: 1.4,
                  duration: 0.2,
                  ease: "sine.out",
                },
                offset,
              );
              waveTl.to(
                letter,
                {
                  scale: 1,
                  duration: 0.2,
                  ease: "sine.in",
                },
                offset + 0.2,
              );
            });
          });
        }
      }, heroContentRef as any);

      return () => ctx.revert();
    }, []);

    return (
      <header ref={ref} className="relative min-h-screen">
        <div
          ref={heroContentRef}
          className="relative h-screen flex items-center overflow-hidden transition-all duration-700"
          style={{ background: t.bg }}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute w-[600px] h-[600px] rounded-full opacity-10 transition-all duration-700"
              style={{
                background: `radial-gradient(circle, ${t.glow1} 0%, transparent 70%)`,
                top: "-10%",
                right: "10%",
              }}
            />
            <div
              className="absolute w-[400px] h-[400px] rounded-full opacity-5 transition-all duration-700"
              style={{
                background: `radial-gradient(circle, ${t.glow2} 0%, transparent 70%)`,
                bottom: "5%",
                left: "5%",
              }}
            />
          </div>

          <div
            ref={titleRef as any}
            className="relative z-10 w-full lg:w-1/2 px-8 md:px-16 lg:px-20"
          >
            <div className="max-w-xl">
              <h1 className="font-display mb-6 leading-[0.95]">
                <LetterSpans
                  word={heroLine1}
                  innerRef={line1Ref}
                  className="block text-5xl md:text-7xl lg:text-8xl font-bold text-white opacity-0"
                />
                <LetterSpans
                  word={heroLine2}
                  innerRef={line2Ref}
                  className={`block text-5xl md:text-7xl lg:text-8xl font-bold ${t.accent} opacity-0 transition-colors duration-700`}
                />
                <LetterSpans
                  word={heroLine3}
                  innerRef={line3Ref}
                  className={`block text-5xl md:text-7xl lg:text-8xl font-bold ${t.accent2} opacity-0 transition-colors duration-700`}
                />
              </h1>

              <p
                ref={taglineRef}
                className="text-lg md:text-xl text-stone-300 mb-8 max-w-md font-light leading-relaxed opacity-0"
              >
                {heroSubtitle}
              </p>

              <button
                ref={btnRef as any}
                onClick={scrollToMenu}
                className={`relative overflow-hidden bg-gradient-to-r ${t.btnGrad} text-white font-bold py-4 px-12 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer group opacity-0`}
                style={{ ["--tw-shadow-color" as any]: t.btnShadow }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Order Now
                  <FaArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full"></div>
              </button>
            </div>
          </div>

          <div
            ref={imageWrapRef as any}
            className="hidden lg:flex absolute right-0 top-0 w-1/2 h-full items-center justify-center opacity-0"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${t.imgOverlay} z-10 transition-all duration-700`}
            />

            <div className="relative w-[85%] max-w-lg z-20">
              <div
                className={`rounded-2xl overflow-hidden border ${t.imgBorder} ${t.imgGlow} transition-all duration-700`}
              >
                <img
                  src={heroImage}
                  alt="Handcrafted latte art"
                  className="w-full h-auto object-cover aspect-[4/5]"
                />
              </div>
              <div
                className="absolute -inset-4 rounded-3xl border opacity-20 transition-all duration-700"
                style={{ borderColor: t.glow1 }}
              />
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-10 opacity-70">
            <FaArrowDown className="h-8 w-8 text-white" />
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 w-full h-48 z-20 pointer-events-none transition-all duration-700"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, var(--cafe-surface) 100%)`,
          }}
        />
      </header>
    );
  },
);

Hero.displayName = "Hero";

export default Hero;
