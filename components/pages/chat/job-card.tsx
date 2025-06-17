import { View, Animated } from 'react-native';
import { Text } from '~/components/ui/text';
import { CheckCircle, Clock, XCircle, AlertCircle } from '~/assets/icons';
import { Job } from '~/types/profile';
import { useEffect, useRef } from 'react';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;

  const isLoading = job.status.toLowerCase() === 'pending' || job.status.toLowerCase() === 'in_progress';

  useEffect(() => {
    if (isLoading) {
      // Progress line animation from left to right
      const progressAnimation = Animated.loop(
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false, // We need to animate width/translateX
        })
      );

      progressAnimation.start();

      return () => {
        progressAnimation.stop();
      };
    }
  }, [isLoading, progressAnim]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className='h-5 w-5 text-green-500' />;
      case 'failed':
        return <XCircle className='h-5 w-5 text-red-500' />;
      case 'in_progress':
      case 'pending':
        return <Clock className='h-5 w-5 text-yellow-500' />;
      default:
        return <AlertCircle className='h-5 w-5 text-gray-500' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'in_progress':
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#22c55e'; // green-500
      case 'failed':
        return '#ef4444'; // red-500
      case 'in_progress':
      case 'pending':
        return '#eab308'; // yellow-500
      default:
        return '#6b7280'; // gray-500
    }
  };

  return (
    <View className='rounded-2xl px-4 py-3 bg-card border border-border relative overflow-hidden'>
      {isLoading && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: 2,
            backgroundColor: getProgressColor(job.status),
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
      )}
      
      <View className='flex-row items-center mb-3'>
        {getStatusIcon(job.status)}
        <Text className={`ml-2 font-semibold text-base ${getStatusColor(job.status)}`}>
          {job.status.replace('_', ' ').toUpperCase()}
          {isLoading && (
            <Text className='text-yellow-500 ml-1'>
              {'...'}
            </Text>
          )}
        </Text>
      </View>

      <View className='space-y-2'>
        {job.recipeName && (
          <View className='flex-row justify-between'>
            <Text className='text-foreground/70 text-sm'>Recipe:</Text>
            <Text className='text-foreground text-sm'>{job.recipeName}</Text>
          </View>
        )}

        {job.error && (
          <View className='mt-2 p-2 bg-red-50 rounded-lg border border-red-200'>
            <Text className='text-red-700 text-sm font-medium'>Error:</Text>
            <Text className='text-red-600 text-sm mt-1'>{job.error}</Text>
          </View>
        )}
      </View>
    </View>
  );
} 