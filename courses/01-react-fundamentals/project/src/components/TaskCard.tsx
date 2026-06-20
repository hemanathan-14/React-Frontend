interface TaskCardProps {
  id?: string | number;
  title: string;
  description: string;
  priority: string;
  completed?: boolean;

  category?: string;
  tags?: string[];

  onToggle?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
}

export default function TaskCard({
  id,
  title,
  description,
  priority,
  completed = false,
  category = "General",
  tags = [],
  onToggle,
  onDelete,
}: TaskCardProps) {
  return (
    <article
      id="task-card"
      data-completed={completed}
      style={{
        backgroundColor: completed ? "#e5ffe5" : "white",
      }}
    >
      {onToggle && (
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(id!)}
        />
      )}

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

      <div id="task-category">
        Category: {category}
      </div>

      <div id="task-tags">
        {tags.map((tag) => (
          <span
            key={tag}
            data-tag={tag}
            className="tag-badge"
            style={{
              display: "inline-block",
              padding: "2px 8px",
              marginRight: "6px",
              borderRadius: "12px",
              backgroundColor: "#eeeeee",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {onDelete && (
        <button
          onClick={() => {
            const confirmed =
              window.confirm("Are you sure?");

            if (confirmed) {
              onDelete(id!);
            }
          }}
        >
          Delete
        </button>
      )}
    </article>
  );
}