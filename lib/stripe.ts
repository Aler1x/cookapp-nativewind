import { loadStripe } from '@stripe/stripe-js';
import { initStripe } from '@stripe/stripe-react-native';

// Initialize Stripe for React Native
export const initializeStripe = async () => {
  await initStripe({
    publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    merchantIdentifier: 'merchant.com.cookapp', // Required for Apple Pay
    urlScheme: 'cookapp-nativewind', // For redirects after payment
  });
};

// Initialize Stripe for Web
export const stripePromise = loadStripe(process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!); 