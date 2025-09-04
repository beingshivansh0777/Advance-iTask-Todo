import React from "react";
import { motion } from "framer-motion";
import { useClerk } from "@clerk/clerk-react";

const Header = ({ darkMode }) => {
  const { openSignIn } = useClerk();

  return (
    <motion.div
      className={`py-16 px-6 text-center rounded-xl shadow-lg transition-colors duration-500 
        ${darkMode 
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white" 
          : "bg-gradient-to-r from-blue-50 to-indigo-100 text-black"
        }`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Title */}
      <h1
        className={`text-6xl font-extrabold drop-shadow-sm ${
          darkMode
            ? "bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            : "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        }`}
      >
        Welcome to iTask 🚀
      </h1>

      {/* Subtitle */}
      <p
        className={`mt-4 text-lg max-w-2xl mx-auto ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Your all-in-one productivity hub. Plan smarter, track progress, and get
        things done with ease.
      </p>

      {/* CTA Button */}
      <motion.button
        onClick={() => openSignIn({})}
        className={`mt-6 px-10 py-3 text-lg font-semibold rounded-full shadow transition-transform
          ${darkMode 
            ? "bg-purple-500 text-white hover:bg-purple-600" 
            : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Let’s Start
      </motion.button>

      {/* Features Section */}
      <motion.div
        className="mt-12 grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        {[
          {
            icon: "✅",
            title: "Organize Tasks",
            desc: "Categorize todos and stay on top of priorities.",
          },
          {
            icon: "⏰",
            title: "Set Deadlines",
            desc: "Never miss important tasks with reminders.",
          },
          {
            icon: "📊",
            title: "Track Progress",
            desc: "Visualize your work with charts and stats.",
          },
          {
            icon: "📂",
            title: "Attach Files",
            desc: "Keep notes and documents with your tasks.",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className={`p-6 rounded-2xl shadow-md hover:shadow-xl flex flex-col items-center transition
              ${darkMode 
                ? "bg-gray-800/60 backdrop-blur-lg border border-gray-700 text-white" 
                : "bg-white/60 backdrop-blur-lg border border-white/40 text-black"
              }`}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <span className="text-4xl">{item.icon}</span>
            <h3 className="mt-3 font-semibold text-lg">{item.title}</h3>
            <p className="mt-2 text-sm opacity-80">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Header;
