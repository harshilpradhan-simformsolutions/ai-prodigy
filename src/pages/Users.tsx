import { Button, Title } from '@mantine/core';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

export const Users = () => {
  const client = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () =>
      fetch('https://jsonplaceholder.typicode.com/users').then((e) =>
        e.json()
      ) as Promise<any[]>,
  });

  useEffect(() => {
    console.log('Data Changed');
  }, [data]);

  return (
    <>
      <Button onClick={() => client.invalidateQueries(['users'])}>
        Refresh
      </Button>
      <Title>Fetching with React Query, open Devtools for more info!</Title>
      {data.map((item) => (
        <p key={item.id}>
          <Link
            style={{ textDecoration: 'none', color: 'black' }}
            to={`/users/${item.id}`}
          >
            {item.name}
          </Link>
        </p>
      ))}
    </>
  );
};
