type PreferenceType = 'diet' | 'cuisine' | 'unfavorite_ingredient' | 'allergy';

export interface CategoryPreference {
  id: string;
  name: string;
  categoryId: number;
  selected: boolean;
  preferenceType: PreferenceType;
}

export interface IngredientPreference {
  id: string;
  name: string;
  ingredientId: number;
  selected: boolean;
  preferenceType: PreferenceType;
}

export type AllergicIngredientPreference = CategoryPreference | IngredientPreference;

export type UnfavoriteIngredientPreference = IngredientPreference;

export type Preference = CategoryPreference | UnfavoriteIngredientPreference | AllergicIngredientPreference;

export type Preferences = {
  diets: CategoryPreference[];
  allergies: AllergicIngredientPreference[];
  unfavoriteIngredients: UnfavoriteIngredientPreference[];
  cuisinePreferences: CategoryPreference[];
};
