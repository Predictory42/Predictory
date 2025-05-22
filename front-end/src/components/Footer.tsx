import { motion } from "framer-motion";
import type { FC } from "react";

export const Footer: FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="py-8 mt-12 border-t border-border"
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Predictory. Built on Solana.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="https://x.com/Predictory_"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-5 h-5"
            >
              <path
                fill="currentColor"
                d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
              />
            </svg>
          </a>
        </div>
      </div>
    </motion.footer>
  );
};
