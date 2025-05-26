import { Recipe } from './recipe';

export interface CollectionDetails {
  id: string;
  userId: string;
  name: string;
  recipes: Recipe[];
}

export interface Collection {
  id: string;
  name: string;
  recipes: {
    imagesUrl: string[];
  };
}
