import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FloatingButton } from '~/components/ui/floating-button';
import { Plus } from 'lucide-react-native';
import { View } from '~/components/ui/view';
import { useFetch } from '~/hooks/useFetch';
import { Recipe } from '~/types/recipe';
import { PaginatedResponse } from '~/types';
import RecipeCard from '~/components/recipe-card';
import { Text } from '~/components/ui/text';
import { useAuth } from '@clerk/clerk-expo';
import { API_ENDPOINTS_PREFIX } from '~/lib/constants';
import BasicModal from '~/components/ui/basic-modal';
import Toast from 'react-native-toast-message';
import AddRecipeSelection from '~/components/modals/add-recipe-selection';
import SocialMediaRecipeInput from '~/components/modals/social-media-recipe-input';

type ModalStep = 'selection' | 'social-media-input';

export default function Page() {
  const { userId } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>('selection');
  const [socialMediaUrl, setSocialMediaUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const $fetch = useFetch();

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await $fetch<PaginatedResponse<Recipe>>(`${API_ENDPOINTS_PREFIX.spring}/recipes/my`);
      setRecipes(response.data);
    };
    fetchRecipes();
  }, [userId, $fetch]);

  const handleModalClose = () => {
    setShowAddRecipeModal(false);
    setModalStep('selection');
    setSocialMediaUrl('');
    setIsProcessing(false);
  };

  const handleSocialMediaSubmit = async () => {
    if (!socialMediaUrl.trim()) return;

    setIsProcessing(true);

    try {
      // Send social media URL to backend for processing
      const response = await $fetch(`${API_ENDPOINTS_PREFIX.node}/recipe-sources/video-url`, {
        method: 'POST',
        body: JSON.stringify({
          url: socialMediaUrl.trim(),
        }),
      });

      if (response) {
        // Close modal and show success message
        handleModalClose();
        Toast.show({
          type: 'success',
          text1: 'Recipe Processing Started',
          text2: "We'll notify you when your recipe is ready!",
        });
      }
    } catch (error) {
      console.error('Error submitting social media URL:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFromScratch = () => {
    // TODO: Implement from scratch functionality
    console.log('Create from scratch selected');
  };

  const renderModalContent = () => {
    switch (modalStep) {
      case 'selection':
        return (
          <AddRecipeSelection
            onClose={handleModalClose}
            onSelectSocialMedia={() => setModalStep('social-media-input')}
            onSelectFromScratch={handleFromScratch}
          />
        );

      case 'social-media-input':
        return (
          <SocialMediaRecipeInput
            onClose={handleModalClose}
            onBack={() => setModalStep('selection')}
            socialMediaUrl={socialMediaUrl}
            onChangeUrl={setSocialMediaUrl}
            onSubmit={handleSocialMediaSubmit}
            isProcessing={isProcessing}
          />
        );
    }
  };

  return (
    <SafeAreaView className='flex-1 items-center justify-center' style={{ padding: 16 }} edges={['top']}>
      <FloatingButton onPress={() => setShowAddRecipeModal(true)}>
        <Plus size={24} />
      </FloatingButton>

      {recipes?.length > 0 ? (
        <View className='flex-1'>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </View>
      ) : (
        <View className='flex-1 items-center justify-center'>
          <Text className='text-center font-medium'>No recipes found</Text>
        </View>
      )}

      <BasicModal isModalOpen={showAddRecipeModal} setIsModalOpen={setShowAddRecipeModal} className='gap-4'>
        {renderModalContent()}
      </BasicModal>
    </SafeAreaView>
  );
}
