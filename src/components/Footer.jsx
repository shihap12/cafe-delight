import React from "react";
import { FaInstagram, FaTiktok, FaFacebookF, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const socialLinks = [
    {
      icon: FaInstagram,
      name: "Instagram",
      href: "#",
      brandColor: "#E1306C",
      glowColor: "rgba(225, 48, 108, 0.5)",
    },
    {
      icon: FaTiktok,
      name: "TikTok",
      href: "#",
      brandColor: "#00f2ea",
      glowColor: "rgba(0, 242, 234, 0.45)",
    },
    {
      icon: FaFacebookF,
      name: "Facebook",
      href: "#",
      brandColor: "#1877F2",
      glowColor: "rgba(24, 119, 242, 0.5)",
    },
    {
      icon: FaWhatsapp,
      name: "WhatsApp",
      href: "#",
      brandColor: "#25D366",
      glowColor: "rgba(37, 211, 102, 0.5)",
    },
  ];

  return (
    <footer className="themed-footer py-12 border-t">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        {/* Brand */}
        <h2 className="text-3xl font-bold accent-text mb-2 tracking-tighter font-display">
          CAFE DELIGHT
        </h2>
        <p className="themed-muted text-sm mb-8">
          Taste the Passion in Every Sip
        </p>

        {/* Social Icons */}
        <div className="flex gap-6 mb-8">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              className="social-icon-glow p-3 themed-card rounded-full transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
              style={{
                "--icon-brand": social.brandColor,
                "--icon-glow": social.glowColor,
              }}
              aria-label={social.name}
            >
              <social.icon className="w-6 h-6" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center text-xs themed-muted">
          <p>
            &copy; {new Date().getFullYear()} Cafe Delight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
