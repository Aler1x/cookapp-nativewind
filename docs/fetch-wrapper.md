# Global Fetch Wrapper Documentation

This document explains how to use the global fetch wrapper that automatically handles Clerk authentication and provides additional features like retries, timeouts, and error handling.

## Features

- 🔐 **Automatic Clerk Authentication**: Automatically adds Bearer tokens to requests
- 🔄 **Retry Logic**: Configurable retry attempts with exponential backoff
- ⏱️ **Timeout Support**: Request timeout with abort controller
- 🛡️ **Error Handling**: Comprehensive error handling with typed responses
- 📝 **TypeScript Support**: Full TypeScript support with type safety
- ⚙️ **Configurable**: Global configuration with per-request overrides
- 🎯 **Multiple Usage Patterns**: Hook-based and direct API usage

## Quick Start

### 1. Basic Usage with Hook (Recommended for React Components)

```typescript
import { useApiFetch } from '@/lib/fetch';

function MyComponent() {
  const api = useApiFetch();

  const fetchData = async () => {
    try {
      // GET request with automatic authentication
      const response = await api.get<User[]>('/users');
      console.log(response.data);

      // POST request with data
      const newUser = await api.post<User>('/users', {
        name: 'John Doe',
        email: 'john@example.com'
      });

    } catch (error) {
      console.error('API Error:', error);
    }
  };

  return (
    <button onPress={fetchData}>
      Fetch Data
    </button>
  );
}
```

### 2. Direct API Usage (For Non-React Code)

```typescript
import { api } from '@/lib/fetch';

// Note: This doesn't include automatic authentication
// You need to pass the token manually if needed
async function fetchUsers() {
  try {
    const response = await api.get<User[]>('/users', {
      headers: {
        Authorization: 'Bearer your-token-here',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Configuration

### Global Configuration

Configure the fetch wrapper globally at app startup:

```typescript
import { configureFetch } from '@/lib/fetch';

// Configure once at app startup (e.g., in _layout.tsx)
configureFetch({
  baseUrl: 'https://api.example.com',
  timeout: 15000, // 15 seconds
  retries: 2,
  retryDelay: 500,
  defaultHeaders: {
    'X-App-Version': '1.0.0',
    'X-Platform': 'mobile',
  },
});
```

### Environment Variables

Set your API URL in environment variables:

```bash
# .env
EXPO_PUBLIC_API_URL=https://api.example.com
```

## API Reference

### useApiFetch Hook

The main hook for making authenticated API requests in React components.

```typescript
const api = useApiFetch();

// Available methods:
api.get<T>(endpoint, options?)
api.post<T>(endpoint, data?, options?)
api.put<T>(endpoint, data?, options?)
api.patch<T>(endpoint, data?, options?)
api.delete<T>(endpoint, options?)
api.fetch<T>(endpoint, options) // Custom method/options
```

### Direct API Object

For use outside React components (no automatic authentication):

```typescript
import { api } from '@/lib/fetch';

api.get<T>(endpoint, options?)
api.post<T>(endpoint, data?, options?)
api.put<T>(endpoint, data?, options?)
api.patch<T>(endpoint, data?, options?)
api.delete<T>(endpoint, options?)
```

### Options Interface

```typescript
interface ExtendedRequestInit {
  headers?: Record<string, string>;
  timeout?: number; // Request timeout in ms
  retries?: number; // Number of retry attempts
  retryDelay?: number; // Delay between retries in ms
  skipAuth?: boolean; // Skip automatic authentication
  // ... all standard fetch options
}
```

### Response Interface

```typescript
interface ApiResponse<T> {
  data: T; // Parsed response data
  status: number; // HTTP status code
  statusText: string; // HTTP status text
  headers: Headers; // Response headers
  ok: boolean; // Whether request was successful
}
```

### Error Interface

```typescript
interface ApiError extends Error {
  status?: number; // HTTP status code
  statusText?: string; // HTTP status text
  response?: Response; // Original response object
  data?: any; // Error response data
}
```

## Usage Examples

### 1. GET Request with Type Safety

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

const api = useApiFetch();

const fetchUser = async (userId: string) => {
  try {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data; // TypeScript knows this is User
  } catch (error) {
    if (error.status === 404) {
      console.log('User not found');
    }
    throw error;
  }
};
```

### 2. POST Request with Data

```typescript
const api = useApiFetch();

const createUser = async (userData: Partial<User>) => {
  try {
    const response = await api.post<User>('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Failed to create user:', error.message);
    throw error;
  }
};
```

### 3. Request with Custom Options

```typescript
const api = useApiFetch();

const uploadFile = async (file: FormData) => {
  try {
    const response = await api.post<{ url: string }>('/upload', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 1 minute for file upload
      retries: 1, // Only retry once for uploads
    });
    return response.data.url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};
```

### 4. Skip Authentication

```typescript
const api = useApiFetch();

const getPublicData = async () => {
  try {
    const response = await api.get<PublicData>('/public/data', {
      skipAuth: true, // Don't add authentication header
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch public data:', error);
    throw error;
  }
};
```

### 5. Safe API Fetch (No Throwing)

```typescript
import { safeApiFetch, useApiFetch } from '@/lib/fetch';

const api = useApiFetch();

const fetchUserSafely = async (userId: string) => {
  const result = await safeApiFetch(() => api.get<User>(`/users/${userId}`));

  if (result.isSuccess) {
    console.log('User:', result.data);
  } else {
    console.error('Error:', result.error?.message);
  }
};
```

### 6. Custom Fetch with Full Control

```typescript
import { apiFetch } from '@/lib/fetch';

const customRequest = async () => {
  try {
    const response = await apiFetch<CustomResponse>('/custom-endpoint', {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer custom-token',
        'X-Custom-Header': 'value',
      },
      body: JSON.stringify({ custom: 'data' }),
      timeout: 5000,
      retries: 0, // No retries
    });

    return response.data;
  } catch (error) {
    console.error('Custom request failed:', error);
    throw error;
  }
};
```

## Error Handling

### Error Types

The wrapper handles different types of errors:

1. **Network Errors**: Connection issues, DNS failures
2. **Timeout Errors**: Request exceeds timeout limit
3. **HTTP Errors**: 4xx and 5xx status codes
4. **Parse Errors**: Invalid JSON responses

### Retry Logic

- **Automatic Retries**: Failed requests are automatically retried
- **Exponential Backoff**: Delay increases with each retry attempt
- **Smart Retry**: Only retries on specific error conditions
- **No Retry on Client Errors**: 4xx errors (except 401, 408, 429) are not retried

### Error Handling Best Practices

```typescript
const api = useApiFetch();

const handleApiCall = async () => {
  try {
    const response = await api.get<Data>('/data');
    return response.data;
  } catch (error) {
    // Handle specific error cases
    switch (error.status) {
      case 401:
        // Handle unauthorized - maybe redirect to login
        console.log('User not authenticated');
        break;
      case 403:
        // Handle forbidden
        console.log('Access denied');
        break;
      case 404:
        // Handle not found
        console.log('Resource not found');
        break;
      case 500:
        // Handle server error
        console.log('Server error');
        break;
      default:
        // Handle other errors
        console.log('Unexpected error:', error.message);
    }

    // Re-throw if you want calling code to handle it
    throw error;
  }
};
```

## Integration with Existing Code

### Migrating from useRest

If you're currently using the `useRest` hook, you can easily migrate:

```typescript
// Old way with useRest
const { get, post, isLoading, error } = useRest('/users');

// New way with useApiFetch
const api = useApiFetch();
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await api.get('/users');
    // Handle response.data
  } catch (err) {
    setError(err);
  } finally {
    setIsLoading(false);
  }
};
```

### Using with State Management

```typescript
// With Zustand store
import { create } from 'zustand';
import { useApiFetch } from '@/lib/fetch';

interface UserStore {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    const api = useApiFetch();
    set({ loading: true, error: null });

    try {
      const response = await api.get<User[]>('/users');
      set({ users: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
```

## Best Practices

1. **Use the Hook in Components**: Always use `useApiFetch()` in React components for automatic authentication
2. **Type Your Responses**: Always specify the expected response type for better TypeScript support
3. **Handle Errors Gracefully**: Implement proper error handling for better user experience
4. **Configure Globally**: Set up global configuration once at app startup
5. **Use Safe Fetch for Optional Operations**: Use `safeApiFetch` when you don't want exceptions thrown
6. **Skip Auth When Needed**: Use `skipAuth: true` for public endpoints
7. **Customize Per Request**: Override global settings per request when needed

## Troubleshooting

### Common Issues

1. **Authentication Token Not Added**

   - Make sure you're using `useApiFetch()` hook
   - Check if user is signed in with Clerk
   - Verify Clerk is properly configured

2. **Base URL Not Working**

   - Check `EXPO_PUBLIC_API_URL` environment variable
   - Verify global configuration with `configureFetch()`

3. **Requests Timing Out**

   - Increase timeout in global config or per request
   - Check network connectivity
   - Verify API server is responding

4. **TypeScript Errors**
   - Make sure to specify response types: `api.get<YourType>()`
   - Check that your interfaces match API responses

### Debug Mode

Enable debug logging by adding console logs in development:

```typescript
// Add this to your global config for debugging
configureFetch({
  // ... other config
  defaultHeaders: {
    ...globalConfig.defaultHeaders,
    'X-Debug': __DEV__ ? 'true' : 'false',
  },
});
```

## Migration Guide

### From fetch()

```typescript
// Old way
const response = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(data),
});
const result = await response.json();

// New way
const api = useApiFetch();
const response = await api.post<User>('/users', data);
const result = response.data;
```

### From axios

```typescript
// Old way
import axios from 'axios';
const response = await axios.get('/api/users');
const result = response.data;

// New way
const api = useApiFetch();
const response = await api.get<User[]>('/users');
const result = response.data;
```

This fetch wrapper provides a robust, type-safe, and feature-rich solution for making API requests in your Expo React Native app with automatic Clerk authentication.
