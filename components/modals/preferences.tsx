import React, { useEffect, useState } from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { X } from '~/assets/icons';
import { Preferences } from '~/types/profile';
import BasicModal from '../ui/basic-modal';
import { useFetch } from '~/lib/fetch';
import { API_ENDPOINTS_PREFIX } from '~/lib/constants';

interface PreferencePillProps {
  name: string;
  selected: boolean;
  onPress: () => void;
}

function PreferencePill({ name, selected, onPress }: PreferencePillProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-2 mb-2 border ${selected ? 'bg-primary border-primary' : 'bg-transparent border-gray-300'
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
      <Text className='text-lg font-semibold mb-3'>{title}</Text>
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
      <View className='flex-row mt-2'>
        {hasMore && (
          <TouchableOpacity onPress={onToggleShowAll} className='mr-4'>
            <Text className='text-gray-500 text-sm'>{showAll ? 'Show less' : 'Show more'}</Text>
          </TouchableOpacity>
        )}
        {showAddNew && (
          <TouchableOpacity onPress={onAddNew}>
            <Text className='text-gray-500 text-sm'>Add new</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

interface PreferencesPageProps {
  onClose?: () => void;
  onSave?: (preferences: Preferences) => void;
  initialPreferences?: Preferences;
}

export default function PreferencesPage({
  onClose,
  onSave,
}: PreferencesPageProps) {
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [showAllDiets, setShowAllDiets] = useState(false);
  const [showAllAllergies, setShowAllAllergies] = useState(false);
  const [showAllUnfavorite, setShowAllUnfavorite] = useState(false);
  const [showAllCuisines, setShowAllCuisines] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [currentSection, setCurrentSection] = useState<
    'diets' | 'allergies' | 'unfavoriteIngredients' | 'cuisinePreferences'
  >('diets');

  const $fetch = useFetch();

  useEffect(() => {
    const fetchPreferences = async () => {
      const preferences = await $fetch<{ data: Preferences }>(`${API_ENDPOINTS_PREFIX.node}/preferences`);
      console.log(preferences);
      setPreferences(preferences.data);
    };
    fetchPreferences();
  }, [$fetch]);

  const togglePreference = (section: keyof Preferences, id: string) => {
    setPreferences((prev) => {
      if (!prev) return prev;
      const newPreferences = { ...prev };
      newPreferences[section] = newPreferences[section].map((item) => (item.id === id ? { ...item, selected: !item.selected } : item));
      console.log(newPreferences);
      return newPreferences;
    });
  };

  const clearAll = () => {
    setPreferences((prev) => ({
      diets: prev.diets.map((item) => ({ ...item, selected: false })),
      allergies: prev.allergies.map((item) => ({ ...item, selected: false })),
      unfavoriteIngredients: prev.unfavoriteIngredients.map((item) => ({ ...item, selected: false })),
      cuisinePreferences: prev.cuisinePreferences.map((item) => ({ ...item, selected: false })),
    }));
  };

  const openAddModal = (section: 'diets' | 'allergies' | 'unfavoriteIngredients' | 'cuisinePreferences') => {
    setCurrentSection(section);
    setModalVisible(true);
  };

  const addNewItem = () => {
    if (newItemText.trim()) {
      console.log('Adding new item:', newItemText, 'to section:', currentSection);
      // Here you would typically make an API call to add the new preference
      setNewItemText('');
      setModalVisible(false);
    }
  };

  const savePreferences = () => {
    console.log('Saving preferences:', preferences);
    if (onSave) {
      onSave(preferences);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <View className='flex-1 bg-background'>
      {/* Header */}
      <View className='flex-row items-center justify-between px-6 py-6 border-b border-gray-200'>
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
          <Text className='text-2xl font-bold mb-2'>Your preferences</Text>
          <Text className='text-gray-600 text-base leading-relaxed'>
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
        />
      </ScrollView>

      {/* Save Button */}
      <View className='px-4 pb-4'>
        <Button onPress={savePreferences} className='w-full py-4 rounded-full bg-black'>
          <Text className='text-white font-semibold text-center'>Save</Text>
        </Button>
      </View>

      {/* Add New Item Modal */}
      <BasicModal isModalOpen={modalVisible} setIsModalOpen={setModalVisible}>
        <View className='flex-row items-center justify-between mb-4'>
          <Text className='text-lg font-semibold'>Add new item</Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <X size={24} color='#000' />
          </TouchableOpacity>
        </View>

        <TextInput
          className='border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base'
          placeholder='Enter item name...'
          value={newItemText}
          onChangeText={setNewItemText}
          autoFocus
        />

        <View className='flex-row gap-3'>
          <Button variant='outline' className='flex-1' onPress={() => setModalVisible(false)}>
            <Text>Cancel</Text>
          </Button>
          <Button className='flex-1 bg-primary' onPress={addNewItem}>
            <Text className='text-white'>Add</Text>
          </Button>
        </View>
      </BasicModal>
    </View>
  );
}
