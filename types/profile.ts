type PreferenceType = 'diet' | 'cuisine' | 'unfavorite_ingredient' | 'allergy';

export type CategoryPreference = {
  id: string;
  name: string;
  categoryId: number;
  selected: boolean;
  preferenceType: PreferenceType;
};

export type IngredientPreference = {
  id: string;
  name: string;
  ingredientId: number;
  selected: boolean;
  preferenceType: PreferenceType;
};

export type AllergicIngredientPreference = CategoryPreference | IngredientPreference;

export type UnfavoriteIngredientPreference = IngredientPreference;

export type Preference = CategoryPreference | UnfavoriteIngredientPreference | AllergicIngredientPreference;

export type Preferences = {
  diets: CategoryPreference[];
  allergies: AllergicIngredientPreference[];
  unfavoriteIngredients: UnfavoriteIngredientPreference[];
  cuisinePreferences: CategoryPreference[];
};

export type PreferencesRequest = {
  preferences:
    | [
        {
          categoryId?: number;
          ingredientId?: number;
          selected: boolean;
          preferenceType: PreferenceType;
        },
      ]
    | [];
};

export type Job = {
  jobId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  recipeId?: string;
  recipeName?: string;
  error: string;
};
