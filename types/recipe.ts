export interface RecipeDetails {
  id: string;
  title: string;
  slug: string; // Used for the URL of the recipe
  difficulty: 'easy' | 'medium' | 'hard';
  mainImageUrl: string;
  description: string;
  source: 'ManuallyCreated' | 'AIGenerated' | 'External' | 'Original'; // wtf is last one?
  author?: {
    // optional, because on db it don't link to user so it's probably always null
    id: string;
    name: string;
  };
  duration: number; // in minutes
  servings: number;
  nutrition?: {
    calories: number;
    fat: number;
    protein: number;
    carbohydrate: number;
  };
  categories: Category[];
  ingredients: Ingredient[];
  steps: Step[];
  isPublic: boolean; // if false, oh never mind it never gonna be false
  sourceUrl: string;
}

export interface Recipe {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  slug: string;
  mainImageUrl: string;
  duration: number; // in minutes
  servings: number;
  category: Category;
}

export interface Step {
  id: string;
  description: string;
  stepNumber: number;
}

export interface Ingredient {
  id: string;
  name: string;
  measurements: {
    amount: number;
    unit: Unit;
  };
}

export interface Unit {
  id: string;
  name: {
    one: string;
    many: string;
  };
  type: string; // wtf
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: {
    id: string;
    name: string;
  };
  imageUrl: string;
}

export interface Page {
  data: Recipe[];
  meta: {
    page: number;
    pages: number;
    total: number; // items
  };
}
