import { useStripe } from '@stripe/stripe-react-native';
import { Platform } from 'react-native';
import { API_ENDPOINTS_PREFIX } from './constants';

export interface PaymentMethodResult {
  success: boolean;
  paymentMethod?: any;
  error?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  priceId: string; // Stripe Price ID
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'premium',
    name: 'Premium',
    amount: 549, // $5.49 in cents
    currency: 'usd',
    interval: 'month',
    priceId: 'price_your_monthly_price_id', // Replace with actual Stripe Price ID
  },
  {
    id: 'premium-annual',
    name: 'Premium Annual',
    amount: 5599, // $55.99 in cents
    currency: 'usd',
    interval: 'year',
    priceId: 'price_your_yearly_price_id', // Replace with actual Stripe Price ID
  },
];

export const usePaymentService = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const createPaymentMethod = async (): Promise<PaymentMethodResult> => {
    try {
      // This would typically involve calling your backend to create a payment intent
      const response = await fetch(`${API_ENDPOINTS_PREFIX.node}/stripe/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 549, // $5.49 in cents
          currency: 'usd',
        }),
      });

      const { client_secret } = await response.json();

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'CookApp',
        paymentIntentClientSecret: client_secret,
        defaultBillingDetails: {
          name: 'Customer Name',
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        return { success: false, error: presentError.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Payment failed' };
    }
  };

  const createSubscription = async (planId: string): Promise<PaymentMethodResult> => {
    try {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan) {
        return { success: false, error: 'Invalid plan selected' };
      }

      // Call your backend to create a subscription
      const response = await fetch(`${API_ENDPOINTS_PREFIX.node}/stripe/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
        }),
      });

      const { client_secret, subscription_id } = await response.json();

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'CookApp',
        paymentIntentClientSecret: client_secret,
        defaultBillingDetails: {
          name: 'Customer Name',
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        return { success: false, error: presentError.message };
      }

      return { success: true, paymentMethod: { subscriptionId: subscription_id } };
    } catch (error) {
      return { success: false, error: 'Subscription creation failed' };
    }
  };

  return {
    createPaymentMethod,
    createSubscription,
  };
}; 