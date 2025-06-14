import React from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Badge } from '~/components/ui/badge';
import { Job } from '~/types/profile';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react-native';
import { cn } from '~/lib/utils';

type JobCardProps = {
  job: Job;
};

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'success':
      return {
        color: '#22c55e',
        icon: CheckCircle,
        label: 'Completed',
        border: 'border-green-500',
      };
    case 'processing':
    case 'in_progress':
    case 'running':
      return {
        color: '#3b82f6',
        icon: Clock,
        label: 'Processing your recipe',
        border: 'border-blue-500',
      };
    case 'failed':
    case 'error':
      return {
        color: '#ef4444',
        icon: XCircle,
        label: 'Failed',
        border: 'border-red-500',
      };
    default:
      return {
        color: '#6b7280',
        icon: AlertCircle,
        label: status,
        border: 'border-gray-500',
      };
  }
};

const isDevMode = __DEV__;

export default function JobCard({ job }: JobCardProps) {
  const statusConfig = getStatusConfig(job.status);
  const StatusIcon = statusConfig.icon;
  const isSuccessful = ['completed', 'success'].includes(job.status.toLowerCase());

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <View className='bg-white rounded-lg p-4 mb-3 border border-gray-200 shadow-sm gap-2'>
      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center gap-3'>
          <StatusIcon size={22} color={statusConfig.color} />
          <Badge
            variant='outline'
            label={statusConfig.label}
            className={cn('px-2 py-1', statusConfig.border)}
            labelClasses='text-sm font-medium'
          />
        </View>
        <Text className='text-xs text-muted-foreground'>{formatDate(job.createdAt)}</Text>
      </View>

      {isSuccessful && job.recipeName && (
        <Text className='text-base font-semibold text-foreground'>{job.recipeName}</Text>
      )}

      {isDevMode && (
        <>
          <Text className='text-sm text-muted-foreground'>Job ID: {job.jobId}</Text>

          {job.recipeId && (
            <Text className='text-sm text-muted-foreground'>Recipe ID: {job.recipeId}</Text>
          )}

          {job.updatedAt && job.updatedAt !== job.createdAt && (
            <Text className='text-xs text-muted-foreground'>Updated: {formatDate(job.updatedAt)}</Text>
          )}
        </>
      )}

      {job.error && (
        <View className='mt-3 p-3 bg-red-50 rounded-md border border-red-200'>
          <Text className='text-sm text-red-700 font-medium'>Error:</Text>
          <Text className='text-sm text-red-600 mt-1'>{job.error}</Text>
        </View>
      )}
    </View>
  );
}