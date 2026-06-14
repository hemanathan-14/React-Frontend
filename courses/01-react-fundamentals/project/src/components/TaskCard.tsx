interface TaskCardProps {
  title: string
  description: string
  priority: string
  completed?: boolean
  onToggle?: (id: string | number) => void
  taskId?: string | number
  onDelete?: (id: string | number) => void
}

export default function TaskCard({
  title,
  description,
  priority,
  completed = false,
  onToggle,
  taskId,
  onDelete,
}: TaskCardProps) {
  const handleDelete=()=>{
    if(window.confirm("Are you sure?")){
      onDelete?.(taskId!)
    }
  }
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

      <h2
        style={{
          textDecoration: completed ? "line-through" : "none",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          textDecoration: completed ? "line-through" : "none",
        }}
      >
        {description}
      </p>

      <p>Priority: {priority}</p>
      {onDelete && (
        <button onClick={handleDelete}>
          Delete
        </button>
      )}
    </article>
  )
}