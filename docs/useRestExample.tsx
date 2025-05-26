import React, { useEffect, useState } from 'react';
import { Text, View, Button } from 'react-native';
import { useRest } from '../lib/useRest';

// Example data type
type User = {
  id: string;
  name: string;
  email: string;
};

export function UserComponent() {
  const { get, getById, post, put, patch, delete: deleteUser, isLoading, error } = useRest('/users');
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Fetch all users example
  const fetchUsers = async () => {
    const response = await get<User[]>();
    if (response.data) {
      setUsers(response.data);
    }
  };

  // Fetch a user by ID
  const fetchUserById = async (id: string) => {
    const response = await getById<User>(id);
    if (response.data) {
      setCurrentUser(response.data);
    }
  };

  // Create a new user
  const createUser = async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    const response = await post<User>(newUser);
    if (response.data) {
      setUsers([...users, response.data]);
    }
  };

  // Update a user
  const updateUser = async (id: string) => {
    const updatedUser = {
      name: 'Jane Doe',
      email: 'jane@example.com',
    };

    const response = await put<User>(id, updatedUser);
    if (response.data) {
      setUsers(users.map((user) => (user.id === id ? response.data! : user)));
    }
  };

  // Partially update a user
  const patchUser = async (id: string) => {
    const userPatch = {
      name: 'John Updated',
    };

    const response = await patch<User>(id, userPatch);
    if (response.data) {
      setUsers(users.map((user) => (user.id === id ? response.data! : user)));
    }
  };

  // Delete a user
  const removeUser = async (id: string) => {
    const response = await deleteUser<User>(id);
    if (response.data) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  // Example of loading users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View>
      <Text>Users: {users.length}</Text>
      <Button title='Create User' onPress={createUser} />
      {users.map((user) => (
        <View key={user.id}>
          <Text>
            {user.name} ({user.email})
          </Text>
          <Button title='View Details' onPress={() => fetchUserById(user.id)} />
          <Button title='Update' onPress={() => updateUser(user.id)} />
          <Button title='Patch' onPress={() => patchUser(user.id)} />
          <Button title='Delete' onPress={() => removeUser(user.id)} />
        </View>
      ))}

      {currentUser && (
        <View>
          <Text>Selected User:</Text>
          <Text>ID: {currentUser.id}</Text>
          <Text>Name: {currentUser.name}</Text>
          <Text>Email: {currentUser.email}</Text>
        </View>
      )}
    </View>
  );
}
