import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { generateClient } from "aws-amplify/data";
import { Heading, Divider } from '@aws-amplify/ui-react';
// @ts-ignore
import { TodoCreateForm } from './ui-components';

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);


  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (

    <Authenticator  variation="modal" hideSignUp>
      {({ signOut, user }) => (
        <main>
          <Heading
            width='30vw'
            level={2}
            isTruncated={false}
          >
            Welcome To My App
          </Heading>
          <Divider size="large" orientation="horizontal" />
          <h1>{user?.signInDetails?.loginId}'s todos</h1>
         {/* <button onClick={createTodo}>+ new</button> */}
          <ul>
            {todos.map((todo) => (
              <li
                onClick={() => deleteTodo(todo.id)}
                key={todo.id}>
                {todo.content}</li>
            ))}
          </ul>
          <TodoCreateForm

            overrides={{
              content: {
                variation: 'default',
                label: 'New:'
              }
            }} />
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
