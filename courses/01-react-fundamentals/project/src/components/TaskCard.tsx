import { useState } from "react";

interface TaskCardProps {
  title: string;
  description: string;
  priority: string;
  completed?: boolean;
  onToggle?: (id: string | number) => void;
  taskId?: string | number;
  onDelete?: (id: string | number) => void;

  onUpdateTask?: (
    id: string | number,
    updates: {
      title: string;
      description: string;
      priority: string;
    }
  ) => void;

  editingId?: string | number | null;
  setEditingId?: (id: string | number | null) => void;
}

export default function TaskCard({
  title,
  description,
  priority,
  completed = false,
  onToggle,
  taskId,
  onDelete,
  onUpdateTask,
  editingId,
  setEditingId,
}: TaskCardProps) {
  const isEditing = editingId === taskId;

  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] =
    useState(description);
  const [editPriority, setEditPriority] =
    useState(priority);

  const handleDelete = () => {
    if (window.confirm("Are you sure?")) {
      onDelete?.(taskId!);
    }
  };

  const handleEdit = () => {
    setEditTitle(title);
    setEditDescription(description);
    setEditPriority(priority);
    setEditingId?.(taskId!);
  };

  const handleCancel = () => {
    setEditTitle(title);
    setEditDescription(description);
    setEditPriority(priority);
    setEditingId?.(null);
  };

  const handleSave = () => {
    if (!editTitle.trim()) return;

    onUpdateTask?.(taskId!, {
      title: editTitle.trim(),
      description: editDescription,
      priority: editPriority,
    });

    setEditingId?.(null);
  };

  return (
    <article
      id="task-card"
      data-completed={completed}
      style={{
        backgroundColor: completed ? "#e5e7eb" : "white",
      }}
    >
      {onToggle && (
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(taskId!)}
        />
      )}

      {isEditing ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) =>
              setEditTitle(e.target.value)
            }
          />

          <textarea
            value={editDescription}
            onChange={(e) =>
              setEditDescription(e.target.value)
            }
          />

          <select
            value={editPriority}
            onChange={(e) =>
              setEditPriority(e.target.value)
            }
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button onClick={handleSave}>
            Save
          </button>

          <button onClick={handleCancel}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <h2
            style={{
              textDecoration: completed
                ? "line-through"
                : "none",
            }}
          >
            {title}
          </h2>

          <p
            style={{
              textDecoration: completed
                ? "line-through"
                : "none",
            }}
          >
            {description}
          </p>

          <p>Priority: {priority}</p>

          <button onClick={handleEdit}>
            Edit
          </button>

          {onDelete && (
            <button onClick={handleDelete}>
              Delete
            </button>
          )}
        </>
      )}
    </article>
  );
}