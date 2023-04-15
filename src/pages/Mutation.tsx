import { TextInput, Button } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useState } from 'react';

const useForm = () => {
  const [state, setState] = useState('');

  return [
    state,
    {
      value: state,
      onChange: (e: ChangeEvent<HTMLInputElement>) => setState(e.target.value),
    },
  ] as const;
};

export const Mutation = () => {
  const [email, emailProps] = useForm();
  const [username, usernameProps] = useForm();

  // Access query client instance passed through provider.
  const client = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (_: { username: string; email: string }) => {
      return new Promise((resolve) => setTimeout(resolve, 1000));
    },
    // For optimistic updates
    onMutate: (variables) => {
      // Getting and Setting data to and from cache
      // Returns data for users key
      const data = client.getQueryData(['users']);

      // Set query data to users
      client.setQueryData<any[]>(['users'], (prev) => {
        if (!prev) return [];

        return [...prev, variables];
      });
    },
    onSuccess: () => {
      // Refetch all queries starting with user
      client.invalidateQueries(['users']);

      // Refetch all the queries having observers > 0
      client.invalidateQueries();
    },
  });

  return (
    <>
      <TextInput {...usernameProps} />
      <TextInput {...emailProps} />
      <Button
        onSubmit={() =>
          mutate({
            email,
            username,
          })
        }
      >
        Submit
      </Button>
    </>
  );
};
