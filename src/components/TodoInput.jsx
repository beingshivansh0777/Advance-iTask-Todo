import React, { useRef, useState } from "react";
import { MdKeyboardVoice } from "react-icons/md";
import { FaPlus, FaFilePdf, FaImage } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import SubtaskList from "./SubtaskList";

const TodoInput = ({
  darkMode,
  todo, setTodo,
  dueDate, setDueDate,
  priority, setPriority,
  category, setCategory,
  subtasks, setSubtasks,
  selectedFiles, setSelectedFiles,
  handleAdd
}) => {
  const [subtaskText, setSubtaskText] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const recognitionRef = useRef(null);
  const [holdingMic, setHoldingMic] = useState(false);

  const canAddTodo = todo.trim().length >= 3;
  const canAddSubtask = subtaskText.trim().length > 0 && subtasks.length < 5;

  /* Voice recognition: hold to talk */
  const getWSR = () => window.webkitSpeechRecognition || window.SpeechRecognition;
  const startRecognition = () => {
    const WSR = getWSR();
    if (!WSR) return;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    const rec = new WSR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      setTodo(transcript);
    };
    recognitionRef.current = rec;
    try { rec.start(); } catch {}
  };
  const stopRecognition = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
  };

  const addSubtask = () => {
    if (!canAddSubtask) return;
    setSubtasks(prev => [...prev, { text: subtaskText.trim(), isCompleted: false }]);
    setSubtaskText("");
  };

  const deleteSubtask = (idx) => {
    setSubtasks(prev => prev.filter((_, i) => i !== idx));
  };

  const handleFileSelect = (file, isImage = false) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    setSelectedFiles(prev => [...prev, { name: file.name, url, isImage, ext }]);
    setShowUpload(false);
  };
  const handleStagedFileDelete = (name) => {
    setSelectedFiles(prev => prev.filter(f => f.name !== name));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Enter todo with hold-to-talk mic (inside bar, right) */}
      <div className="relative">
        <input
          type="text"
          placeholder="Enter todo..."
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          className={`border p-3 rounded w-full pr-12 outline-none
            ${darkMode ? "bg-gray-800 text-white border-gray-700 placeholder-gray-400"
                        : "bg-white text-black border-gray-200"}`}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseDown={() => { setHoldingMic(true); startRecognition(); }}
          onMouseUp={() => { setHoldingMic(false); stopRecognition(); }}
          onMouseLeave={() => { if (holdingMic) { setHoldingMic(false); stopRecognition(); } }}
          onTouchStart={() => { setHoldingMic(true); startRecognition(); }}
          onTouchEnd={() => { setHoldingMic(false); stopRecognition(); }}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full shadow text-white
            ${holdingMic ? "bg-blue-600" : "bg-blue-500"}`}
          title="Hold to speak"
        >
          <MdKeyboardVoice />
        </motion.button>
      </div>

      {/* Subtask input (under main todo) + Add button (right, fades) */}
      <div className="relative">
        <input
          type="text"
          placeholder="Add subtask..."
          value={subtaskText}
          onChange={(e) => setSubtaskText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") addSubtask(); }}
          className={`border p-3 rounded w-full pr-24 outline-none
            ${darkMode ? "bg-gray-800 text-white border-gray-700 placeholder-gray-400"
                        : "bg-white text-black border-gray-200"}`}
        />

        {/* Attach (+) button, right side inside bar */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUpload(v => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full shadow bg-green-500 text-white"
          title="Attach file"
        >
          <FaPlus />
        </motion.button>

        {/* Add Subtask button (fades; right side) */}
        <motion.button
          onClick={addSubtask}
          disabled={!canAddSubtask}
          initial={false}
          animate={{ opacity: canAddSubtask ? 1 : 0.4 }}
          className={`absolute right-12 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-xs
            ${canAddSubtask ? "bg-purple-600 text-white" : "bg-gray-400 text-white cursor-not-allowed"}`}
          title="Add subtask"
        >
          Add
        </motion.button>

        {/* Upload dropdown (aligned right) */}
        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`absolute right-0 mt-2 rounded-lg shadow p-2 z-20 border
                ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-black"}`}
            >
              <label className="cursor-pointer flex items-center gap-2 px-2 py-2 rounded hover:bg-black/10">
                <FaImage /> Add Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0], true)}
                />
              </label>
              <label className="cursor-pointer flex items-center gap-2 px-2 py-2 rounded hover:bg-black/10">
                <FaFilePdf /> Add Document
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0], false)}
                />
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtask list */}
      {subtasks.length > 0 && (
        <SubtaskList
          subtasks={subtasks}
          onDelete={deleteSubtask}
          darkMode={darkMode}
        />
      )}

      {/* Staged attachments notice */}
      {selectedFiles.length > 0 && (
        <div className={`p-3 rounded border
          ${darkMode ? "bg-emerald-900/30 border-emerald-800 text-emerald-200"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
          <p className="font-medium">Image/File Upload Successfully</p>
          <div className="mt-2 flex flex-col gap-1 text-sm">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="truncate">{file.name}</span>
                <button
                  className="text-red-500 text-xs hover:opacity-80"
                  onClick={() => setSelectedFiles(prev => prev.filter(f => f.name !== file.name))}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Date / Priority / Category */}
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className={`border p-3 rounded w-full outline-none
          ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-200"}`}
      />

      <div className="flex gap-3">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className={`border p-3 rounded w-1/2 outline-none
            ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-200"}`}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`border p-3 rounded w-1/2 outline-none
            ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-200"}`}
        >
          <option value="General">General</option>
          <option value="Work">Work</option>
          <option value="Study">Study</option>
          <option value="Personal">Personal</option>
        </select>
      </div>

      {/* Add Todo (disabled < 3 chars) */}
      <button
        onClick={handleAdd}
        disabled={!canAddTodo}
        className={`px-4 py-2 rounded transition
          ${!canAddTodo ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-blue-500 text-white hover:opacity-90"}`}
      >
        Add Todo
      </button>
    </div>
  );
};

export default TodoInput;
