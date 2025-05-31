export type ShoppingListItem = {
  id: string;
  name: string;
  amount: number;
  unit: string;
  isChecked: boolean;
};

export type SearchItem = {
  id: string;
  name:
    | string
    | {
        one: string;
        many: string;
      };
};
