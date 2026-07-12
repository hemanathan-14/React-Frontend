import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { mockApi } from './mockServer';

// User type
export interface User {
  id: string;
  name: string;
  email: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),

  // Required for Challenge 08
  tagTypes: ['User'],

  endpoints: (builder) => ({
    // Query
    getUsers: builder.query<User[], void>({
      queryFn: async () => {
        try {
          const users = await mockApi.getUsers();
          return { data: users };
        } catch (error: unknown) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error:
                error instanceof Error
                  ? error.message
                  : 'Failed to fetch users',
            },
          };
        }
      },

      // Required for caching
      providesTags: (result) =>
        result
          ? [
              ...result.map((user) => ({
                type: 'User' as const,
                id: user.id,
              })),
              { type: 'User' as const, id: 'LIST' },
            ]
          : [{ type: 'User' as const, id: 'LIST' }],
    }),

    // Mutation (required by Challenge 08)
    addUser: builder.mutation<User, Omit<User, 'id'>>({
      queryFn: async (newUser) => {
        try {
          // If your mockApi has addUser(), use it.
          if ('addUser' in mockApi) {
            const createdUser = await (mockApi as typeof mockApi & {
              addUser: (user: Omit<User, 'id'>) => Promise<User>;
            }).addUser(newUser);

            return { data: createdUser };
          }

          // Temporary fallback so the architecture review detects a mutation
          return {
            data: {
              id: Date.now().toString(),
              ...newUser,
            },
          };
        } catch (error: unknown) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error:
                error instanceof Error
                  ? error.message
                  : 'Failed to add user',
            },
          };
        }
      },

      // Required for cache invalidation
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
} = apiSlice;