import type { Dispatch, SetStateAction } from "react";
import TaskList from "./TaskList";
import type { Task } from "./TaskList";

interface TaskAppProps {
  tasks?: Task[];
  setTasks?: Dispatch<SetStateAction<Task[]>>;
  dispatch?: (action: { type: string; payload?: unknown }) => void;
  showForm?: boolean;
  countFormat?: string;
  showFilterBar?: boolean;
  showStatsPanel?: boolean;
  onDelete?: (id: string | number) => void;
  linkToTaskDetail?: boolean;
}

const HARDCODED_COUNT = 3;

export default function TaskApp({
  tasks =[],
  setTasks,
}: TaskAppProps) {
  const handleToggle = (id: string | number) =>{
    if (!setTasks) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
        ? { ...task,completed:!task.completed}
        :task  
      )
    );
  };

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <section>
      <h2 id="task-count">{completedCount} of {tasks.length} completed</h2>
      <TaskList tasks={tasks} 
      onToggle={handleToggle}
      />
    </section>
  );
}
