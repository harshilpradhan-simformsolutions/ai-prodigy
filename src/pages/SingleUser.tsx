import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export const SingleUser = () => {
  const { id } = useParams();
  const { data } = useQuery({
    // This should be treated as a dependency array
    queryKey: ['user', id],
    queryFn: () =>
      fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then((r) =>
        r.json()
      ),
    enabled: !!id,
  });

  if (!data) return null;

  return <>{JSON.stringify(data)}</>;
};
