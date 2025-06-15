import { Recipe } from './recipe';

export type Collection = {
  id: string;
  userId: string;
  name: string;
  recipes: Recipe[];
};

export type CollectionPage = {
  id: number;
  name: string;
  recipeCount: number;
  recipes: Pick<Recipe, 'id' | 'mainImageUrl'>[];
};

export type CollectionPreview = Pick<Collection, 'id' | 'name'>;
