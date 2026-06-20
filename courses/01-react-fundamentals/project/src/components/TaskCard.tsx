interface TaskCardProps {
  id?: string | number;
  title: string;
  description: string;
  priority: string;
  completed?: boolean;

  category?: string;
  tags?: string[];

  dueDate?: string | number;

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
  dueDate,
  onToggle,
  onDelete,
}: TaskCardProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = dueDate
    ? new Date(dueDate)
    : null;

  if (due) {
    due.setHours(0, 0, 0, 0);
  }

  const isOverdue =
    !!due &&
    due.getTime() < today.getTime() &&
    !completed;

  const isDueToday =
    !!due &&
    due.getTime() === today.getTime();

  const daysUntilDue = due
    ? Math.ceil(
        (due.getTime() -
          today.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const isDueSoon =
    daysUntilDue !== null &&
    daysUntilDue > 0 &&
    daysUntilDue <= 3;

  return (
    <article
      id="task-card"
      data-completed={completed}
      data-overdue={isOverdue}
      style={{
        backgroundColor: completed
          ? "#e5ffe5"
          : isOverdue
          ? "#ffe5e5"
          : "white",
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

      {dueDate && (
        <div id="task-due-date">
          Due:{" "}
          {new Date(
            dueDate
          ).toLocaleDateString()}

          {isOverdue && (
            <span
              style={{
                marginLeft: "8px",
                color: "red",
                fontWeight: "bold",
              }}
            >
              Overdue
            </span>
          )}

          {isDueToday &&
            !completed && (
              <span
                style={{
                  marginLeft: "8px",
                  color: "orange",
                  fontWeight: "bold",
                }}
              >
                Due Today
              </span>
            )}

          {isDueSoon &&
            !isDueToday &&
            !completed && (
              <span
                style={{
                  marginLeft: "8px",
                  color: "blue",
                  fontWeight: "bold",
                }}
              >
                Due Soon
              </span>
            )}
        </div>
      )}

      {onDelete && (
        <button
          onClick={() => {
            const confirmed =
              window.confirm(
                "Are you sure?"
              );

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