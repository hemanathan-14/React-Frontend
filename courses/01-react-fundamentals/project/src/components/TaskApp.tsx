import { useEffect, useState } from "react";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";
import type { Task } from "./TaskList";

interface TaskAppProps {
  tasks: Task[];
  setTasks?: React.Dispatch<
    React.SetStateAction<Task[]>
  >;
  showForm?: boolean;
  onDelete?: (id: string | number) => void;
  showFilterBar?: boolean;
}

export default function TaskApp({
  tasks,
  setTasks,
  showForm,
  onDelete,
  showFilterBar,
}: TaskAppProps) {
  const [filter, setFilter] = useState<
    "all" | "active" | "completed"
  >("all");

  const [sortOrder, setSortOrder] =
    useState("recent");

  // Challenge 12
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

  // Unique categories
  const categories = [
    ...new Set(
      tasks
        .map((task) => task.category)
        .filter(Boolean)
    ),
  ];

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

  function handleAddTask(task: Task) {
    if (setTasks) {
      setTasks((prev) => [...prev, task]);
    }
  }

  function handleToggle(id: string | number) {
    if (!setTasks) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  }

  function handleUpdateTask(
    id: string | number,
    updates: {
      title: string;
      description: string;
      priority: string;
    }
  ) {
    if (!setTasks) return;

    if (!updates.title.trim()) {
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updates,
            }
          : task
      )
    );

    setEditingId(null);
  }

  // Status filter
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

  // Category filter
  if (
    selectedCategory !==
    "All categories"
  ) {
    filteredTasks = filteredTasks.filter(
      (task) =>
        task.category === selectedCategory
    );
  }

  // Search filter
  filteredTasks = filteredTasks.filter(
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

  // Sort
  const sortedTasks = [
    ...filteredTasks,
  ].sort((a, b) => {
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

    if (sortOrder === "alphabetical") {
      return a.title
        .toLowerCase()
        .localeCompare(
          b.title.toLowerCase()
        );
    }

    return 0;
  });

  return (
    <main>
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
          onClearSearch={() => {
            setSearchText("");
            setDebouncedSearchText("");
          }}
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