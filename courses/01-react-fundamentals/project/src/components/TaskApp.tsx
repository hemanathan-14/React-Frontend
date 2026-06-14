import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import TaskList from "./TaskList";
import type { Task } from "./TaskList";
import FilterBar from "./FilterBar";

interface TaskAppProps {
  tasks?: Task[];
  setTasks?: Dispatch<SetStateAction<Task[]>>;
  showFilterBar?:boolean;
}

export default function TaskApp({
  tasks = [],
  setTasks,
  showFilterBar=false,
}: TaskAppProps) {
  const [filter,setFilter]=useState<
    "all"|"active"|"completed">("all");

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

  const handleDelete=(id : string |number)=>{
    if (!setTasks) return;
    setTasks((prev)=>
      prev.filter((task)=>task.id !== id)
    );
  };
  
  const filteredTasks = tasks.filter((task) => {
  if (filter === "active") return !task.completed;
  if (filter === "completed") return task.completed;
  return true;
});


  return (
    <section>
      {showFilterBar && (
        <>
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
          />

          <h2 id="task-count">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </h2>
        </>
      )}

      {filteredTasks.length === 0 ? (
        <p id="filter-empty-message">
          No tasks match this filter
        </p>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      )}
    </section>
  );
}