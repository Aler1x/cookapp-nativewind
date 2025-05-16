export interface Recipe {
  id: string;
  title: string;
  slug: string;
  image: {
    url: string;
  };
  difficulty: string;
  duration: {
    preparation: number;
    cooking?: number;
    baking?: number;
    resting?: number;
    total?: number;
  };
  user_reactions: {
    rating: number;
  };
  tags: Array<{
    id: string;
    slug: string;
    title: string;
    type: string;
  }>;
}

export interface MockupData {
  data: Recipe[];
} 