import React, { useCallback, useEffect, useState } from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { X } from '~/assets/icons';
import { Preferences, PreferencesRequest } from '~/types/profile';
import BasicModal from '../ui/basic-modal';
import { useFetch } from '~/hooks/useFetch';
import { API_ENDPOINTS_PREFIX, THEME } from '~/lib/constants';
import InputWithDropdown, { SelectListData } from '../ui/input-with-dropdown';
import { SearchProduct, Response } from '~/types';

interface PreferencePillProps {
  name: string;
  selected: boolean;
  onPress: () => void;
}

function PreferencePill({ name, selected, onPress }: PreferencePillProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mb-2 mr-2 rounded-full border px-4 py-2 ${
        selected ? 'border-secondary bg-secondary' : 'border-gray-300 bg-transparent'
      }`}>
      <Text className={`text-sm ${selected ? 'font-medium' : 'text-gray-700'}`}>{name}</Text>
    </TouchableOpacity>
  );
}

interface PreferenceSectionProps {
  title: string;
  items: any[];
  visibleCount: number;
  showAll: boolean;
  onToggleShowAll: () => void;
  onToggleItem: (id: string) => void;
  onAddNew: () => void;
  showAddNew?: boolean;
}

function PreferenceSection({
  title,
  items,
  visibleCount,
  showAll,
  onToggleShowAll,
  onToggleItem,
  onAddNew,
  showAddNew = true,
}: PreferenceSectionProps) {
  const displayItems = showAll ? items : items?.slice(0, visibleCount);
  const hasMore = items && items.length > visibleCount;

  return (
    <View className='mb-6'>
      <View className='flex-row items-center justify-between'>
        <Text className='mb-3 text-lg font-semibold'>{title}</Text>
        {!items && <ActivityIndicator size='small' color={THEME.light.colors.primary} />}
      </View>
      <View className='flex-row flex-wrap'>
        {displayItems?.map((item) => (
          <PreferencePill
            key={item.id}
            name={item.name}
            selected={item.selected}
            onPress={() => onToggleItem(item.id)}
          />
        ))}
      </View>
      <View className='mt-2 flex-row'>
        {hasMore && (
          <TouchableOpacity onPress={onToggleShowAll} className='mr-4'>
            <Text className='text-sm text-gray-500'>{showAll ? 'Show less' : 'Show more'}</Text>
          </TouchableOpacity>
        )}
        {showAddNew && (
          <TouchableOpacity onPress={onAddNew}>
            <Text className='text-sm text-gray-500'>Add new</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

interface PreferencesPageProps {
  onClose?: () => void;
  initialPreferences?: Preferences;
}

export default function PreferencesPage({ onClose }: PreferencesPageProps) {
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [preferencesRequest, setPreferencesRequest] = useState<PreferencesRequest | null>(null);
  const [showAllDiets, setShowAllDiets] = useState(false);
  const [showAllAllergies, setShowAllAllergies] = useState(false);
  const [showAllUnfavorite, setShowAllUnfavorite] = useState(false);
  const [showAllCuisines, setShowAllCuisines] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemText, setNewItemText] = useState<string>('');
  const [newItem, setNewItem] = useState<SelectListData | null>(null);
  const [currentSection, setCurrentSection] = useState<
    'diets' | 'allergies' | 'unfavoriteIngredients' | 'cuisinePreferences'
  >('diets');

  const $fetch = useFetch();

  useEffect(() => {
    const fetchPreferences = async () => {
      const preferences = await $fetch<Response<Preferences>>(`${API_ENDPOINTS_PREFIX.node}/preferences`);
      setPreferences(preferences.data);
    };
    fetchPreferences();
  }, [$fetch]);

  const buildPreferencesRequest = (preferences: Preferences): PreferencesRequest => {
    const allPreferences = [
      ...preferences.diets,
      ...preferences.allergies,
      ...preferences.unfavoriteIngredients,
      ...preferences.cuisinePreferences,
    ];

    return {
      preferences: allPreferences.map((pref) => ({
        categoryId: 'categoryId' in pref ? pref.categoryId : undefined,
        ingredientId: 'ingredientId' in pref ? pref.ingredientId : undefined,
        selected: pref.selected,
        preferenceType: pref.preferenceType,
      })) as PreferencesRequest['preferences'],
    };
  };

  const togglePreference = (section: keyof Preferences, id: string) => {
    setPreferences((prev) => {
      if (!prev) return prev;

      const newPreferences = { ...prev };
      newPreferences[section] = newPreferences[section].map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      );

      setPreferencesRequest(buildPreferencesRequest(newPreferences));
      return newPreferences;
    });
  };

  const savePreferences = async () => {
    if (!preferencesRequest) return;

    try {
      await $fetch(`${API_ENDPOINTS_PREFIX.node}/preferences`, {
        method: 'POST',
        body: JSON.stringify(preferencesRequest),
      });
      onClose?.();
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const clearAll = () => {
    setPreferences((prev) => {
      if (!prev) return prev;

      const newPreferences = {
        diets: prev.diets.map((item) => ({ ...item, selected: false })),
        allergies: prev.allergies.map((item) => ({ ...item, selected: false })),
        unfavoriteIngredients: prev.unfavoriteIngredients.map((item) => ({ ...item, selected: false })),
        cuisinePreferences: prev.cuisinePreferences.map((item) => ({ ...item, selected: false })),
      };

      setPreferencesRequest({ preferences: [] } satisfies PreferencesRequest);
      return newPreferences;
    });
  };

  const openAddModal = (section: 'diets' | 'allergies' | 'unfavoriteIngredients' | 'cuisinePreferences') => {
    setCurrentSection(section);
    setModalVisible(true);
  };

  const addNewItem = (selectedItem: SelectListData | null) => {
    if (!selectedItem) return;

    const itemId = selectedItem.id;
    const itemName = selectedItem.value;
    const ingredientId = selectedItem ? parseInt(selectedItem.id) : 0;
    setModalVisible(false);

    switch (currentSection) {
      case 'allergies':
        setPreferences((prev) => {
          if (!prev) return prev;

          const newPreferences = {
            ...prev,
            allergies: [
              ...prev.allergies,
              {
                id: itemId,
                name: itemName,
                ingredientId: ingredientId,
                selected: true,
                preferenceType: 'allergy' as const,
              },
            ],
          };

          setPreferencesRequest(buildPreferencesRequest(newPreferences));
          return newPreferences;
        });
        break;
      case 'unfavoriteIngredients':
        setPreferences((prev) => {
          if (!prev) return prev;

          const newPreferences = {
            ...prev,
            unfavoriteIngredients: [
              ...prev.unfavoriteIngredients,
              {
                id: itemId,
                name: itemName,
                ingredientId: ingredientId,
                selected: true,
                preferenceType: 'unfavorite_ingredient' as const,
              },
            ],
          };

          setPreferencesRequest(buildPreferencesRequest(newPreferences));
          return newPreferences;
        });
        break;
    }
  };

  const fetchProducts = useCallback(
    async (query: string) => {
      const products = await $fetch<Response<SearchProduct[]>>(`${API_ENDPOINTS_PREFIX.node}/ingredients/search`, {
        method: 'POST',
        body: JSON.stringify({ query, limit: 3 }),
      });

      return products.data.map((product) => ({
        id: product.id,
        value: product.name,
      })) as SelectListData[];
    },
    [$fetch]
  );

  return (
    <View className='flex-1 bg-background'>
      {/* Header */}
      <View className='flex-row items-center justify-between border-b border-gray-200 px-6 py-6'>
        <TouchableOpacity onPress={clearAll}>
          <Text className='text-gray-500'>Clear all</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color='#000' />
        </TouchableOpacity>
      </View>

      <ScrollView className='flex-1 px-4 py-6'>
        {/* Title and Description */}
        <View className='mb-6'>
          <Text className='mb-2 text-2xl font-bold'>Your preferences</Text>
          <Text className='text-base leading-relaxed text-gray-600'>
            Tell us about your preferences and we can choose the best recipes for you
          </Text>
        </View>

        {/* Diet Preferences */}
        <PreferenceSection
          title='Choose your diet'
          items={preferences?.diets}
          visibleCount={6}
          showAll={showAllDiets}
          onToggleShowAll={() => setShowAllDiets(!showAllDiets)}
          onToggleItem={(id) => togglePreference('diets', id)}
          onAddNew={() => openAddModal('diets')}
          showAddNew={false}
        />

        {/* Allergies */}
        <PreferenceSection
          title='Do you have allergies?'
          items={preferences?.allergies}
          visibleCount={6}
          showAll={showAllAllergies}
          onToggleShowAll={() => setShowAllAllergies(!showAllAllergies)}
          onToggleItem={(id) => togglePreference('allergies', id)}
          onAddNew={() => openAddModal('allergies')}
        />

        {/* Unfavorite Ingredients */}
        <PreferenceSection
          title='Unfavorite ingredients'
          items={preferences?.unfavoriteIngredients}
          visibleCount={6}
          showAll={showAllUnfavorite}
          onToggleShowAll={() => setShowAllUnfavorite(!showAllUnfavorite)}
          onToggleItem={(id) => togglePreference('unfavoriteIngredients', id)}
          onAddNew={() => openAddModal('unfavoriteIngredients')}
        />

        {/* Favorite Dishes */}
        <PreferenceSection
          title='Favorite dishes'
          items={preferences?.cuisinePreferences}
          visibleCount={6}
          showAll={showAllCuisines}
          onToggleShowAll={() => setShowAllCuisines(!showAllCuisines)}
          onToggleItem={(id) => togglePreference('cuisinePreferences', id)}
          onAddNew={() => openAddModal('cuisinePreferences')}
          showAddNew={false}
        />
      </ScrollView>

      {/* Save Button */}
      <View className='px-4 pb-4'>
        <Button onPress={savePreferences} className='w-full rounded-full bg-black py-4'>
          <Text className='text-center font-semibold text-white'>Save</Text>
        </Button>
      </View>

      {/* Add New Item Modal */}
      <BasicModal isModalOpen={modalVisible} setIsModalOpen={setModalVisible} className='gap-4'>
        <View className='flex-row items-center justify-between'>
          <Text className='text-lg font-semibold'>Add new item to {currentSection}</Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <X size={24} color='#000' />
          </TouchableOpacity>
        </View>

        <InputWithDropdown
          setSelected={(value) => {
            setNewItemText(value.value);
            setNewItem(value);
          }}
          data={[]}
          value={newItemText}
          fetchItems={fetchProducts}
          fontFamily='Comfortaa_400Regular'
          notFoundText='No results found'
          dropdownStyles={{
            borderColor: THEME.light.colors.primary,
          }}
          boxStyles={{
            borderColor: THEME.light.colors.primary,
          }}
        />

        <View className='flex-row gap-3'>
          <Button variant='outline' className='flex-1' onPress={() => setModalVisible(false)}>
            <Text>Cancel</Text>
          </Button>
          <Button className='flex-1 bg-primary' onPress={() => addNewItem(newItem)}>
            <Text className='text-white'>Add</Text>
          </Button>
        </View>
      </BasicModal>
    </View>
  );
}
