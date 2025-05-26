export interface Recipe {
  id: string;
  title: string;
  slug: string; // Used for the URL of the recipe
  difficulty: 'easy' | 'medium' | 'hard';
  image: {
    url: string;
  };
  meta: {
    description: string;
    source: string[]; // URLs
  };
  author: {
    id: string;
    name: string;
  };
  duration: {
    preparation: number;
    cooking?: number;
    resting?: number;
    total?: number;
  };
  servings: {
    amount: number;
    type: 'servings' | 'pieces';
  };
  nutrition?: {
    calories: number;
    fat: number;
    protein: number;
    carbohydrate: number;
  };
  tags: Tag[];
  user_reactions: {
    rating: number;
  };
  categories: {
    main: Category;
    sub: Category[];
  };
  ingredients: Ingredient[];
  steps: Step[];
}

export interface Step {
  id: string;
  text: string;
}

export interface Ingredient {
  id: string;
  name: string;
  measurements: {
    imperial: {
      amount: number;
      unit: Unit;
    };
    metric: {
      amount: number;
      unit: Unit;
    };
  };
}
export interface Tag {
  id: string;
  slug: string;
  title: string;
  type: string;
}

export interface Category {
  id: string;
  slug: string;
  title: string;
}

export interface Page {
  data: Recipe[];
  meta: {
    page: number;
    pages: number;
    total: number; // items
  };
}

export interface Unit {
  id: string;
  name: {
    one: string;
    many: string;
  };
  type: 'imperial' | 'metric';
}

export interface MockupData {
  data: Recipe[];
}
