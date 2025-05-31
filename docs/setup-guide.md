# Fetch Wrapper Setup Guide

This guide will help you set up and configure the global fetch wrapper in your Expo React Native app.

## 1. Environment Configuration

First, make sure your API URL is configured in your environment variables:

```bash
# .env
EXPO_PUBLIC_API_URL=https://your-api-domain.com/api
```

## 2. Global Configuration (Optional)

Add global configuration in your app's root layout file (`app/_layout.tsx`):

```typescript
import { configureFetch } from '@/lib/fetch';

// Add this inside your root component, before rendering
useEffect(() => {
  // Configure the fetch wrapper globally
  configureFetch({
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
    timeout: 30000, // 30 seconds
    retries: 3,
    retryDelay: 1000,
    defaultHeaders: {
      'X-App-Version': '1.0.0',
      'X-Platform': Platform.OS,
    },
  });
}, []);
```

## 3. Basic Usage in Components

```typescript
import { useApiFetch } from '@/lib/fetch';

export function MyComponent() {
  const api = useApiFetch();

  const fetchData = async () => {
    try {
      // This automatically includes Clerk authentication
      const response = await api.get<YourDataType>('/your-endpoint');
      console.log(response.data);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  return (
    // Your component JSX
  );
}
```

## 4. Type Definitions

Create type definitions for your API responses in `types/api.ts`:

```typescript
// types/api.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## 5. Error Handling

Set up global error handling (optional):

```typescript
// lib/errorHandler.ts
import { ApiError } from '@/lib/fetch';

export function handleApiError(error: ApiError) {
  switch (error.status) {
    case 401:
      // Handle unauthorized - redirect to login
      break;
    case 403:
      // Handle forbidden
      break;
    case 404:
      // Handle not found
      break;
    case 500:
      // Handle server error
      break;
    default:
      // Handle other errors
      console.error('API Error:', error.message);
  }
}
```

## 6. Testing the Setup

Use the example component to test your setup:

```typescript
// Import and use the FetchExample component
import { FetchExample } from '@/components/examples/FetchExample';

// Add it to one of your screens to test
export default function TestScreen() {
  return <FetchExample />;
}
```

## 7. Common Patterns

### Loading States

```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await api.get('/data');
    // Handle success
  } catch (error) {
    // Handle error
  } finally {
    setLoading(false);
  }
};
```

### With State Management (Zustand)

```typescript
import { create } from 'zustand';
import { useApiFetch } from '@/lib/fetch';

interface Store {
  data: any[];
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

export const useStore = create<Store>((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchData: async () => {
    const api = useApiFetch();
    set({ loading: true, error: null });

    try {
      const response = await api.get('/data');
      set({ data: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
```

## 8. Troubleshooting

### Common Issues

1. **"useAuth must be used within ClerkProvider"**

   - Make sure Clerk is properly set up in your app
   - Ensure you're using `useApiFetch()` inside a React component

2. **Base URL not working**

   - Check your `EXPO_PUBLIC_API_URL` environment variable
   - Verify the URL format (should not end with `/`)

3. **Authentication not working**

   - Ensure user is signed in with Clerk
   - Check if the token is being generated correctly

4. **TypeScript errors**
   - Make sure to specify response types: `api.get<YourType>()`
   - Check that your interfaces match the API responses

### Debug Mode

Add debug logging in development:

```typescript
if (__DEV__) {
  configureFetch({
    defaultHeaders: {
      'X-Debug': 'true',
    },
  });
}
```

## Next Steps

1. Read the full documentation: `docs/fetch-wrapper.md`
2. Check out the example component: `components/examples/FetchExample.tsx`
3. Start using the fetch wrapper in your components
4. Configure error handling and loading states as needed

The fetch wrapper is now ready to use! It will automatically handle Clerk authentication, retries, timeouts, and provide type-safe API calls throughout your app.
