import { useGetPostsQuery } from '../api/apiSlice';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setSortBy, setFilterUserId, SortBy } from '../store/slices/filtersSlice';

export default function PostsWithFilters() {
  const { data: posts, isLoading, isError } = useGetPostsQuery();
  const { sortBy, filterUserId } = useAppSelector((state) => state.filters);
  const dispatch = useAppDispatch();

  const filtered = (posts ?? [])
    .filter((post) => (filterUserId ? post.userId === filterUserId : true))
    .slice()
    .sort((a, b) => (sortBy === 'newest' ? b.id - a.id : a.id - b.id));

  return (
    <div data-testid="posts-with-filters">
      <div data-testid="filter-controls">
        <label htmlFor="sort-select">Sort</label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value as SortBy))}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>

        <button type="button" onClick={() => dispatch(setFilterUserId(null))}>
          All
        </button>
      </div>

      {isLoading && <p>Loading posts...</p>}
      {isError && <p role="alert">Failed to load posts.</p>}

      <ul>
        {filtered.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
