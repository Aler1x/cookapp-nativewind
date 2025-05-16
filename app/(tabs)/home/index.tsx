import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { View } from '~/components/ui/view';
import RecipeCard from "~/components/recipe-card";
import CategoryBadge from '~/components/category-badge';
import SearchBar from '~/components/search-bar';
import { RecipePage } from '~/mockup/recipe-data';
import { Recipe } from '~/types';

// Category types for the filter badges
const categories = [
  { id: '1', title: 'Popular' },
  { id: '2', title: 'Gluten Free' },
  { id: '3', title: 'Soup' },
  { id: '4', title: 'Pizza' },
];

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('1');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = RecipePage;
        setRecipes(data.data.slice(0, 10));
      } catch (error) {
        console.error('Failed to load recipe data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getTotalDuration = (recipe: Recipe): number => {
    const { preparation, cooking, baking, resting } = recipe.duration;
    return (preparation || 0) + (cooking || 0) + (baking || 0) + (resting || 0);
  };

  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularRecipes = [...recipes].sort((a, b) => 
    (b.user_reactions?.rating || 0) - (a.user_reactions?.rating || 0)
  ).slice(0, 5);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4">
        <View className="mt-4 mb-2 max-w-[180px]">
          <Text className="text-2xl font-bold">What do you want to cook today?</Text>
        </View>

        <SearchBar 
          placeholder="Recipe, ingredient"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="py-4"
        >
          {categories.map(category => (
            <CategoryBadge
              key={category.id}
              title={category.title}
              isActive={activeCategory === category.id}
              onPress={() => setActiveCategory(category.id)}
            />
          ))}
        </ScrollView>

        <View className="mt-2 mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold">Popular Recipes</Text>
            <TouchableOpacity>
              <Text className="text-sm text-gray-500">View all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {loading ? (
              <Text>Loading recipes...</Text>
            ) : (
              popularRecipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  image={recipe.image.url}
                  size="medium"
                  rating={recipe.user_reactions?.rating || 0}
                  duration={getTotalDuration(recipe)}
                />
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
