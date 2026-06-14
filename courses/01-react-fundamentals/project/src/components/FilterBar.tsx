interface FilterBarProps{
  filter: "all" | "active" | "completed";
  onFilterChange:(
    filter:"all"|"active"|"completed"
  )=>void;




sortOrder: "recent" | "highToLow" | "lowToHigh" | "alphabetical";
  onSortChange: (
    sort: "recent" | "highToLow" | "lowToHigh" | "alphabetical"
  ) => void;
}

export default function FilterBar({
  filter,
  onFilterChange,
  sortOrder,
  onSortChange,
}: FilterBarProps) {
  return (
    <div id="filter-bar">
      <button
        data-active={filter === "all"}
        onClick={() => onFilterChange("all")}
      >
        All
      </button>

      <button
        data-active={filter === "active"}
        onClick={() => onFilterChange("active")}
      >
        Active
      </button>

      <button
        data-active={filter === "completed"}
        onClick={() => onFilterChange("completed")}
      >
        Completed
      </button>

      <select
        id="sort-order"
        value={sortOrder}
        onChange={(e) =>
          onSortChange(
            e.target.value as
              | "recent"
              | "highToLow"
              | "lowToHigh"
              | "alphabetical"
          )
        }
      >
        <option value="recent">Recently Added</option>
        <option value="highToLow">Priority: High to Low</option>
        <option value="lowToHigh">Priority: Low to High</option>
        <option value="alphabetical">Alphabetical</option>
      </select>
    </div>
  );
}