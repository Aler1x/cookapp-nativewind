import { ShoppingListItem } from './shopping';
import { Ingredient } from './recipe';

export interface ShoppingListStore {
  items: ShoppingListItem[];
  addItem: (item: Omit<ShoppingListItem, 'id' | 'isChecked'>) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  updateItemAmount: (id: string, amount: number) => void;
  clearCheckedItems: () => void;
  clearAllItems: () => void;
  addIngredientsFromRecipe: (ingredients: Ingredient[], recipeId: string, recipeName: string) => void;
  getUncheckedItems: () => ShoppingListItem[];
  getCheckedItems: () => ShoppingListItem[];
  formatShoppingListForSharing: () => string;
}
