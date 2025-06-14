export interface RecipeFull {
  id: string;
  title: string;
  slug: string; // Used for the URL of the recipe
  difficulty: 'easy' | 'medium' | 'hard';
  mainImageUrl: string;
  description?: string;
  source: 'MANUALLY_CREATED' | 'AI' | 'EXTERNAL' | 'ORIGINAL'; // wtf is last one?
  author?: {
    // optional, because on db it don't link to user so it's probably null
    id: string;
    name: string;
  };
  duration: number; // in minutes
  servings: number;
  nutritions?: {
    calories: number;
    fat: number;
    protein: number;
    carbohydrate: number;
  };
  categories: Category[];
  ingredients: Ingredient[];
  steps: Step[];
  isPublic: boolean; // if false, oh nevermind it never gonna be false
  sourceUrl: string;
  rating?: number;
}

export type Recipe = {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  slug: string;
  mainImageUrl: string;
  duration: number; // in minutes
  servings: number;
  categories: Category[];
  rating?: number;
};

export type Step = {
  id: string;
  description: string;
  stepNumber: number;
};

export type Ingredient = {
  id: string;
  name: string;
  measurements: {
    amount: number;
    unit: Unit;
  };
};

export type Unit = {
  id: string;
  name: {
    one: string;
    many: string;
  };
  type: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  type: {
    id: string;
    name: string;
  };
  imageUrl: string;
};
