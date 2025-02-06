import { Linkedin, Globe } from "lucide-react";
import { SiGithub, SiX } from "react-icons/si";
import { motion } from "framer-motion";

export function Footer() {
  const socialLinks = [
    {
      icon: SiGithub,
      href: "https://github.com/harshhh28",
      label: "GitHub",
    },
    {
      icon: SiX,
      href: "https://twitter.com/harshgajjar_28",
      label: "X (Twitter)",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/harsh-gajjar-936536209",
      label: "LinkedIn",
    },
    {
      icon: Globe,
      href: "https://harshgajjar.vercel.app/",
      label: "Portfolio",
    },
  ];

  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-100 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-gray-600 flex items-center">
            Created with{" "}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-red-500 mx-1">
              ❤️
            </motion.span>{" "}
            by Harsh Gajjar
          </p>
          <div className="flex space-x-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-600 hover:text-indigo-600 transition-colors"
                title={label}>
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
