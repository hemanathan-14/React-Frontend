import { useGetUsersQuery } from '../api/apiSlice';

const UsersList = () => {
  const { data, isLoading, isError, error } = useGetUsersQuery();

  if (isLoading) {
    return <div data-testid="users-loading">Loading...</div>;
  }

  if (isError) {
    return (
      <div data-testid="users-error">
        {'status' in (error ?? {})
          ? String((error as { error?: string }).error ?? 'Something went wrong')
          : 'Something went wrong'}
      </div>
    );
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