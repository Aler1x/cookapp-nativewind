import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Crown, Zap, Shield, Sparkles, ChefHat, BookOpen, Users, Download, Check, X } from 'lucide-react-native';

import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { View } from '~/components/ui/view';
import { Badge } from '~/components/ui/badge';
import BasicModal from '../ui/basic-modal';
import { cn } from '~/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isPremium?: boolean;
}

function FeatureCard({ icon, title, description, isPremium = false }: FeatureCardProps) {
  return (
    <View className='rounded-xl border border-border bg-card p-6 shadow-sm'>
      <View className='mb-3 flex-row items-center'>
        <View className={`rounded-full p-3 ${isPremium ? 'bg-primary/10' : 'bg-secondary'} mr-3`}>{icon}</View>
        {isPremium && <Badge variant='secondary' className='ml-auto' label='Premium' />}
      </View>
      <Text className='mb-2 text-lg font-semibold'>{title}</Text>
      <Text className='leading-relaxed text-muted-foreground'>{description}</Text>
    </View>
  );
}

interface PricingTierProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  onPress: () => void;
  isLoading?: boolean;
}

function PricingTier({
  title,
  price,
  period,
  description,
  features,
  isPopular = false,
  isCurrentPlan = false,
  onPress,
  isLoading = false,
}: PricingTierProps) {
  return (
    <View
      className={`rounded-2xl border bg-card p-6 ${isPopular ? 'border-primary shadow-lg' : 'border-border'} relative`}>
      {isPopular && (
        <View className='absolute -top-3 left-0 right-0 items-center'>
          <Badge className='bg-primary' label='Most Popular' />
        </View>
      )}

      <View className='mb-6 text-center'>
        <Text className='mb-2 text-2xl font-bold'>{title}</Text>
        <Text className='mb-4 text-muted-foreground'>{description}</Text>
        <View className='flex-row items-baseline justify-center'>
          <Text className='text-4xl font-bold'>{price}</Text>
          <Text className='ml-1 text-muted-foreground'>/{period}</Text>
        </View>
      </View>

      <View className='mb-6 gap-2'>
        {features.map((feature, index) => (
          <View key={index} className='flex-row items-center'>
            <Check className='mr-3 text-primary' size={16} />
            <Text className='flex-1 text-sm'>{feature}</Text>
          </View>
        ))}
      </View>

      <Button
        variant={isPopular ? 'default' : 'outline'}
        size='lg'
        className='w-full'
        disabled={isCurrentPlan || isLoading}
        onPress={onPress}>
        <Text className={isPopular ? 'text-primary-foreground' : 'text-foreground'}>
          {isCurrentPlan ? 'Current Plan' : 'Get Started'}
        </Text>
      </Button>
    </View>
  );
}

interface PremiumPageProps {
  onClose: () => void;
  onClickPlan: (plan: string) => void;
}

export default function PremiumPage({ onClose, onClickPlan }: PremiumPageProps) {
  const [paymentMessage, setPaymentMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handlePlanSelection = async (planTitle: string) => {
    onClickPlan(planTitle);
  };

  const premiumFeatures = [
    {
      icon: <ChefHat className='text-primary' size={24} />,
      title: 'AI Recipe Generator',
      description:
        'Create unlimited personalized recipes with our advanced AI based on your preferences, dietary restrictions, and available ingredients.',
      isPremium: true,
    },
    // {
    //   icon: <BookOpen className="text-primary" size={24} />,
    //   title: "Unlimited Recipe Library",
    //   description: "Access our complete collection of over 10,000 premium recipes from world-renowned chefs and culinary experts.",
    //   isPremium: true,
    // },
    // {
    //   icon: <Download className="text-primary" size={24} />,
    //   title: "Offline Access",
    //   description: "Download recipes and cooking guides for offline access. Perfect for cooking without internet connection.",
    //   isPremium: true,
    // },
    {
      icon: <Shield className='text-primary' size={24} />,
      title: 'Ad-Free Experience',
      description:
        'Enjoy a completely ad-free cooking experience with faster loading times and uninterrupted recipe browsing.',
      isPremium: true,
    },
    {
      icon: <Sparkles className='text-primary' size={24} />,
      title: 'Priority Support',
      description:
        'Get priority customer support with faster response times and direct access to our culinary experts.',
      isPremium: true,
    },
  ];

  const pricingTiers = [
    {
      title: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for casual cooking',
      features: [
        'Standard support',
        'Limited AI chat',
        'Recipe favorites',
        'Basic search functionality',
        'Shopping list integration',
      ],
      isCurrentPlan: true,
    },
    {
      title: 'Premium',
      price: '$5.49',
      period: 'month',
      description: 'For passionate home cooks',
      features: [
        'Everything in Free plan',
        'Unlimited AI chat with recipe generation and recipe search',
        'Ad-free experience',
        'Priority support',
      ],
      isPopular: true,
    },
    {
      title: 'Premium Annual',
      price: '$55.99',
      period: 'year',
      description: 'Best value for cooking enthusiasts',
      features: ['Everything in Premium', '2 months free', 'Early access to new features'],
    },
  ];

  return (
    <SafeAreaView className='flex-1 bg-background'>
      {/* Hero Section */}
      <View className='flex-row items-center justify-end px-6 pt-6'>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color='#000' />
        </TouchableOpacity>
      </View>

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <View className='mb-8 px-6 py-12'>
          <View className='items-center text-center'>
            <View className='mb-6 rounded-full bg-primary-foreground/20 p-4'>
              <Crown className='text-primary-foreground' size={32} />
            </View>
            <Text className='mb-4 text-center text-3xl font-bold text-primary-foreground'>Unlock Premium Features</Text>
            <Text className='max-w-sm text-center leading-relaxed text-primary-foreground/80'>
              Take your cooking to the next level with AI-powered recipes, unlimited access, and premium tools.
            </Text>
          </View>
        </View>

        {/* Features Section */}
        <View className='mb-12 px-6'>
          <Text className='mb-2 text-center text-2xl font-bold'>Premium Features</Text>
          <Text className='mb-8 text-center text-muted-foreground'>Everything you need to become a better cook</Text>

          <View className='gap-4'>
            {premiumFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                isPremium={feature.isPremium}
              />
            ))}
          </View>
        </View>

        {/* Pricing Section */}
        <View className='mb-12 px-6'>
          <Text className='mb-2 text-center text-2xl font-bold'>Choose Your Plan</Text>
          <Text className='mb-8 text-center text-muted-foreground'>
            Select the perfect plan for your cooking journey
          </Text>

          <View className='gap-6'>
            {pricingTiers.map((tier, index) => (
              <PricingTier
                key={index}
                title={tier.title}
                price={tier.price}
                period={tier.period}
                description={tier.description}
                features={tier.features}
                isPopular={tier.isPopular}
                isCurrentPlan={tier.isCurrentPlan}
                onPress={() => handlePlanSelection(tier.title)}
                isLoading={false}
              />
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View className='mx-6 mb-8 rounded-2xl bg-secondary/30 px-6 py-8'>
          <View className='items-center text-center'>
            <Zap className='mb-4 text-primary' size={32} />
            <Text className='mb-2 text-xl font-bold'>Start Your Premium Journey</Text>
            <Text className='mb-6 text-center leading-relaxed text-muted-foreground'>
              Join thousands of home cooks who have transformed their kitchen experience with our premium features.
            </Text>
            <Button size='lg' className='w-full' onPress={() => onClickPlan('Premium')}>
              <Text className='font-semibold text-primary-foreground'>Try Premium Free for 7 Days</Text>
            </Button>
            <Text className='mt-3 text-center text-xs text-muted-foreground'>
              Cancel anytime. No commitment required.
            </Text>
          </View>
        </View>

        {/* Loading overlay */}
        <BasicModal isModalOpen={false} setIsModalOpen={() => {}}>
          <View className='items-center rounded-2xl bg-white p-6'>
            {!paymentMessage && (
              <>
                <ActivityIndicator size='large' color='#007AFF' />
                <Text className='mt-4 text-lg font-semibold'>Processing Payment...</Text>
                <Text className='mb-6 text-center leading-relaxed text-muted-foreground'>
                  Please wait while we process your payment. This may take a few seconds.
                </Text>
              </>
            )}
            {paymentMessage && (
              <View className='items-center rounded-2xl bg-white p-6'>
                <Text
                  className={cn(
                    'mb-6 text-center leading-relaxed',
                    isError ? 'text-red-500' : 'text-muted-foreground'
                  )}>
                  {paymentMessage}
                </Text>
              </View>
            )}
          </View>
        </BasicModal>

        {/* Bottom Spacing */}
        <View className='h-8' />
      </ScrollView>
    </SafeAreaView>
  );
}
