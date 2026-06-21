import {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";
import type { Task } from "./TaskList";
import StatsPanel from "./StatsPanel";
import Button from "./Button";
import { useTheme } from "../contexts/ThemeContext";
import type { TaskAction } from "../reducers/taskReducer";


import {
  addTask,
  updateTask,
  toggleTask,
} from "../reducers/taskActions";



interface TaskAppProps {
  showStatsPanel?: boolean;
  tasks: Task[];
  dispatch?: React.Dispatch<TaskAction>;
  showForm?: boolean;
  onDelete?: (id: string | number) => void;
  showFilterBar?: boolean;
}

export default function TaskApp({
  tasks,
  dispatch,
  showForm,
  onDelete,
  showFilterBar,
  showStatsPanel,
}: TaskAppProps) {
  const [filter, setFilter] = useState<
    "all" | "active" | "completed"
  >("all");

  const [sortOrder, setSortOrder] =
    useState("recent");

  const [selectedCategory, setSelectedCategory] =
    useState("All categories");

  const [searchText, setSearchText] =
    useState("");

  const [
    debouncedSearchText,
    setDebouncedSearchText,
  ] = useState("");

  const [isSearching, setIsSearching] =
    useState(false);

  const [editingId, setEditingId] = useState<
    string | number | null
  >(null);

const categories = useMemo(
  () => [
    ...new Set(
      tasks
        .map((task) => task.category)
        .filter(Boolean)
    ),
  ],
  [tasks]
);

const stats = useMemo(() => {
  const total = tasks.length;

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  const active = total - completed;

  const overdue = tasks.filter(
    (task) =>
      !task.completed &&
      task.dueDate &&
      new Date(task.dueDate) < new Date()
  ).length;

  const completedPercentage =
    total === 0
      ? 0
      : Math.round(
          (completed / total) * 100
        );

  return {
    total,
    completed,
    active,
    overdue,
    completedPercentage,
  };
}, [tasks]);

  useEffect(() => {
    setIsSearching(true);

    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
      setIsSearching(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

const handleAddTask = useCallback(
  (task: Task) => {
    dispatch?.(addTask(task));
  },
  [dispatch]
);

const handleToggle = useCallback(
  (id: string | number) => {
    dispatch?.(toggleTask(id));
  },
  [dispatch]
);

const handleUpdateTask = useCallback(
  (
    id: string | number,
    updates: {
      title: string;
      description: string;
      priority: string;
      dueDate?: string | number;
    }
  ) => {
    if (!updates.title.trim()) {
      return;
    }

    dispatch?.(
      updateTask(id, updates)
    );

    setEditingId(null);
  },
  [dispatch]
);
const handleClearSearch = useCallback(() => {
  setSearchText("");
  setDebouncedSearchText("");
}, []);

const sortedTasks = useMemo(() => {
  let filteredTasks =
    filter === "all"
      ? tasks
      : filter === "active"
      ? tasks.filter(
          (task) => !task.completed
        )
      : tasks.filter(
          (task) => task.completed
        );

  if (
    selectedCategory !==
    "All categories"
  ) {
    filteredTasks =
      filteredTasks.filter(
        (task) =>
          task.category ===
          selectedCategory
      );
  }

  filteredTasks =
    filteredTasks.filter(
      (task) =>
        task.title
          .toLowerCase()
          .includes(
            debouncedSearchText.toLowerCase()
          ) ||
        task.description
          .toLowerCase()
          .includes(
            debouncedSearchText.toLowerCase()
          )
    );

  const priorityValue: Record<
    string,
    number
  > = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  return [...filteredTasks].sort(
    (a, b) => {
      if (sortOrder === "high") {
        return (
          priorityValue[b.priority] -
          priorityValue[a.priority]
        );
      }

      if (sortOrder === "low") {
        return (
          priorityValue[a.priority] -
          priorityValue[b.priority]
        );
      }

      if (sortOrder === "due-date") {
        if (!a.dueDate && !b.dueDate) {
          return 0;
        }

        if (!a.dueDate) {
          return 1;
        }

        if (!b.dueDate) {
          return -1;
        }

        return (
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
        );
      }

      if (
        sortOrder ===
        "alphabetical"
      ) {
        return a.title
          .toLowerCase()
          .localeCompare(
            b.title.toLowerCase()
          );
      }

      return 0;
    }
  );
}, [
  tasks,
  filter,
  selectedCategory,
  debouncedSearchText,
  sortOrder,
]);
  const { theme, toggleTheme } =
  useTheme();

  return (
  <main
    data-theme={theme}
    style={{
      backgroundColor:
        theme === "dark"
          ? "#222"
          : "#ffffff",
      color:
        theme === "dark"
          ? "#ffffff"
          : "#000000",
      minHeight: "100vh",
      padding: "16px",
    }}
  >
    <div
      style={{
        marginBottom: "16px",
      }}
    >
      <Button
        id="theme-toggle"
        onClick={toggleTheme}
      >
        {theme === "light"
          ? "Dark Mode"
          : "Light Mode"}
      </Button>
    </div>

    {showForm && (
      <TaskForm onAddTask={handleAddTask} />
    )}

    {showFilterBar && (
      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        searchText={searchText}
        onSearchChange={setSearchText}
        onClearSearch={handleClearSearch}
        categories={categories}
        selectedCategory={
          selectedCategory
        }
        onCategoryChange={
          setSelectedCategory
        }
      />
    )}

    {isSearching &&
      searchText !==
        debouncedSearchText && (
        <div id="searching-indicator">
          Searching...
        </div>
      )}

    {showStatsPanel && (
      <StatsPanel
        total={stats.total}
        completed={stats.completed}
        active={stats.active}
        overdue={stats.overdue}
        completedPercentage={
          stats.completedPercentage
        }
      />
    )}

    <div id="task-count">
      Showing {sortedTasks.length} of{" "}
      {tasks.length} tasks
    </div>

    {sortedTasks.length === 0 ? (
      <div id="filter-empty-message">
        No tasks found
      </div>
    ) : (
      <TaskList
        tasks={sortedTasks}
        onToggle={handleToggle}
        onDelete={onDelete}
        onUpdateTask={handleUpdateTask}
        editingId={editingId}
        setEditingId={setEditingId}
      />
    )}
  </main>
);
}