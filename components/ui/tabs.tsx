import React, { useState } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Text } from './text';
import { cn } from '~/lib/utils';
import { THEME } from '~/lib/constants';

export interface TabItem {
  key: string;
  label: string;
}

export interface TabIndicator {
  left: {
    inputRange: number[];
    outputRange: string[];
  };
  width: string;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onTabChange?: (tabKey: string) => void;
  className?: string;
  tabIndicator: TabIndicator;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ tabs, defaultTab, onTabChange, className, tabIndicator }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.key);
  const [tabIndicatorAnimation] = useState(
    new Animated.Value(tabs.findIndex((tab) => tab.key === (defaultTab || tabs[0]?.key)))
  );

  const animateTabIndicator = (tabIndex: number) => {
    Animated.timing(tabIndicatorAnimation, {
      toValue: tabIndex,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
    const tabIndex = tabs.findIndex((tab) => tab.key === tabKey);
    animateTabIndicator(tabIndex);
    onTabChange?.(tabKey);
  };

  return (
    <View className={cn('relative rounded-full bg-white p-1', className)}>
      {/* Animated Indicator */}
      <Animated.View
        className='absolute bottom-1 top-1 z-10 rounded-full bg-primary'
        style={[
          {
            left: tabIndicatorAnimation.interpolate({
              inputRange: tabIndicator.left.inputRange,
              outputRange: tabIndicator.left.outputRange,
            }),
            width: tabIndicator.width as any,
            backgroundColor: THEME.light.colors.primary,
            position: 'absolute',
            bottom: 0,
            top: 0,
            zIndex: 10,
            borderRadius: 100,
          },
        ]}
      />

      <View className='relative z-10 flex-row items-center justify-between'>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.key} onPress={() => handleTabPress(tab.key)} className='flex-1 rounded-full py-3'>
            <Text className={cn('text-center font-medium', activeTab === tab.key ? 'text-white' : 'text-gray-600')}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

interface TabsContextValue {
  activeTab: string;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

export function TabsProvider({ children, activeTab }: { children: React.ReactNode; activeTab: string }) {
  return <TabsContext.Provider value={{ activeTab }}>{children}</TabsContext.Provider>;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error('TabsContent must be used within TabsProvider');
  }

  if (context.activeTab !== value) {
    return null;
  }

  return <View className={className}>{children}</View>;
}
