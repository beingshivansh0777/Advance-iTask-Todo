import React, { useState, useEffect } from "react";
import { FaFilePdf, FaImage } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const HistoryTodos = ({
  history,
  setHistory,
  historyDate,
  setHistoryDate,
  historySort,
  setHistorySort,
  onPreviewImage,
  darkMode
}) => {
  const [localHistory, setLocalHistory] = useState(history || []);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Sync local state with parent history
  useEffect(() => {
    setLocalHistory(history);
  }, [history]);

  const openConfirm = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    const updated = localHistory.filter((h) => h.id !== deleteId);
    setLocalHistory(updated);
    setHistory(updated);

    // LocalStorage update
    localStorage.setItem("history", JSON.stringify(updated));

    // Popup close
    setShowConfirm(false);

    // deleteId reset after small delay
    setTimeout(() => {
      setDeleteId(null);
    }, 200);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  return (
    <div className="mt-10 relative">
      <h2 className="text-xl font-bold mb-3">Todo History</h2>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-3">
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={historyDate}
            onChange={(e) => setHistoryDate(e.target.value)}
            className={`border p-2 rounded outline-none
              ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-200"}`}
          />
          <button
            onClick={() => setHistoryDate("")}
            className="px-3 py-2 rounded bg-gray-500 text-white hover:opacity-90"
          >
            Clear Date
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm opacity-80">Sort:</label>
          <select
            value={historySort}
            onChange={(e) => setHistorySort(e.target.value)}
            className={`border p-2 rounded outline-none
              ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-200"}`}
          >
            <option value="date-desc">Date (Newest → Oldest)</option>
            <option value="date-asc">Date (Oldest → Newest)</option>
            <option value="priority-desc">Priority (High → Low)</option>
            <option value="priority-asc">Priority (Low → High)</option>
          </select>
        </div>
      </div>

      {/* Todo History Section */}
      <div className="space-y-2">
        {localHistory.length === 0 && <p className="opacity-70">No history for the selected filter.</p>}
        {localHistory.map((h) => {
          const d = new Date(h.completedAt);
          const dateStr = d.toLocaleString();
          const typeLabel = (() => {
            if (!h.files?.length) return "Task";
            const set = new Set(h.files.map((f) => (f.isImage ? "Image" : f.ext === "pdf" ? "PDF" : "Document")));
            return [...set].join(", ");
          })();
          return (
            <div
              key={h.id}
              className={`p-3 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">{h.todo}</div>
                <div className="flex items-center gap-3">
                  <div className="text-xs opacity-70">Completed: {dateStr}</div>
                  <button
                    className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:opacity-90"
                    onClick={() => openConfirm(h.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm opacity-90">
                <div><span className="font-medium">Priority: </span>{h.priority}</div>
                <div><span className="font-medium">Type: </span>{typeLabel}</div>
                <div><span className="font-medium">Due Date: </span>{h.dueDate || "—"}</div>
                <div><span className="font-medium">Category: </span>{h.category}</div>
              </div>
              {h.subtasks?.length > 0 && (
                <div className="mt-2">
                  <div className="font-medium text-sm mb-1 opacity-90">Subtasks</div>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {h.subtasks.map((st, i) => (
                      <li key={i}>{st.text}</li>
                    ))}
                  </ul>
                </div>
              )}
              {h.files?.length > 0 && (
                <div className="mt-2 text-sm">
                  <div className="font-medium mb-1 opacity-90">Attachments</div>
                  <div className="flex flex-col gap-1">
                    {h.files.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {file.isImage ? <FaImage /> : <FaFilePdf />}
                        <button
                          className="underline hover:opacity-80"
                          onClick={() => (file.isImage ? onPreviewImage(file.url) : window.open(file.url, "_blank"))}
                        >
                          {file.name}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirm Popup */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            key="confirm-popup"
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className={`p-6 rounded-xl shadow-xl border ${darkMode
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-white text-black border-gray-200"} w-80 text-center`}
            >
              <h3 className="text-lg font-bold mb-3">Confirm Delete</h3>
              <p className="mb-4">Are you sure you want to delete this task?</p>
              <div className="flex justify-center gap-3">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:opacity-90"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:opacity-90"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HistoryTodos;


