import { useGetPostByIdQuery } from '../api/apiSlice';

interface PostDetailProps {
  postId?: number;
}

export default function PostDetail({ postId }: PostDetailProps) {
  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useGetPostByIdQuery(postId as number, { skip: !postId });

  if (!postId) {
    return <div data-testid="post-detail">No post selected.</div>;
  }

  if (isLoading) {
    return (
      <div data-testid="post-detail-loading" data-testid-parent="post-detail">
        Loading post...
      </div>
    );
  }

  if (isError) {
    const message =
      error && typeof error === 'object' && 'error' in error
        ? String((error as { error: string }).error)
        : 'Failed to load post.';
    return (
      <div data-testid="post-detail-error" data-testid-parent="post-detail">
        {message}
      </div>
    );
  }

  return (
    <div data-testid="post-detail">
      <h2>{post?.title}</h2>
      <p>{post?.body}</p>
    </div>
  );
}
