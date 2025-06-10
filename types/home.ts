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
};