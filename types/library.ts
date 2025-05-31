import { Recipe } from './recipe';

export type CollectionDetails = {
  id: string;
  userId: string;
  name: string;
  recipes: Recipe[];
};

export type Collection = {
  id: string;
  name: string;
  recipes: {
    imagesUrl: string[];
  };
};
