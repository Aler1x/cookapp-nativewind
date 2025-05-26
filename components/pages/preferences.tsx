import React, { useState } from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { X } from 'lucide-react-native';
import {
  Preferences,
  CategoryPreference,
  AllergicIngredientPreference,
  UnfavouriveIgredientPreference,
} from '~/types/profile';

// Mock data - this would come from your backend
const mockPreferences: Preferences = {
  diets: [
    { id: '1', name: 'Vegetarian', categoryId: 1, selected: true, preferenceType: 'diet' },
    { id: '2', name: 'Gluten Free', categoryId: 2, selected: false, preferenceType: 'diet' },
    { id: '3', name: 'Lactose Free', categoryId: 3, selected: false, preferenceType: 'diet' },
    { id: '4', name: 'Low Fat', categoryId: 4, selected: false, preferenceType: 'diet' },
    { id: '5', name: 'Sugar Free', categoryId: 5, selected: false, preferenceType: 'diet' },
    { id: '6', name: 'Appetizers', categoryId: 6, selected: false, preferenceType: 'diet' },
  ],
  allergies: [
    { id: '7', name: 'Cows milk', categoryId: 7, selected: false, preferenceType: 'allergy' },
    { id: '8', name: 'Eggs', categoryId: 8, selected: false, preferenceType: 'allergy' },
    { id: '9', name: 'Peanut', categoryId: 9, selected: false, preferenceType: 'allergy' },
    { id: '10', name: 'Soy', categoryId: 10, selected: false, preferenceType: 'allergy' },
    { id: '11', name: 'Prawns', categoryId: 11, selected: false, preferenceType: 'allergy' },
    { id: '12', name: 'Walnuts', categoryId: 12, selected: false, preferenceType: 'allergy' },
    { id: '13', name: 'Cashews', categoryId: 13, selected: false, preferenceType: 'allergy' },
  ],
  unfavouriteIngrediets: [
    { id: '14', name: 'Onions', ingredientId: 14, selected: false, preferenceType: 'unfavourite_ingredient' },
    { id: '15', name: 'Garlic', ingredientId: 15, selected: false, preferenceType: 'unfavourite_ingredient' },
  ],
  cousinePreferences: [
    { id: '16', name: 'Pasta', categoryId: 16, selected: true, preferenceType: 'cousine' },
    { id: '17', name: 'Soup', categoryId: 17, selected: false, preferenceType: 'cousine' },
    { id: '18', name: 'Salad', categoryId: 18, selected: false, preferenceType: 'cousine' },
    { id: '19', name: 'Pizza', categoryId: 19, selected: false, preferenceType: 'cousine' },
    { id: '20', name: 'Bowl', categoryId: 20, selected: false, preferenceType: 'cousine' },
    { id: '21', name: 'Dessert', categoryId: 21, selected: false, preferenceType: 'cousine' },
    { id: '22', name: 'Stew', categoryId: 22, selected: false, preferenceType: 'cousine' },
    { id: '23', name: 'Sandwiches', categoryId: 23, selected: false, preferenceType: 'cousine' },
  ],
};

interface PreferencePillProps {
  name: string;
  selected: boolean;
  onPress: () => void;
}

function PreferencePill({ name, selected, onPress }: PreferencePillProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-2 mb-2 border ${
        selected ? 'bg-primary border-primary' : 'bg-transparent border-gray-300'
      }`}>
      <Text className={`text-sm ${selected ? 'text-white font-medium' : 'text-gray-700'}`}>{name}</Text>
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
  const displayItems = showAll ? items : items.slice(0, visibleCount);
  const hasMore = items.length > visibleCount;

  return (
    <View className='mb-6'>
      <Text className='text-lg font-semibold mb-3'>{title}</Text>
      <View className='flex-row flex-wrap'>
        {displayItems.map((item) => (
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
  initialPreferences = mockPreferences,
}: PreferencesPageProps) {
  const [preferences, setPreferences] = useState<Preferences>(initialPreferences);
  const [showAllDiets, setShowAllDiets] = useState(false);
  const [showAllAllergies, setShowAllAllergies] = useState(false);
  const [showAllUnfavorites, setShowAllUnfavorites] = useState(false);
  const [showAllCousines, setShowAllCousines] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [currentSection, setCurrentSection] = useState<
    'diets' | 'allergies' | 'unfavouriteIngrediets' | 'cousinePreferences'
  >('diets');

  const togglePreference = (section: keyof Preferences, id: string) => {
    setPreferences((prev) => ({
      ...prev,
      [section]: prev[section].map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)),
    }));
  };

  const clearAll = () => {
    setPreferences((prev) => ({
      diets: prev.diets.map((item) => ({ ...item, selected: false })),
      allergies: prev.allergies.map((item) => ({ ...item, selected: false })),
      unfavouriteIngrediets: prev.unfavouriteIngrediets.map((item) => ({ ...item, selected: false })),
      cousinePreferences: prev.cousinePreferences.map((item) => ({ ...item, selected: false })),
    }));
  };

  const openAddModal = (section: 'diets' | 'allergies' | 'unfavouriteIngrediets' | 'cousinePreferences') => {
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
      <View className='flex-row items-center justify-between px-4 py-4 border-b border-gray-200'>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color='#000' />
        </TouchableOpacity>
        <TouchableOpacity onPress={clearAll}>
          <Text className='text-gray-500'>Clear all</Text>
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
          items={preferences.diets}
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
          items={preferences.allergies}
          visibleCount={6}
          showAll={showAllAllergies}
          onToggleShowAll={() => setShowAllAllergies(!showAllAllergies)}
          onToggleItem={(id) => togglePreference('allergies', id)}
          onAddNew={() => openAddModal('allergies')}
        />

        {/* Unfavorite Ingredients */}
        <PreferenceSection
          title='Unfavorite ingredients'
          items={preferences.unfavouriteIngrediets}
          visibleCount={6}
          showAll={showAllUnfavorites}
          onToggleShowAll={() => setShowAllUnfavorites(!showAllUnfavorites)}
          onToggleItem={(id) => togglePreference('unfavouriteIngrediets', id)}
          onAddNew={() => openAddModal('unfavouriteIngrediets')}
        />

        {/* Favorite Dishes */}
        <PreferenceSection
          title='Favorite dishes'
          items={preferences.cousinePreferences}
          visibleCount={6}
          showAll={showAllCousines}
          onToggleShowAll={() => setShowAllCousines(!showAllCousines)}
          onToggleItem={(id) => togglePreference('cousinePreferences', id)}
          onAddNew={() => openAddModal('cousinePreferences')}
        />
      </ScrollView>

      {/* Save Button */}
      <View className='px-4 pb-4'>
        <Button onPress={savePreferences} className='w-full py-4 rounded-full bg-black'>
          <Text className='text-white font-semibold text-center'>Save</Text>
        </Button>
      </View>

      {/* Add New Item Modal */}
      <Modal
        visible={modalVisible}
        animationType='slide'
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View className='flex-1 justify-end bg-black/50'>
          <View className='bg-white rounded-t-3xl p-6'>
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
          </View>
        </View>
      </Modal>
    </View>
  );
}
