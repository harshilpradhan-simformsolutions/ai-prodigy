import { useEffect } from 'react';
import { Button } from '@mantine/core';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const ActiveUsers = () => {
  const client = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ['user'],
    queryFn: () =>
      fetch('https://jsonplaceholder.typicode.com/users').then((e) =>
        e.json()
      ) as Promise<any[]>,

    // Side effects
    onSuccess: (data) => console.log('success'),
    onError: () => console.log('Error'),
    onSettled: () => console.log('Finished'),
  });

  return (
    <>
      <Button onClick={() => client.invalidateQueries(['users'])}>
        Refresh
      </Button>
      {data.map((item) => (
        <p key={item.id}>{item.name}</p>
      ))}
    </>
  );
};
