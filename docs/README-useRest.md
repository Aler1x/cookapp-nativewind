# useRest Hook

A custom React hook for performing REST API operations in your Expo React Native application.

## Features

- Simple API for common REST operations (GET, POST, PUT, PATCH, DELETE)
- Typed responses with TypeScript generics
- Built-in loading and error states
- Configurable headers and base URL

## Installation

No additional installation required. The hook uses the native `fetch` API.

## Usage

```tsx
import { useRest } from '~/lib/useRest';

// Basic usage
function MyComponent() {
  const { get, getById, post, put, patch, delete: deleteItem, isLoading, error } = useRest('/items');
  
  // Get all items
  const fetchItems = async () => {
    const response = await get<Item[]>();
    if (response.data) {
      // Use response.data
    }
  };
  
  // Get item by ID
  const fetchItemById = async (id: string) => {
    const response = await getById<Item>(id);
    // Use response.data
  };
  
  // Create new item
  const createItem = async (data: ItemInput) => {
    const response = await post<Item>(data);
    // Use response.data
  };
  
  // Update item
  const updateItem = async (id: string, data: ItemInput) => {
    const response = await put<Item>(id, data);
    // Use response.data
  };
  
  // Partially update item
  const patchItem = async (id: string, data: Partial<ItemInput>) => {
    const response = await patch<Item>(id, data);
    // Use response.data
  };
  
  // Delete item
  const removeItem = async (id: string) => {
    const response = await deleteItem<Item>(id);
    // Handle deletion
  };
  
  // Access loading state
  if (isLoading) {
    return <LoadingIndicator />;
  }
  
  // Handle errors
  if (error) {
    return <ErrorComponent message={error.message} />;
  }
  
  return (
    // Your component JSX
  );
}
```

## API

### useRest(endpoint, options)

Creates a REST API client for the specified endpoint.

#### Parameters

- `endpoint` (string): The API endpoint (e.g., '/users')
- `options` (object, optional): Configuration options
  - `headers` (object, optional): Custom headers
  - `baseUrl` (string, optional): Custom base URL (defaults to EXPO_PUBLIC_API_ENDPOINT)

#### Returns

Object with the following properties and methods:

- `get<T>()`: Get all resources
- `getById<T>(id)`: Get a single resource by ID
- `post<T>(data)`: Create a new resource
- `put<T>(id, data)`: Update a resource
- `patch<T>(id, data)`: Partially update a resource
- `delete<T>(id)`: Delete a resource
- `isLoading` (boolean): Current loading state
- `error` (Error | null): Current error state

All methods return a `Promise<RestResponse<T>>` with the following shape:

```ts
{
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}
```

## Configuration

The hook uses the `EXPO_PUBLIC_API_ENDPOINT` environment variable for the base URL. Make sure this is set in your `.env` file.

## Example

See `useRestExample.tsx` for a complete usage example. 