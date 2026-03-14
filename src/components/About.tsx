import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Settings = Record<string, any>;

const About: React.FC<{ settings?: Settings }> = ({ settings = {} }) => {
  const ref = useRef<HTMLElement | null>(null);

  const aboutTitle = settings.about_title || "About Cafe Delight";
  const aboutText1 =
    settings.about_text1 ||
    "Cafe Delight is a cozy spot serving handcrafted coffee and freshly baked desserts. We source premium beans and prepare each cup with care.";
  const aboutText2 =
    settings.about_text2 ||
    "Visit us for a relaxing atmosphere, specialty drinks, and a selection of house-made sweets.";
  const aboutImage = settings.about_image || "/images/coffee-grinding.jpg";

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const elems = (ref.current as HTMLElement).querySelectorAll(
        ".about-animate",
      );

      gsap.fromTo(
        elems,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }, ref as any);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="about"
      ref={ref as any}
      className="py-20 px-4 themed-surface cafe-section-texture"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-4 about-animate opacity-0 translate-y-10 font-display">
            {aboutTitle}
          </h2>
          <p className="themed-muted mb-4 about-animate opacity-0 translate-y-10">
            {aboutText1}
          </p>
          <p className="themed-muted about-animate opacity-0 translate-y-10">
            {aboutText2}
          </p>
        </div>

        <div className="md:w-1/2 about-animate opacity-0 translate-y-10">
          <img
            src={aboutImage}
            alt="Coffee machine in our cafe"
            className="w-full rounded-lg shadow-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
