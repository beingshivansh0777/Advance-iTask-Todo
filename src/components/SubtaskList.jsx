import React from "react";
import { MdDeleteForever } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const SubtaskList = ({ subtasks, onDelete, darkMode }) => {
  return (
    <div className={`mt-2 rounded-lg border p-3 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className="text-sm opacity-80 mb-2">
        {subtasks.length} / 5 subtasks added
      </div>
      <ul className="space-y-2">
        <AnimatePresence>
          {subtasks.map((st, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`flex items-center justify-between px-3 py-2 rounded ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
            >
              <span className="truncate">{st.text}</span>
              <button
                className="text-red-500 hover:opacity-80"
                onClick={() => onDelete(idx)}
                title="Remove subtask"
              >
                <MdDeleteForever />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default SubtaskList;
