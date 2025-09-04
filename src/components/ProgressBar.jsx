import React from "react";
import { motion } from "framer-motion";

const ProgressBar = ({ progress }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex items-center">
        <div className="bg-gray-300 w-3 h-64 rounded-full relative flex justify-center overflow-hidden">
          <motion.div
            className="bg-green-500 w-3 rounded-full absolute bottom-0"
            style={{ height: `${progress}%` }}
            initial={{ height: 0 }}
            animate={{ height: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>
        <motion.span
          className="ml-2 text-sm opacity-80 transform -rotate-90 origin-bottom select-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          Your Todos Progress Bar
        </motion.span>
      </div>
    </div>
  );
};

export default ProgressBar;
