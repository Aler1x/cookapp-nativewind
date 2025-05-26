type PreferenceType = 'diet' | 'cousine' | 'unfavourite_ingredient' | 'allergy';

export interface CategoryPreference {
  id: string;
  name: string;
  categoryId: number;
  selected: boolean;
  preferenceType: PreferenceType;
}

export interface IgredientPreference {
  id: string;
  name: string;
  ingredientId: number;
  selected: boolean;
  preferenceType: PreferenceType;
}

export type AllergicIngredientPreference = CategoryPreference | IgredientPreference;

export type UnfavouriveIgredientPreference = IgredientPreference;

export type Preference = CategoryPreference | UnfavouriveIgredientPreference | AllergicIngredientPreference;

export type Preferences = {
  diets: CategoryPreference[];
  allergies: AllergicIngredientPreference[];
  unfavouriteIngrediets: UnfavouriveIgredientPreference[];
  cousinePreferences: CategoryPreference[];
};
