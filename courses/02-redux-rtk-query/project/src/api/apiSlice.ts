import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { mockApi } from './mockServer';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface NewUser {
  name: string;
  email: string;
}

export interface Post {
  id: number;
  userId: string;
  title: string;
  body?: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),
  tagTypes: ['User', 'Post'],
  endpoints: (builder) => ({
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
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'User' as const,
                id,
              })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    addUser: builder.mutation<User, NewUser>({
      queryFn: async (newUser) => {
        try {
          const createdUser = await mockApi.addUser(newUser);
          return { data: createdUser };
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
      invalidatesTags: [{ type: 'User', id: 'LIST' }],

      async onQueryStarted(newUser, { dispatch, queryFulfilled }) {
        const tempId = `temp-${Date.now()}`;

        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getUsers', undefined, (draft) => {
            draft.push({ id: tempId, ...newUser });
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    getPosts: builder.query<Post[], void>({
      queryFn: async () => {
        try {
          const users = await mockApi.getUsers();
          const posts: Post[] = users.map((u, idx) => ({
            id: idx + 1,
            userId: u.id,
            title: `${u.name}'s first post`,
            body: `This is a sample post written by ${u.name}.`,
          }));
          return { data: posts };
        } catch (error: unknown) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error:
                error instanceof Error
                  ? error.message
                  : 'Failed to fetch posts',
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Post' as const, id })),
              { type: 'Post', id: 'LIST' },
            ]
          : [{ type: 'Post', id: 'LIST' }],
    }),

    getPostById: builder.query<Post, number>({
      queryFn: async (id) => {
        try {
          const users = await mockApi.getUsers();
          const posts: Post[] = users.map((u, idx) => ({
            id: idx + 1,
            userId: u.id,
            title: `${u.name}'s first post`,
            body: `This is a sample post written by ${u.name}.`,
          }));
          const post = posts.find((p) => p.id === id);
          if (!post) {
            return {
              error: { status: 'CUSTOM_ERROR', error: `Post ${id} not found` },
            };
          }
          return { data: post };
        } catch (error: unknown) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error:
                error instanceof Error
                  ? error.message
                  : 'Failed to fetch post',
            },
          };
        }
      },
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useGetPostsQuery,
  useGetPostByIdQuery,
} = apiSlice;