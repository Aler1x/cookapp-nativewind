import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Crown, Zap, Shield, Sparkles, ChefHat, BookOpen, Users, Download, Check, X } from 'lucide-react-native';

import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { View } from '~/components/ui/view';
import { Badge } from '~/components/ui/badge';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isPremium?: boolean;
}

function FeatureCard({ icon, title, description, isPremium = false }: FeatureCardProps) {
  return (
    <View className='bg-card rounded-xl p-6 border border-border shadow-sm'>
      <View className='flex-row items-center mb-3'>
        <View className={`p-3 rounded-full ${isPremium ? 'bg-primary/10' : 'bg-secondary'} mr-3`}>{icon}</View>
        {isPremium && <Badge variant='secondary' className='ml-auto' label='Premium' />}
      </View>
      <Text className='text-lg font-semibold mb-2'>{title}</Text>
      <Text className='text-muted-foreground leading-relaxed'>{description}</Text>
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
}: PricingTierProps) {
  return (
    <View
      className={`bg-card rounded-2xl p-6 border ${isPopular ? 'border-primary shadow-lg' : 'border-border'} relative`}>
      {isPopular && (
        <View className='absolute -top-3 left-0 right-0 items-center'>
          <Badge className='bg-primary' label='Most Popular' />
        </View>
      )}

      <View className='text-center mb-6'>
        <Text className='text-2xl font-bold mb-2'>{title}</Text>
        <Text className='text-muted-foreground mb-4'>{description}</Text>
        <View className='flex-row items-baseline justify-center'>
          <Text className='text-4xl font-bold'>{price}</Text>
          <Text className='text-muted-foreground ml-1'>/{period}</Text>
        </View>
      </View>

      <View className='gap-2 mb-6'>
        {features.map((feature, index) => (
          <View key={index} className='flex-row items-center'>
            <Check className='text-primary mr-3' size={16} />
            <Text className='flex-1 text-sm'>{feature}</Text>
          </View>
        ))}
      </View>

      <Button variant={isPopular ? 'default' : 'outline'} size='lg' className='w-full' disabled={isCurrentPlan} onPress={onPress}>
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
        <View className='px-6 py-12 mb-8'>
          <View className='items-center text-center'>
            <View className='bg-primary-foreground/20 p-4 rounded-full mb-6'>
              <Crown className='text-primary-foreground' size={32} />
            </View>
            <Text className='text-3xl font-bold text-primary-foreground mb-4 text-center'>Unlock Premium Features</Text>
            <Text className='text-primary-foreground/80 text-center leading-relaxed max-w-sm'>
              Take your cooking to the next level with AI-powered recipes, unlimited access, and premium tools.
            </Text>
          </View>
        </View>

        {/* Features Section */}
        <View className='px-6 mb-12'>
          <Text className='text-2xl font-bold mb-2 text-center'>Premium Features</Text>
          <Text className='text-muted-foreground text-center mb-8'>Everything you need to become a better cook</Text>

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
        <View className='px-6 mb-12'>
          <Text className='text-2xl font-bold mb-2 text-center'>Choose Your Plan</Text>
          <Text className='text-muted-foreground text-center mb-8'>
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
                onPress={() => onClickPlan(tier.title)}
              />
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View className='px-6 py-8 bg-secondary/30 mx-6 rounded-2xl mb-8'>
          <View className='items-center text-center'>
            <Zap className='text-primary mb-4' size={32} />
            <Text className='text-xl font-bold mb-2'>Start Your Premium Journey</Text>
            <Text className='text-muted-foreground text-center mb-6 leading-relaxed'>
              Join thousands of home cooks who have transformed their kitchen experience with our premium features.
            </Text>
            <Button size='lg' className='w-full'>
              <Text className='text-primary-foreground font-semibold'>Try Premium Free for 7 Days</Text>
            </Button>
            <Text className='text-xs text-muted-foreground mt-3 text-center'>
              Cancel anytime. No commitment required.
            </Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className='h-8' />
      </ScrollView>
    </SafeAreaView>
  );
}
