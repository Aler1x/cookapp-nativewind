export interface FiltersResponse {
  dishTypes: string[];
  diets: string[];
  difficulties: string[];
  cuisines: string[];
}

export interface FiltersRequest {
  searchQuery: string;
  cookTime: {
    min: number;
    max: number;
  };
  difficulty: string[];
  dishTypes: string[];
  diets: string[];
  cuisines: string[];
  ingredients: {
    includeIds: number[];
    excludeIds: number[];
  };
}

export interface BadgeFilters {
  id: number;
  name: string;
  settings: {
    dishTypes?: string[];
    diets?: string[];
    cuisines?: string[];
    difficulties?: string[];
    cookTime?: {
      min: number;
      max: number;
    };
  };
  isActive?: boolean;
}

export const BADGES: BadgeFilters[] = [
  {
    id: 1,
    name: 'Quick 🔥',
    settings: {
      cookTime: {
        min: 1,
        max: 30,
      },
    },
  },
  {
    id: 2,
    name: 'Italian 🇮🇹',
    settings: {
      dishTypes: ['pasta', 'pizza', 'dessert'],
    },
  },
  {
    id: 3,
    name: 'Asian 🇯🇵',
    settings: {
      dishTypes: ['sushi', 'ramen', 'dessert', 'noodles'],
    },
  },
  {
    id: 4,
    name: 'Easy 🥳',
    settings: {
      difficulties: ['easy'],
    },
  },
];
