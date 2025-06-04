import { renderHook, act } from '@testing-library/react-native';
import { useFetch } from '~/hooks/useFetch';

// Mock Clerk
const mockGetToken = jest.fn();
const mockIsSignedIn = jest.fn();

jest.mock('@clerk/clerk-expo', () => ({
  useAuth: () => ({
    getToken: mockGetToken,
    isSignedIn: mockIsSignedIn(),
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe('useFetch Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  it('makes HTTP request without authentication when user is not signed in', async () => {
    mockIsSignedIn.mockReturnValue(false);
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test' }),
      headers: new Map([['content-type', 'application/json']]),
    });

    const { result } = renderHook(() => useFetch());
    
    await act(async () => {
      const response = await result.current('/api/test');
      expect(response).toEqual({ data: 'test' });
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.example.com/api/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      })
    );
    expect(mockGetToken).not.toHaveBeenCalled();
  });

  it('includes authorization header when user is signed in', async () => {
    mockIsSignedIn.mockReturnValue(true);
    mockGetToken.mockResolvedValue('test-token');
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test' }),
      headers: new Map([['content-type', 'application/json']]),
    });

    const { result } = renderHook(() => useFetch());
    
    await act(async () => {
      const response = await result.current('/api/test');
      expect(response).toEqual({ data: 'test' });
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.example.com/api/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer test-token',
        }),
      })
    );
  });

  it('handles full URLs correctly', async () => {
    mockIsSignedIn.mockReturnValue(false);
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'external' }),
      headers: new Map([['content-type', 'application/json']]),
    });

    const { result } = renderHook(() => useFetch());
    
    await act(async () => {
      const response = await result.current('https://external-api.com/data');
      expect(response).toEqual({ data: 'external' });
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://external-api.com/data',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      })
    );
  });

  it('handles non-JSON responses', async () => {
    mockIsSignedIn.mockReturnValue(false);
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => 'plain text response',
      headers: new Map([['content-type', 'text/plain']]),
    });

    const { result } = renderHook(() => useFetch());
    
    await act(async () => {
      const response = await result.current('/api/text');
      expect(response).toBe('plain text response');
    });
  });

  it('preserves custom headers', async () => {
    mockIsSignedIn.mockReturnValue(false);
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test' }),
      headers: new Map([['content-type', 'application/json']]),
    });

    const { result } = renderHook(() => useFetch());
    
    await act(async () => {
      await result.current('/api/test', {
        headers: {
          'Custom-Header': 'custom-value',
        },
      });
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.example.com/api/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Custom-Header': 'custom-value',
        }),
      })
    );
  });

  it('handles HTTP errors gracefully', async () => {
    mockIsSignedIn.mockReturnValue(false);
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({ error: 'Not found' }),
      headers: new Map([['content-type', 'application/json']]),
    });

    const { result } = renderHook(() => useFetch());
    
    await act(async () => {
      const response = await result.current('/api/notfound');
      expect(response).toEqual({ error: 'Not found' });
    });
  });

  it('handles POST requests with body', async () => {
    mockIsSignedIn.mockReturnValue(false);
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
      headers: new Map([['content-type', 'application/json']]),
    });

    const { result } = renderHook(() => useFetch());
    
    await act(async () => {
      const response = await result.current('/api/create', {
        method: 'POST',
        body: JSON.stringify({ name: 'test' }),
      });
      expect(response).toEqual({ success: true });
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.example.com/api/create',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'test' }),
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      })
    );
  });

  it('handles network errors', async () => {
    mockIsSignedIn.mockReturnValue(false);
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useFetch());
    
    await act(async () => {
      try {
        await result.current('/api/test');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Network error');
      }
    });
  });
}); 