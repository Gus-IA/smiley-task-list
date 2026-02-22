import { useState, useRef, useEffect } from "react";
import { Plus, Check, Trash2, Circle } from "lucide-react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() },
      ...prev,
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const pending = todos.filter((t) => !t.completed);
  const completed = todos.filter((t) => t.completed);

  return (
    <div className="min-h-screen bg-background flex items-start justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-lg">
        {/* Header */}
        <header className="mb-10">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            Today
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            {pending.length === 0
              ? "All done — enjoy your day ✨"
              : `${pending.length} task${pending.length !== 1 ? "s" : ""} remaining`}
          </p>
        </header>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTodo();
          }}
          className="flex items-center gap-3 mb-8"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new task…"
            className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition-shadow font-body text-sm"
          />
          <button
            type="submit"
            className="shrink-0 w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
            aria-label="Add task"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </form>

        {/* Pending */}
        <ul className="space-y-2">
          {pending.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))}
        </ul>

        {/* Completed */}
        {completed.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">
              Completed
            </h2>
            <ul className="space-y-2">
              {completed.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

function TodoItem({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <li className="group flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 transition-all hover:shadow-sm">
      <button
        onClick={() => onToggle(todo.id)}
        className="shrink-0 w-5 h-5 flex items-center justify-center"
        aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
      >
        {todo.completed ? (
          <Check size={18} className="text-complete" strokeWidth={2.5} />
        ) : (
          <Circle size={18} className="text-muted-foreground/50 group-hover:text-primary transition-colors" />
        )}
      </button>
      <span
        className={`flex-1 text-sm leading-relaxed transition-colors ${
          todo.completed
            ? "line-through text-muted-foreground"
            : "text-foreground"
        }`}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
        aria-label="Delete task"
      >
        <Trash2 size={15} />
      </button>
    </li>
  );
}

export default Index;
