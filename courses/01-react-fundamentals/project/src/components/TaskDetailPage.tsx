import { useParams, useNavigate } from "react-router-dom";

interface Task {
  id: string | number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  category: string;
  tags: string[];
  dueDate?: string | number;
}

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  let task: Task | undefined;
  try {
    const stored = localStorage.getItem("task-app-tasks");
    if (stored) {
      const tasks: Task[] = JSON.parse(stored);
      task = tasks.find(
        (t) => String(t.id) === String(id)
      );
    }
  } catch {
    // ignore
  }

  return (
    <div id="task-detail-page">
      {task ? (
        <>
          <h1>{task.title}</h1>
          <p>{task.description}</p>
          <p>Priority: {task.priority}</p>
          <p>Category: {task.category}</p>
          {task.dueDate && (
            <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
          )}
          <p>Status: {task.completed ? "Completed" : "Active"}</p>
        </>
      ) : (
        <p>Task not found.</p>
      )}
      <button
        id="task-detail-back"
        onClick={() => navigate("/challenge/21-react-router")}
      >
        Back to list
      </button>
    </div>
  );
}
