import { useRef, useEffect } from "react";

type Filter = "all" | "active" | "completed";

interface FilterBarProps {
  filter?: Filter;
  onFilterChange?: (filter: Filter) => void;

  sortOrder?: string;
  onSortChange?: (value: string) => void;

  searchText?: string;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onClearSearch?: () => void;

  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (value: string) => void;
}

export default function FilterBar({
  filter = "all",
  onFilterChange,
  sortOrder = "recent",
  onSortChange,
  searchText,
  searchQuery,
  onSearchChange,
  onClearSearch,
  categories = [],
  selectedCategory = "All categories",
  onCategoryChange,
}: FilterBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const currentSearch = searchText ?? searchQuery ?? "";

  return (
    <div id="filter-bar">
      <button
        data-active={filter === "all"}
        onClick={() => onFilterChange?.("all")}
      >
        All
      </button>

      <button
        data-active={filter === "active"}
        onClick={() => onFilterChange?.("active")}
      >
        Active
      </button>

      <button
        data-active={filter === "completed"}
        onClick={() => onFilterChange?.("completed")}
      >
        Completed
      </button>

      <select
        id="sort-order"
        value={sortOrder}
        onChange={(e) => onSortChange?.(e.target.value)}
      >
        <option value="recent">Recently Added</option>
        <option value="high">Priority: High to Low</option>
        <option value="low">Priority: Low to High</option>
        <option value="alphabetical">Alphabetical</option>
      </select>

      <select
        id="category-filter"
        value={selectedCategory}
        onChange={(e) => onCategoryChange?.(e.target.value)}
      >
        <option value="All categories">All categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <input
        id="search-input"
        ref={searchInputRef}
        type="text"
        placeholder="Search tasks..."
        value={currentSearch}
        onChange={(e) => onSearchChange?.(e.target.value)}
      />

      {currentSearch && (
        <button id="clear-search" onClick={onClearSearch}>
          Clear search
        </button>
      )}
    </div>
  );
}