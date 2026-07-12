// src/components/AddPostForm.tsx
// Uses RTK Query's useMutation-generated hook (useAddUserMutation)
import { useState, FormEvent } from 'react';
import { useAddUserMutation } from '../api/apiSlice';

export function AddPostForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [addUser, { isLoading, isSuccess, isError, error }] = useAddUserMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    try {
      await addUser({ name, email }).unwrap();
      setName('');
      setEmail('');
    } catch {
      // error state is already surfaced via `isError`/`error`
    }
  };

  return (
    <form data-testid="add-post-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="user-name">Name</label>
        <input
          id="user-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <div>
        <label htmlFor="user-email">Email</label>
        <input
          id="user-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <button type="submit" data-testid="add-post-submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Add User'}
      </button>
      {isSuccess && <p role="status">User added!</p>}
      {isError && (
        <p role="alert">
          {'error' in (error ?? {}) ? String((error as { error: string }).error) : 'Something went wrong.'}
        </p>
      )}
    </form>
  );
}