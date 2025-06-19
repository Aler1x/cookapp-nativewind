import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { X, Plus, GripVertical } from 'lucide-react-native';
import { THEME } from '~/lib/constants';
import { cn } from '~/lib/utils';

export interface StepData {
  id?: string;
  stepNumber: number;
  description: string;
}

interface StepsInputProps {
  steps: StepData[];
  onStepsChange: (steps: StepData[]) => void;
  className?: string;
  disabled?: boolean;
}

interface SingleStepInputProps {
  step: StepData;
  stepIndex: number;
  onUpdate: (step: StepData) => void;
  onRemove: () => void;
  disabled?: boolean;
}

function SingleStepInput({
  step,
  stepIndex,
  onUpdate,
  onRemove,
  disabled
}: SingleStepInputProps) {
  const handleDescriptionChange = (description: string) => {
    onUpdate({
      ...step,
      description,
    });
  };

  return (
    <View className="mb-4 p-4 border border-gray-200 rounded-lg bg-white">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Text className="text-white text-sm font-bold">{stepIndex + 1}</Text>
          </View>
          <Text className="text-sm font-medium text-gray-700">Step {stepIndex + 1}</Text>
        </View>
        
        <View className="flex-row items-center gap-2">
          {!disabled && (
            <>
              <TouchableOpacity onPress={onRemove}>
                <X size={20} color="#EF4444" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-sm font-medium">Instructions</Text>
        <Textarea
          placeholder={`Describe what to do in step ${stepIndex + 1}...`}
          value={step.description}
          onChangeText={handleDescriptionChange}
          numberOfLines={3}
          className="min-h-[80px] rounded-lg border border-gray-300"
          editable={!disabled}
        />
      </View>
    </View>
  );
}

export default function StepsInput({
  steps,
  onStepsChange,
  className,
  disabled = false,
}: StepsInputProps) {
  const addStep = () => {
    const newStep: StepData = {
      stepNumber: steps.length + 1,
      description: '',
    };
    onStepsChange([...steps, newStep]);
  };

  const updateStep = (index: number, updatedStep: StepData) => {
    const newSteps = [...steps];
    newSteps[index] = {
      ...updatedStep,
      stepNumber: index + 1, // Ensure step number matches index
    };
    onStepsChange(newSteps);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    // Renumber steps after removal
    const renumberedSteps = newSteps.map((step, i) => ({
      ...step,
      stepNumber: i + 1,
    }));
    onStepsChange(renumberedSteps);
  };

  return (
    <View className={cn('', className)}>
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold">Cooking Steps</Text>
        {!disabled && (
          <Button variant="outline" size="sm" onPress={addStep}>
            <View className="flex-row items-center gap-2">
              <Plus size={16} color={THEME.light.colors.primary} />
              <Text className="text-primary">Add Step</Text>
            </View>
          </Button>
        )}
      </View>

      {steps.length === 0 ? (
        <View className="p-6 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center">
          <Text className="text-gray-500 text-center">No cooking steps added yet</Text>
          {!disabled && (
            <Text className="text-gray-400 text-sm mt-1">Tap &quot;Add Step&quot; to get started</Text>
          )}
        </View>
      ) : (
        steps.map((step, index) => (
          <SingleStepInput
            key={index}
            step={step}
            stepIndex={index}
            onUpdate={(updatedStep) => updateStep(index, updatedStep)}
            onRemove={() => removeStep(index)}
            disabled={disabled}
          />
        ))
      )}

      {steps.length > 0 && !disabled && (
        <View className="mt-4">
          <Button variant="outline" onPress={addStep} className="w-full">
            <View className="flex-row items-center gap-2">
              <Plus size={16} color={THEME.light.colors.primary} />
              <Text className="text-primary">Add Another Step</Text>
            </View>
          </Button>
        </View>
      )}
    </View>
  );
} 