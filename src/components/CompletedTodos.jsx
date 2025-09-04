import React from "react";
import { FaFilePdf, FaImage } from "react-icons/fa";

const CompletedItem = ({ item, onMoveToHistory, onDelete, onImageClick, darkMode }) => {
  const typeLabel = (() => {
    if (!item.files?.length) return "Task";
    const set = new Set(item.files.map(f => (f.isImage ? "Image" : (f.ext === "pdf" ? "PDF" : "Document"))));
    return [...set].join(", ");
  })();

  return (
    <div className={`p-4 rounded-xl shadow border my-2 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className="flex items-center justify-between">
        <div className="font-semibold">{item.todo}</div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:opacity-90"
            onClick={() => onMoveToHistory(item.id)}
          >
            Move to History
          </button>
          <button
            className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:opacity-90"
            onClick={() => onDelete(item.id)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm opacity-90">
        <div><span className="font-medium">Priority: </span>{item.priority}</div>
        <div><span className="font-medium">Type: </span>{typeLabel}</div>
        <div><span className="font-medium">Due Date: </span>{item.dueDate || "—"}</div>
        <div><span className="font-medium">Category: </span>{item.category}</div>
      </div>

      {item.subtasks?.length > 0 && (
        <div className="mt-2">
          <div className="font-medium text-sm mb-1 opacity-90">Subtasks</div>
          <ul className="list-disc ml-5 space-y-1 text-sm">
            {item.subtasks.map((st, i) => (
              <li key={i}>{st.text}</li>
            ))}
          </ul>
        </div>
      )}

      {item.files?.length > 0 && (
        <div className="mt-2 text-sm">
          <div className="font-medium mb-1 opacity-90">Attachments</div>
          <div className="flex flex-col gap-1">
            {item.files.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {file.isImage ? <FaImage /> : (file.ext === "pdf" ? <FaFilePdf /> : <FaFilePdf />)}
                <button
                  className="underline hover:opacity-80"
                  onClick={() => (file.isImage ? onImageClick(file.url) : window.open(file.url, "_blank"))}
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
};

const CompletedTodos = ({ list, onMoveToHistory, onDelete, onImageClick, darkMode }) => {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-2">Completed</h2>
      {list.length === 0 && <p className="opacity-70">No completed todos yet.</p>}
      {list.map((c) => (
        <CompletedItem
          key={c.id}
          item={c}
          onMoveToHistory={onMoveToHistory}
          onDelete={onDelete}
          onImageClick={onImageClick}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
};

export default CompletedTodos;
