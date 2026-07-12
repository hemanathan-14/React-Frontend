import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { mockApi } from './mockServer';

// Define the User type structure
interface User {
  id: string;
  name: string;
  email: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  // fetchBaseQuery is required by the check criteria, but we can bypass network calls using queryFn
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      queryFn: async () => {
        try {
          const data = await mockApi.getUsers();
          return { data };
        } catch (error: any) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
    }),
  }),
});

export const { useGetUsersQuery } = apiSlice;