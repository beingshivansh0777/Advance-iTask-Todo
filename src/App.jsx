import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react"; // ⬅ useUser import
import Layout from "./components/Layout"; 
import Header from "./components/Header";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import CompletedTodos from "./components/CompletedTodos";
import HistoryTodos from "./components/HistoryTodos";
import ProgressBar from "./components/ProgressBar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FaArrowLeft } from "react-icons/fa";

const App = () => {
  const { user } = useUser(); // ⬅ Current user
  const [darkMode, setDarkMode] = useState(false);
  const [todos, setTodos] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [history, setHistory] = useState([]);
  const [todo, setTodo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("low");
  const [category, setCategory] = useState("General");
  const [subtasks, setSubtasks] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [previewImage, setPreviewImage] = useState(null);
  const [historyDate, setHistoryDate] = useState("");
  const [historySort, setHistorySort] = useState("date-desc");

  // ⬅ Dynamic Keys per User
  const todosKey = user ? `todos_${user.id}` : "todos";
  const completedKey = user ? `completed_${user.id}` : "completed";
  const historyKey = user ? `history_${user.id}` : "history";

  // LocalStorage Load (on user change)
  useEffect(() => {
    if (!user) return;
    const lsTodos = localStorage.getItem(todosKey);
    const lsCompleted = localStorage.getItem(completedKey);
    const lsHistory = localStorage.getItem(historyKey);
    setTodos(lsTodos ? JSON.parse(lsTodos) : []);
    setCompleted(lsCompleted ? JSON.parse(lsCompleted) : []);
    setHistory(lsHistory ? JSON.parse(lsHistory) : []);
  }, [user]); // ⬅ run when user changes

  // LocalStorage Save Helpers
  const saveTodos = (list) => localStorage.setItem(todosKey, JSON.stringify(list));
  const saveCompleted = (list) => localStorage.setItem(completedKey, JSON.stringify(list));
  const saveHistory = (list) => localStorage.setItem(historyKey, JSON.stringify(list));

  // Add Todo
  const handleAdd = () => {
    if (todo.trim().length < 3) return;
    const newTodo = {
      id: uuidv4(),
      todo: todo.trim(),
      isCompleted: false,
      dueDate,
      priority,
      category,
      subtasks,
      files: selectedFiles,
      createdAt: new Date().toISOString(),
    };
    const list = [...todos, newTodo];
    setTodos(list);
    saveTodos(list);
    setTodo("");
    setSubtasks([]);
    setSelectedFiles([]);
    setDueDate("");
    setPriority("low");
    setCategory("General");
  };

  // Edit Todo
  const handleEdit = (id) => {
    const t = todos.find((item) => item.id === id);
    if (!t) return;
    setTodo(t.todo);
    setDueDate(t.dueDate || "");
    setPriority(t.priority || "low");
    setCategory(t.category || "General");
    setSubtasks(t.subtasks || []);
    setSelectedFiles(t.files || []);
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  // Delete Active Todo
  const handleDeleteActive = (id) => {
    const newTodos = todos.filter((t) => t.id !== id);
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  // Complete Todo
  const handleComplete = (id) => {
    const t = todos.find(item => item.id === id);
    if (!t) return;
    const remaining = todos.filter(item => item.id !== id);
    setTodos(remaining);
    saveTodos(remaining);
    const comp = { ...t, isCompleted: true, completedAt: new Date().toISOString() };
    const newCompleted = [comp, ...completed];
    setCompleted(newCompleted);
    saveCompleted(newCompleted);
  };

  // Completed → History
  const moveCompletedToHistory = (id) => {
    const item = completed.find(c => c.id === id);
    if (!item) return;
    const rest = completed.filter(c => c.id !== id);
    setCompleted(rest);
    saveCompleted(rest);
    const newHistory = [{ ...item }, ...history];
    setHistory(newHistory);
    saveHistory(newHistory);
  };

  // Delete Completed
  const deleteCompletedItem = (id) => {
    const rest = completed.filter(c => c.id !== id);
    setCompleted(rest);
    saveCompleted(rest);
  };

  // Drag Drop Move
  const moveTodo = (fromIndex, toIndex) => {
    const updated = [...todos];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setTodos(updated);
    saveTodos(updated);
  };

  // Filtered Todos
  const filteredTodos = todos.filter(item => {
    if (filter === "pending") return !item.isCompleted;
    return true;
  });

  // Progress
  const completedCount = completed.length + history.length;
  const totalCount = todos.length + completed.length + history.length;
  const progress = totalCount ? (completedCount / totalCount) * 100 : 0;

  // History Sort + Filter
  const matchesDate = (iso, ymd) => {
    if (!ymd) return true;
    const d = new Date(iso);
    return d.toISOString().split("T")[0] === ymd;
  };

  const sortedFilteredHistory = [...history]
    .filter(h => matchesDate(h.completedAt, historyDate))
    .sort((a, b) => {
      if (historySort === "date-asc") return new Date(a.completedAt) - new Date(b.completedAt);
      if (historySort === "date-desc") return new Date(b.completedAt) - new Date(a.completedAt);
      const order = { low: 0, medium: 1, high: 2 };
      if (historySort === "priority-asc") return order[a.priority] - order[b.priority];
      if (historySort === "priority-desc") return order[b.priority] - order[a.priority];
      return 0;
    });

  // Image Preview
  const handleImageClick = (url) => setPreviewImage(url);
  const closePreview = () => setPreviewImage(null);

  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
      {/* Login se pehle */}
      <SignedOut>
        <Header darkMode={darkMode} />
      </SignedOut>

      {/* Login ke baad */}
      <SignedIn>
        {previewImage && (
          <div className="fixed inset-0 bg-black/90 flex flex-col justify-center items-center z-50">
            <button className="text-white mb-4 flex items-center gap-2" onClick={closePreview}>
              <FaArrowLeft /> Back
            </button>
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[80%] rounded" />
          </div>
        )}

        <DndProvider backend={HTML5Backend}>
          <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-transparent text-black"} relative z-10`}>
            <div className="max-w-6xl mx-auto p-5 flex flex-col gap-8">

              <TodoInput
                darkMode={darkMode}
                todo={todo} setTodo={setTodo}
                dueDate={dueDate} setDueDate={setDueDate}
                priority={priority} setPriority={setPriority}
                category={category} setCategory={setCategory}
                subtasks={subtasks} setSubtasks={setSubtasks}
                selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles}
                handleAdd={handleAdd}
              />

              {/* Filter Buttons */}
              <div className="flex gap-2 mt-4">
                <button onClick={() => setFilter("pending")} className={`px-3 py-1 rounded ${filter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200 text-black"}`}>Pending</button>
                <button onClick={() => setFilter("all")} className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>All</button>
              </div>

              <TodoList
                todos={filteredTodos}
                moveTodo={moveTodo}
                onEdit={handleEdit}
                onDelete={handleDeleteActive}
                onComplete={handleComplete}
                onPreviewImage={handleImageClick}
                darkMode={darkMode}
                showNoPending={filteredTodos.length === 0 && filter === "pending"}
              />

              <div className="grid md:grid-cols-2 gap-8">
                <ProgressBar progress={progress} />
                <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow p-4 border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={todos.map(t => ({ name: t.todo, status: t.isCompleted ? 1 : 0 }))}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="status" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} isAnimationActive />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-center mt-2 text-sm opacity-80">Todos Chart</p>
                </div>
              </div>

              <CompletedTodos
                list={completed}
                onMoveToHistory={moveCompletedToHistory}
                onDelete={deleteCompletedItem}
                onImageClick={handleImageClick}
                darkMode={darkMode}
              />

              <HistoryTodos
                history={sortedFilteredHistory}
                setHistory={setHistory}
                historyDate={historyDate}
                setHistoryDate={setHistoryDate}
                historySort={historySort}
                setHistorySort={setHistorySort}
                onPreviewImage={handleImageClick}
                darkMode={darkMode}
              />
            </div>
          </div>
        </DndProvider>
      </SignedIn>
    </Layout>
  );
};

export default App;
