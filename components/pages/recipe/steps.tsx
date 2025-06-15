import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import { RecipeFull } from '~/types/recipe';
import { cn } from '~/lib/utils';

interface RecipeStepsProps {
  recipe: RecipeFull;
  completedSteps: Set<number>;
  onStepComplete: (stepIndex: number) => void;
  onAllStepsCompleted?: () => void;
}

export function RecipeSteps({ recipe, completedSteps, onStepComplete, onAllStepsCompleted }: RecipeStepsProps) {
  const getNextIncompleteStep = () => {
    if (!recipe?.steps) return -1;
    for (let i = 0; i < recipe.steps.length; i++) {
      if (!completedSteps.has(i)) {
        return i;
      }
    }
    return -1;
  };

  // Check if all steps are completed
  useEffect(() => {
    if (recipe?.steps && recipe.steps.length > 0) {
      const allStepsCompleted = recipe.steps.every((_, index) => completedSteps.has(index));
      if (allStepsCompleted && onAllStepsCompleted) {
        onAllStepsCompleted();
      }
    }
  }, [completedSteps, recipe?.steps, onAllStepsCompleted]);

  return (
    <View>
      {/* Cooking Steps */}
      {recipe.steps && recipe.steps.length > 0 ? (
        <View>
          <Text className='mb-6 text-xl font-bold'>{recipe.steps.length} Steps</Text>

          <View className='gap-4'>
            {recipe.steps.map((step, index) => {
              const isCompleted = completedSteps.has(index);
              const isNextStep = getNextIncompleteStep() === index;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => onStepComplete(index)}
                  className={cn(
                    'rounded-2xl border-2 p-4 transition-all',
                    isCompleted
                      ? 'border-secondary bg-gray-100'
                      : isNextStep
                        ? 'border-primary bg-white'
                        : 'border-gray-200 bg-white'
                  )}>
                  <View className='flex-row items-start gap-3'>
                    <View
                      className={cn(
                        'h-8 w-8 items-center justify-center rounded-full',
                        isCompleted ? 'bg-secondary' : isNextStep ? 'bg-primary' : 'bg-gray-300'
                      )}>
                      <Text
                        className={cn('text-sm font-bold', isCompleted || isNextStep ? 'text-white' : 'text-gray-600')}>
                        {index + 1}
                      </Text>
                    </View>

                    <Text
                      className={cn(
                        'flex-1 text-base leading-6',
                        isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'
                      )}>
                      {step.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : (
        <View className='items-center py-8'>
          <Text className='text-center text-gray-500'>No cooking steps available for this recipe.</Text>
        </View>
      )}
    </View>
  );
}
