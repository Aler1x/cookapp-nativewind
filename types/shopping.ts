export type ShoppingListItem = {
  id: string;
  name: string;
  amount: number;
  unit: string;
  isChecked: boolean;
};

export type SearchItem = {
  id: string;
  name: string
};

export type SearchUnit = {
  id: string;
  name: {
    one: string;
    many: string;
  };
};