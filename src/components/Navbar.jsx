import { motion } from "framer-motion";
import { FaMoon, FaSun } from "react-icons/fa";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/clerk-react";

const Navbar = ({ darkMode, setDarkMode }) => {
  return (
    <nav
      className={`flex justify-between items-center px-6 py-4 shadow-md sticky top-0 z-50 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Logo */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-blue-600"
      >
        iTask
      </motion.h1>

      {/* Right side buttons */}
      <div className="flex items-center gap-4">
        {/* Dark mode toggle */}
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun className="text-yellow-400 text-xl" /> : <FaMoon className="text-gray-600 text-xl" />}
        </button>

        {/* Clerk Auth */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
