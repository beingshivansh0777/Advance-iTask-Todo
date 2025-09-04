import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShareAlt } from "react-icons/fa";

const ShareButton = ({ todo }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const textBlock = (() => {
    const lines = [];
    lines.push(`Todo: ${todo.todo}`);
    if (todo.subtasks?.length) {
      lines.push("Subtasks:");
      todo.subtasks.forEach((s, i) => lines.push(`  ${i + 1}. ${s.text}`));
    }
    lines.push(`Priority: ${todo.priority}`);
    lines.push(`Due Date: ${todo.dueDate || "—"}`);
    if (todo.category) lines.push(`Category: ${todo.category}`);
    return lines.join("\n");
  })();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textBlock);
      setOpen(false);
      alert("Copied to clipboard!");
    } catch {
      alert("Copy failed. Try manually.");
    }
  };

  const shareEmail = () => {
    const subject = encodeURIComponent("Sharing Todo");
    const body = encodeURIComponent(textBlock);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setOpen(false);
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(textBlock);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
    setOpen(false);
  };

  useEffect(() => {
    function onClick(e) {
      if (open && ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="px-2 py-1 rounded bg-purple-600 text-white text-sm hover:opacity-90"
        title="Share"
      >
        <FaShareAlt />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute right-0 mt-2 w-48 rounded-lg border bg-white text-black shadow z-20"
          >
            <button className="w-full text-left px-3 py-2 hover:bg-black/5" onClick={copyToClipboard}>
              Copy to clipboard
            </button>
            <button className="w-full text-left px-3 py-2 hover:bg-black/5" onClick={shareEmail}>
              Share via Email
            </button>
            <button className="w-full text-left px-3 py-2 hover:bg-black/5" onClick={shareWhatsApp}>
              Share via WhatsApp
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareButton;
