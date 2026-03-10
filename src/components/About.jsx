import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const elems = ref.current.querySelectorAll(".about-animate");

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
    }, ref);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="about"
      ref={ref}
      className="py-20 px-4 themed-surface cafe-section-texture"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-4 about-animate opacity-0 translate-y-10 font-display">
            About Cafe Delight
          </h2>
          <p className="themed-muted mb-4 about-animate opacity-0 translate-y-10">
            Cafe Delight is a cozy spot serving handcrafted coffee and freshly
            baked desserts. We source premium beans and prepare each cup with
            care.
          </p>
          <p className="themed-muted about-animate opacity-0 translate-y-10">
            Visit us for a relaxing atmosphere, specialty drinks, and a
            selection of house-made sweets.
          </p>
        </div>

        <div className="md:w-1/2 about-animate opacity-0 translate-y-10">
          <img
            src="/images/coffee-grinding.jpg"
            alt="Coffee machine in our cafe"
            className="w-full rounded-lg shadow-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
