import { useQuery } from '@tanstack/react-query';

const usePosts = () =>
  useQuery({
    queryKey: ['posts'],
    queryFn: () =>
      fetch('https://jsonplaceholder.typicode.com/posts').then((r) =>
        r.json()
      ) as Promise<any[]>,
  });

const PostCount = () => {
  const { data = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: () =>
      fetch('https://jsonplaceholder.typicode.com/posts').then((r) =>
        r.json()
      ) as Promise<any[]>,
    select: (data) => data.length,
  });

  return <h2>Posts: {data}</h2>;
};

export const Posts = () => {
  const { data = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: () =>
      fetch('https://jsonplaceholder.typicode.com/posts').then((r) =>
        r.json()
      ) as Promise<any[]>,
  });

  return (
    <>
      <PostCount />
      {data.map((e) => (
        <p key={e.id}>{e.title}</p>
      ))}
    </>
  );
};
