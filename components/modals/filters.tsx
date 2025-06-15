import React, { useEffect, useState } from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from '~/assets/icons';
import { FiltersResponse, FiltersRequest } from '~/types/home';
import { useFetch } from '~/hooks/useFetch';
import { API_ENDPOINTS_PREFIX, THEME } from '~/lib/constants';
import { Slider } from '@miblanchard/react-native-slider';
import { capitalizeFirstLetter } from '~/lib/utils';
import { Response } from '~/types';

interface FilterPillProps {
  name: string;
  selected: boolean;
  onPress: () => void;
}

function FilterPill({ name, selected, onPress }: FilterPillProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mb-2 mr-2 rounded-full border px-4 py-2 ${
        selected ? 'border-primary bg-primary' : 'border-gray-300 bg-transparent'
      }`}>
      <Text className={`text-sm ${selected ? 'font-medium' : 'text-gray-700'}`}>{capitalizeFirstLetter(name)}</Text>
    </TouchableOpacity>
  );
}

interface FilterSectionProps {
  title: string;
  items: string[] | null;
  selectedItems: string[];
  onToggleItem: (item: string) => void;
  visibleCount: number;
  showAll: boolean;
  onToggleShowAll: () => void;
}

function FilterSection({
  title,
  items,
  selectedItems,
  onToggleItem,
  visibleCount,
  showAll,
  onToggleShowAll,
}: FilterSectionProps) {
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
          <FilterPill
            key={item}
            name={item}
            selected={selectedItems.includes(item)}
            onPress={() => onToggleItem(item)}
          />
        ))}
      </View>
      {hasMore && (
        <View className='mt-2 flex-row'>
          <TouchableOpacity onPress={onToggleShowAll}>
            <Text className='text-sm text-gray-500'>{showAll ? 'Show less' : 'Show more'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

interface FiltersPageProps {
  onClose?: () => void;
  filters: FiltersRequest;
  onApplyFilters: (filters: FiltersRequest) => void;
}

export default function FiltersPage({ onClose, filters, onApplyFilters }: FiltersPageProps) {
  const [availableFilters, setAvailableFilters] = useState<FiltersResponse | null>(null);
  const [currentFilters, setCurrentFilters] = useState<FiltersRequest>(filters);
  const [showAllDifficulties, setShowAllDifficulties] = useState(false);
  const [showAllDishTypes, setShowAllDishTypes] = useState(false);
  const [showAllDiets, setShowAllDiets] = useState(false);
  const [showAllCuisines, setShowAllCuisines] = useState(false);

  const $fetch = useFetch();

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await $fetch<Response<FiltersResponse>>(`${API_ENDPOINTS_PREFIX.node}/recipes/filters`);
        setAvailableFilters(response.data);
      } catch (error) {
        console.error('Failed to fetch filters:', error);
      }
    };
    fetchFilters();
  }, [$fetch]);

  const toggleFilterItem = (
    section: keyof Pick<FiltersRequest, 'dishTypes' | 'diets' | 'difficulty' | 'cuisines'>,
    item: string
  ) => {
    setCurrentFilters((prev) => {
      const currentItems = prev[section];
      const isSelected = currentItems.includes(item);

      return {
        ...prev,
        [section]: isSelected ? currentItems.filter((i) => i !== item) : [...currentItems, item],
      };
    });
  };

  const handleCookTimeChange = (values: [number, number]) => {
    setCurrentFilters((prev) => ({
      ...prev,
      cookTime: {
        min: values[0],
        max: values[1],
      },
    }));
  };

  const clearAll = () => {
    setCurrentFilters({
      searchQuery: '',
      cookTime: { min: 5, max: 120 },
      difficulty: [],
      dishTypes: [],
      diets: [],
      cuisines: [],
      ingredients: { includeIds: [], excludeIds: [] },
    });
  };

  const getAppliedFiltersCount = () => {
    let count = 0;

    if (currentFilters.cookTime.min > 5 || currentFilters.cookTime.max < 120) {
      count++;
    }

    count += currentFilters.difficulty.length;
    count += currentFilters.dishTypes.length;
    count += currentFilters.diets.length;
    count += currentFilters.cuisines.length;
    count += currentFilters.ingredients.includeIds.length;
    count += currentFilters.ingredients.excludeIds.length;

    return count;
  };

  const handleApply = () => {
    onApplyFilters(currentFilters);
    onClose?.();
  };

  const formatCookTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const sortedDiets = availableFilters?.diets
    ? [...availableFilters.diets].sort((a, b) => {
        if (a.length !== b.length) {
          return a.length - b.length;
        }
        return a.localeCompare(b);
      })
    : null;

  return (
    <SafeAreaView className='flex-1 bg-background'>
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
          <Text className='mb-2 text-2xl font-bold'>Filters</Text>
          <Text className='text-base leading-relaxed text-gray-600'>
            Customize your recipe search to find exactly what you&apos;re looking for
          </Text>
        </View>

        {/* Cooking Time Slider */}
        <View className='mb-6'>
          <Text className='mb-2 text-lg font-semibold'>Cooking Time</Text>
          <Text className='text-center text-gray-600'>
            {formatCookTime(currentFilters.cookTime.min)} - {formatCookTime(currentFilters.cookTime.max)}
          </Text>
          <Slider
            minimumValue={5}
            maximumValue={120}
            step={1}
            value={[currentFilters.cookTime.min, currentFilters.cookTime.max]}
            onValueChange={handleCookTimeChange}
            trackStyle={{ backgroundColor: THEME.light.colors.foreground }}
            minimumTrackTintColor={THEME.light.colors.primary}
            maximumTrackTintColor={THEME.light.colors.primary}
            thumbStyle={{ backgroundColor: THEME.light.colors.primary }}
          />
        </View>

        {/* Difficulty */}
        <FilterSection
          title='Difficulty'
          items={availableFilters?.difficulties}
          selectedItems={currentFilters.difficulty}
          onToggleItem={(item) => toggleFilterItem('difficulty', item)}
          visibleCount={3}
          showAll={showAllDifficulties}
          onToggleShowAll={() => setShowAllDifficulties(!showAllDifficulties)}
        />

        {/* Dish Types */}
        <FilterSection
          title='Dish Types'
          items={availableFilters?.dishTypes}
          selectedItems={currentFilters.dishTypes}
          onToggleItem={(item) => toggleFilterItem('dishTypes', item)}
          visibleCount={6}
          showAll={showAllDishTypes}
          onToggleShowAll={() => setShowAllDishTypes(!showAllDishTypes)}
        />

        {/* Diets */}
        <FilterSection
          title='Diets'
          items={sortedDiets}
          selectedItems={currentFilters.diets}
          onToggleItem={(item) => toggleFilterItem('diets', item)}
          visibleCount={6}
          showAll={showAllDiets}
          onToggleShowAll={() => setShowAllDiets(!showAllDiets)}
        />

        {/* Cuisines */}
        <FilterSection
          title='Cuisines'
          items={availableFilters?.cuisines}
          selectedItems={currentFilters.cuisines}
          onToggleItem={(item) => toggleFilterItem('cuisines', item)}
          visibleCount={6}
          showAll={showAllCuisines}
          onToggleShowAll={() => setShowAllCuisines(!showAllCuisines)}
        />
      </ScrollView>

      {/* Apply Button */}
      <View className='p-4'>
        <Button onPress={handleApply} className='w-full rounded-full bg-black py-4'>
          <Text className='text-center font-semibold text-white'>
            Apply {getAppliedFiltersCount() > 0 && `(${getAppliedFiltersCount()})`}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
