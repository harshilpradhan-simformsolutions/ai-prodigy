import { Button, Title } from '@mantine/core';
import { useEffect, useReducer, useState } from 'react';

const useUsers = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((r) => r.json())
      .then(setData);
  }, []);

  return data;
};

const Users = () => {
  const data = useUsers();

  return (
    <>
      {data.map((item) => (
        <p key={item.id}>{item.name}</p>
      ))}
    </>
  );
};

const UserCount = () => {
  const users = useUsers();

  return <p>Users: {users.length}</p>;
};

export const Home = () => {
  const [key, refresh] = useReducer((x) => x + 1, 0);

  return (
    <>
      <Button onClick={refresh}>Refresh</Button>
      <Title>Fetching without React Query</Title>
      {/* <UserCount /> */}
      <Users key={key} />
    </>
  );
};
