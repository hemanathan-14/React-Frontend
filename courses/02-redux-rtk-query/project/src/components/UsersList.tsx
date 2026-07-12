import { useGetUsersQuery } from '../api/apiSlice';
import ErrorDisplay from './ErrorDisplay';

const UsersList = () => {
  const { data, isLoading, isError, error, refetch } = useGetUsersQuery();

  if (isLoading) {
    return <div data-testid="users-loading">Loading users...</div>;
  }

  if (isError) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  return (
    <div data-testid="users-list">
      {data?.map((user) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default UsersList;