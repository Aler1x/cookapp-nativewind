import type { AuthResponse } from '~/types';

export async function signIn(email: string, password: string) {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_ENDPOINT}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data: AuthResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signUp(email: string, password: string) {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_ENDPOINT}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data: AuthResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
} 
