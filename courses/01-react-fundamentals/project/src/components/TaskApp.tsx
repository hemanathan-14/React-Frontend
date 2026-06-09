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
  tasks,
}: TaskAppProps) {
  const count = tasks ? tasks.length : HARDCODED_COUNT;

  return (
    <section>
      <h2 id="task-count">{count} Tasks</h2>
      <TaskList tasks={tasks} />
    </section>
  );
}
