import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PaymentStore {
  isProcessing: boolean;
  isPremium: boolean;
  subscriptionId: string | null;
  currentPlan: 'free' | 'premium' | 'premium-annual';
  setIsProcessing: (processing: boolean) => void;
  setIsPremium: (premium: boolean) => void;
  setSubscriptionDetails: (subscriptionId: string, plan: 'premium' | 'premium-annual') => void;
  clearSubscription: () => void;
}

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set) => ({
      isProcessing: false,
      isPremium: false,
      subscriptionId: null,
      currentPlan: 'free',
      
      setIsProcessing: (processing) => set({ isProcessing: processing }),
      setIsPremium: (premium) => set({ isPremium: premium }),
      setSubscriptionDetails: (subscriptionId, plan) => 
        set({ subscriptionId, currentPlan: plan, isPremium: true }),
      clearSubscription: () => 
        set({ subscriptionId: null, currentPlan: 'free', isPremium: false }),
    }),
    {
      name: 'payment-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 