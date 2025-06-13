export interface FiltersResponse {
  dishTypes: string[];
  diets: string[];
  difficulties: string[];
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
  ingredients: {
    includeIds: number[];
    excludeIds: number[];
  };
}

export interface BadgeFilters {
  id: number;
  name: string;
  isActive?: boolean;
}

export const BADGES: BadgeFilters[] = [
  {
    id: 1,
    name: 'Popular',
  },
  {
    id: 2,
    name: 'Quick',
  },
  {
    id: 3,
    name: 'Italian 🍝',
  },
  {
    id: 4,
    name: 'Healthy 🥗',
  },
  {
    id: 5,
    name: 'Asian 🍙',
  },
  {
    id: 6,
    name: 'Easy',
  },
];
