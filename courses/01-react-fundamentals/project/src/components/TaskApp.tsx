import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import TaskList from "./TaskList";
import type { Task } from "./TaskList";
import FilterBar from "./FilterBar";

interface TaskAppProps {
  tasks?: Task[];
  setTasks?: Dispatch<SetStateAction<Task[]>>;
  showFilterBar?: boolean;
}

export default function TaskApp({
  tasks = [],
  setTasks,
  showFilterBar = false,
}: TaskAppProps) {
  const [filter, setFilter] = useState<
    "all" | "active" | "completed"
  >("all");

  const [sortOrder, setSortOrder] = useState<
    "recent" | "highToLow" | "lowToHigh" | "alphabetical"
  >("recent");

  const [editingId, setEditingId] = useState<
    string | number | null
  >(null);

  const handleToggle = (id: string | number) => {
    if (!setTasks) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const handleDelete = (id: string | number) => {
    if (!setTasks) return;

    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  };

  const handleUpdateTask = (
    id: string | number,
    updates: {
      title: string;
      description: string;
      priority: string;
    }
  ) => {
    if (!setTasks) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, ...updates }
          : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const priorityOrder: Record<string, number> = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortOrder) {
      case "highToLow":
        return (
          priorityOrder[b.priority] -
          priorityOrder[a.priority]
        );

      case "lowToHigh":
        return (
          priorityOrder[a.priority] -
          priorityOrder[b.priority]
        );

      case "alphabetical":
        return a.title.localeCompare(
          b.title,
          undefined,
          {
            sensitivity: "base",
          }
        );

      case "recent":
      default:
        return 0;
    }
  });

  return (
    <section>
      {showFilterBar && (
        <>
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />

          <h2 id="task-count">
            Showing {sortedTasks.length} of {tasks.length} tasks
          </h2>
        </>
      )}

      {sortedTasks.length === 0 ? (
        <p id="filter-empty-message">
          No tasks match this filter
        </p>
      ) : (
        <TaskList
          tasks={sortedTasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onUpdateTask={handleUpdateTask}
          editingId={editingId}
          setEditingId={setEditingId}
        />
      )}
    </section>
  );
}