import { Recipe } from './recipe';

export type Collection = {
  id: string;
  userId: string;
  name: string;
  recipes: Recipe[];
};

export type CollectionPage = {
  id: string;
  name: string;
  recipes: string[];
};
