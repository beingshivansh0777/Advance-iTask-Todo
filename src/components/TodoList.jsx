import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit, FaFilePdf, FaImage } from "react-icons/fa";
import { motion } from "framer-motion";
import ShareButton from "./ShareButton";

const fileTypeLabelFromFiles = (files = []) => {
  if (!files.length) return "Task";
  const set = new Set(files.map(f => (f.isImage ? "Image" : (f.ext === "pdf" ? "PDF" : "Document"))));
  return [...set].join(", ");
};

const DraggableCard = ({
  todo, index, moveTodo,
  onEdit, onDelete, onComplete, onPreviewImage, darkMode
}) => {
  const [, drag] = useDrag({ type: "TODO", item: { index } });
  const [, drop] = useDrop({
    accept: "TODO",
    hover: (item) => {
      if (item.index !== index) {
        moveTodo(item.index, index);
        item.index = index;
      }
    },
  });

  const typeLabel = fileTypeLabelFromFiles(todo.files);

  return (
    <motion.div
      ref={(node) => drag(drop(node))}
      className={`flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4 my-2 rounded-xl shadow hover:shadow-lg transition-all duration-300 border
        ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "border-orange-100"}`}
      style={!darkMode ? { backgroundColor: "#fff8f0" } : {}}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex-1">
        <div className="font-semibold text-base md:text-lg">{todo.todo}</div>

        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
          <div className="opacity-80">
            <span className="font-medium">Priority: </span>
            <span
              className={
                todo.priority === "high" ? "text-red-400"
                : todo.priority === "medium" ? "text-yellow-400"
                : "text-green-400"
              }
            >
              {todo.priority?.[0]?.toUpperCase() + todo.priority?.slice(1)}
            </span>
          </div>
          <div className="opacity-80"><span className="font-medium">Type: </span>{typeLabel}</div>
          <div className="opacity-80"><span className="font-medium">Due Date: </span>{todo.dueDate || "—"}</div>
          <div className="opacity-80"><span className="font-medium">Category: </span>{todo.category}</div>
        </div>

        {todo.subtasks?.length > 0 && (
          <div className="mt-2">
            <div className="font-medium text-sm mb-1 opacity-90">Subtasks</div>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              {todo.subtasks.map((st, i) => (
                <li key={i}>{st.text}</li>
              ))}
            </ul>
          </div>
        )}

        {todo.files?.length > 0 && (
          <div className="mt-3 text-sm">
            <div className="font-medium mb-1 opacity-90">Attachments</div>
            <div className="flex flex-col gap-1">
              {todo.files.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {file.isImage ? <FaImage /> : (file.ext === "pdf" ? <FaFilePdf /> : <FaFilePdf />)}
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

      <div className="flex items-center gap-2 self-start md:self-center">
        <ShareButton todo={todo} />
        <button onClick={() => onEdit(todo.id)} className="text-blue-400 hover:text-blue-300" title="Edit">
          <FaEdit />
        </button>
        <button onClick={() => onDelete(todo.id)} className="text-red-400 hover:text-red-300" title="Delete">
          <MdDeleteForever />
        </button>
        <input
          type="checkbox"
          checked={false}
          onChange={() => onComplete(todo.id)}
          className="w-5 h-5 accent-green-500"
          title="Mark as completed"
        />
      </div>
    </motion.div>
  );
};

const TodoList = ({
  todos, moveTodo, onEdit, onDelete, onComplete, onPreviewImage, darkMode, showNoPending
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Your Todos</h2>
      {showNoPending && <p className="opacity-70">No Pending Todos</p>}
      {todos.map((t, idx) => (
        <DraggableCard
          key={t.id}
          todo={t}
          index={idx}
          moveTodo={moveTodo}
          onEdit={onEdit}
          onDelete={onDelete}
          onComplete={onComplete}
          onPreviewImage={onPreviewImage}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
};

export default TodoList;
