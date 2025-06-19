import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import SimpleSelect, { SelectOption } from '~/components/ui/simple-select';
import { ArrowLeft, ArrowRight, Save, X } from 'lucide-react-native';
import ImageUpload from '~/components/ui/image-upload';
import IngredientInput, { IngredientData } from '~/components/ui/ingredient-input';
import StepsInput, { StepData } from '~/components/ui/steps-input';
import CategoryInput from '~/components/ui/category-input';
import { useFetch } from '~/hooks/useFetch';
import { API_ENDPOINTS_PREFIX, THEME } from '~/lib/constants';
import { CategorySearch, RecipeFull } from '~/types/recipe';
import { cn } from '~/lib/utils';
import Toast from 'react-native-toast-message';

export interface RecipeFormData {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  servings: number;
  mainImageUrl: string;
  categories: CategorySearch[];
  ingredients: IngredientData[];
  steps: StepData[];
  isPublic: boolean;
}

interface RecipeFormProps {
  initialData?: RecipeFull;
  mode: 'create' | 'edit';
  onCancel: () => void;
  onSuccess?: (recipe: RecipeFull) => void;
}

type FormStep = 'basic' | 'image' | 'categories' | 'ingredients' | 'steps' | 'review';

const FORM_STEPS: { key: FormStep; title: string; description: string }[] = [
  { key: 'basic', title: 'Basic Info', description: 'Recipe title and details' },
  { key: 'image', title: 'Photo', description: 'Add a main photo' },
  { key: 'categories', title: 'Categories', description: 'Help people find your recipe' },
  { key: 'ingredients', title: 'Ingredients', description: 'What ingredients are needed' },
  { key: 'steps', title: 'Instructions', description: 'How to make the recipe' },
  { key: 'review', title: 'Review', description: 'Review and save your recipe' },
];

const DIFFICULTY_OPTIONS: SelectOption[] = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' },
];

export default function RecipeForm({
  initialData,
  mode,
  onCancel,
  onSuccess,
}: RecipeFormProps) {

  
  const [currentStep, setCurrentStep] = useState<FormStep>('basic');
  const [formData, setFormData] = useState<RecipeFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    difficulty: initialData?.difficulty || 'easy',
    duration: initialData?.duration || 30,
    servings: initialData?.servings || 4,
    mainImageUrl: initialData?.mainImageUrl || '',
    categories: initialData?.categories.map(cat => ({
      id: cat.id,
      name: cat.name,
    })) || [],
    ingredients: initialData?.ingredients?.map(ing => ({
      id: ing.id,
      productId: ing.productId || 0,
      productName: ing.name,
      amount: ing.measurements.amount,
      unitId: ing.measurements.unit?.id ? parseInt(ing.measurements.unit.id) : undefined,
      unitName: ing.measurements.unit?.name?.one || '',
    })) || [],
    steps: initialData?.steps?.map(step => ({
      id: step.id,
      stepNumber: step.stepNumber,
      description: step.description,
    })) || [],
    isPublic: initialData?.isPublic ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const $fetch = useFetch();

  const getCurrentStepIndex = () => {
    return FORM_STEPS.findIndex(step => step.key === currentStep);
  };

  const goToNextStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < FORM_STEPS.length - 1) {
      setCurrentStep(FORM_STEPS[currentIndex + 1].key);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(FORM_STEPS[currentIndex - 1].key);
    }
  };

  const validateCurrentStep = (): { isValid: boolean; message?: string } => {
    switch (currentStep) {
      case 'basic':
        if (!formData.title.trim()) {
          return { isValid: false, message: 'Recipe title is required' };
        }
        if (formData.duration <= 0) {
          return { isValid: false, message: 'Duration must be greater than 0' };
        }
        if (formData.servings <= 0) {
          return { isValid: false, message: 'Servings must be greater than 0' };
        }
        return { isValid: true };

      case 'image':
        // Image is optional, so always valid
        return { isValid: true };

      case 'categories':
        // Categories are optional, so always valid
        return { isValid: true };

      case 'ingredients':
        if (formData.ingredients.length === 0) {
          return { isValid: false, message: 'At least one ingredient is required' };
        }
        const invalidIngredients = formData.ingredients.filter(
          ing => !ing.productName.trim() || ing.amount <= 0
        );
        if (invalidIngredients.length > 0) {
          return { isValid: false, message: 'All ingredients must have a name and amount > 0' };
        }
        return { isValid: true };

      case 'steps':
        if (formData.steps.length === 0) {
          return { isValid: false, message: 'At least one cooking step is required' };
        }
        const invalidSteps = formData.steps.filter(step => !step.description.trim());
        if (invalidSteps.length > 0) {
          return { isValid: false, message: 'All steps must have instructions' };
        }
        return { isValid: true };

      default:
        return { isValid: true };
    }
  };

  const handleNext = () => {
    const validation = validateCurrentStep();
    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.message);
      return;
    }
    goToNextStep();
  };

  const transformFormDataToApiFormat = (data: RecipeFormData) => {
    const apiData = {
      title: data.title,
      difficulty: data.difficulty,
      mainImageUrl: data.mainImageUrl,
      description: data.description,
      source: "MANUALLY_CREATED",
      duration: data.duration,
      servings: data.servings,
      categories: data.categories.map(cat => parseInt(cat.id)),
      ingredients: data.ingredients.map(ing => ({
        productId: ing.productId,
        measurements: {
          unitId: ing.unitId || 0,
          amount: ing.amount,
        },
      })),
      steps: data.steps.map(step => ({
        stepNumber: step.stepNumber,
        description: step.description,
      })),
      isPublic: data.isPublic,
    };

    if (mode === 'create') {
      return apiData;
    }

    return { ...apiData, id: initialData?.id };
  };

  const handleSubmit = async () => {
    const validation = validateCurrentStep();
    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const apiData = transformFormDataToApiFormat(formData);

      let response: RecipeFull;

      if (mode === 'create') {
        response = await $fetch<RecipeFull>(
          `${API_ENDPOINTS_PREFIX.spring}/recipes`,
          {
            method: 'POST',
            body: JSON.stringify(apiData),
          }
        );
      } else {
        response = await $fetch<RecipeFull>(
          `${API_ENDPOINTS_PREFIX.spring}/recipes/${initialData?.id}`,
          {
            method: 'PUT',
            body: JSON.stringify(apiData),
          }
        );
      }

      if (response) {
        Toast.show({
          type: 'success',
          text1: mode === 'create' ? 'Recipe Created!' : 'Recipe Updated!',
          text2: 'Your recipe has been saved successfully',
        });
        onSuccess?.(response);
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Failed to ${mode} recipe. Please try again.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <View className="gap-4">
            <View>
              <Text className="text-sm font-medium mb-2">Recipe Title *</Text>
              <Input
                placeholder="Enter recipe title"
                value={formData.title}
                onChangeText={(title) => setFormData(prev => ({ ...prev, title }))}
                className="rounded-lg border border-gray-300"
              />
            </View>

            <View>
              <Text className="text-sm font-medium mb-2">Description</Text>
              <Textarea
                placeholder="Tell people about your recipe..."
                value={formData.description}
                onChangeText={(description) => setFormData(prev => ({ ...prev, description }))}
                numberOfLines={10}
                className="min-h-[80px] rounded-lg border border-gray-300"
              />
            </View>

            <View>
              <Text className="text-sm font-medium mb-2">Difficulty *</Text>
              <SimpleSelect
                options={DIFFICULTY_OPTIONS}
                value={formData.difficulty}
                placeholder="Select difficulty"
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    difficulty: value as 'easy' | 'medium' | 'hard',
                  }))
                }
                className="w-full"
              />
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-sm font-medium mb-2">Duration (minutes) *</Text>
                <Input
                  placeholder="30"
                  value={formData.duration.toString()}
                  onChangeText={(duration) => setFormData(prev => ({
                    ...prev,
                    duration: parseInt(duration) || 0
                  }))}
                  keyboardType="numeric"
                  className="rounded-lg border border-gray-300"
                />
              </View>

              <View className="flex-1">
                <Text className="text-sm font-medium mb-2">Servings *</Text>
                <Input
                  placeholder="4"
                  value={formData.servings.toString()}
                  onChangeText={(servings) => setFormData(prev => ({
                    ...prev,
                    servings: parseInt(servings) || 0
                  }))}
                  keyboardType="numeric"
                  className="rounded-lg border border-gray-300"
                />
              </View>
            </View>
          </View>
        );

      case 'image':
        return (
          <View className="gap-4">
            <Text className="text-center text-gray-600 mb-4">
              Add a photo to make your recipe more appealing
            </Text>
            <ImageUpload
              onImageSelected={(imageUrl) => setFormData(prev => ({ ...prev, mainImageUrl: imageUrl }))}
              existingImageUrl={formData.mainImageUrl}
              placeholder="Add recipe photo"
            />
          </View>
        );

      case 'categories':
        return (
          <CategoryInput
            selectedCategories={formData.categories}
            onCategoriesChange={(categories) => setFormData(prev => ({ ...prev, categories }))}
          />
        );

      case 'ingredients':
        return (
          <IngredientInput
            ingredients={formData.ingredients}
            onIngredientsChange={(ingredients) => setFormData(prev => ({ ...prev, ingredients }))}
          />
        );

      case 'steps':
        return (
          <StepsInput
            steps={formData.steps}
            onStepsChange={(steps) => setFormData(prev => ({ ...prev, steps }))}
          />
        );

      case 'review':
        return (
          <View className="gap-4">
            <Text className="text-lg font-semibold text-center mb-4">Review Your Recipe</Text>

            <View className="bg-gray-50 p-4 rounded-lg">
              <Text className="font-semibold text-lg">{formData.title}</Text>
              {formData.description && (
                <Text className="text-gray-600 mt-2">{formData.description}</Text>
              )}
              <View className="flex-row gap-4 mt-3">
                <Text className="text-sm text-gray-500">
                  ⏱️ {formData.duration} mins
                </Text>
                <Text className="text-sm text-gray-500">
                  👥 {formData.servings} servings
                </Text>
                <Text className="text-sm text-gray-500">
                  📊 {formData.difficulty}
                </Text>
              </View>

              {formData.categories.length > 0 && (
                <View className="mt-3">
                  <Text className="text-sm text-gray-500">
                    🏷️ {formData.categories.map(c => c.name).join(', ')}
                  </Text>
                </View>
              )}

              <View className="mt-3">
                <Text className="text-sm text-gray-500">
                  🥘 {formData.ingredients.length} ingredients, {formData.steps.length} steps
                </Text>
              </View>
            </View>

            {formData.mainImageUrl && (
              <View className="items-center">
                <Text className="text-sm text-gray-500 mb-2">Recipe Photo</Text>
                <View className="w-32 h-20 rounded-lg overflow-hidden">
                  <ImageUpload
                    onImageSelected={() => { }}
                    existingImageUrl={formData.mainImageUrl}
                    disabled={true}
                  />
                </View>
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  const isLastStep = currentStep === 'review';
  const isFirstStep = currentStep === 'basic';

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <TouchableOpacity onPress={onCancel}>
          <X size={24} color="#000" />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Text className="text-lg font-semibold">
            {mode === 'create' ? 'Create Recipe' : 'Edit Recipe'}
          </Text>
          <Text className="text-sm text-gray-500">
            Step {getCurrentStepIndex() + 1} of {FORM_STEPS.length}
          </Text>
        </View>

        <View className="w-6" />
      </View>

      {/* Progress Indicator */}
      <View className="px-4 py-2">
        <View className="flex-row justify-between items-center mb-2">
          {FORM_STEPS.map((step, index) => (
            <View key={step.key} className="flex-1 items-center">
              <View
                className={cn(
                  'w-3 h-3 rounded-full',
                  index <= getCurrentStepIndex() ? 'bg-primary' : 'bg-gray-300'
                )}
              />
              {index < FORM_STEPS.length - 1 && (
                <View className="absolute top-1.5 left-1/2 w-full h-0.5 bg-gray-300"
                  style={{ zIndex: -1 }} />
              )}
            </View>
          ))}
        </View>
        <Text className="text-center font-medium">
          {FORM_STEPS[getCurrentStepIndex()].title}
        </Text>
        <Text className="text-center text-sm text-gray-500">
          {FORM_STEPS[getCurrentStepIndex()].description}
        </Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4 py-4" keyboardShouldPersistTaps='always' >
        {renderStepContent()}
      </ScrollView>

      {/* Footer */}
      <View className="p-4 border-t border-gray-200">
        <View className="flex-row gap-3">
          {!isFirstStep && (
            <Button variant="outline" onPress={goToPreviousStep} className="flex-1">
              <View className="flex-row items-center gap-2">
                <ArrowLeft size={16} color={THEME.light.colors.primary} />
                <Text className="text-primary">Previous</Text>
              </View>
            </Button>
          )}

          {isLastStep ? (
            <Button onPress={handleSubmit} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <View className="flex-row items-center gap-2">
                  <Save size={16} color="white" />
                  <Text className="text-white">
                    {mode === 'create' ? 'Create Recipe' : 'Update Recipe'}
                  </Text>
                </View>
              )}
            </Button>
          ) : (
            <Button onPress={handleNext} className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-white">Next</Text>
                <ArrowRight size={16} color="white" />
              </View>
            </Button>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
} 