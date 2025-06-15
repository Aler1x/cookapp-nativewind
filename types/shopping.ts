export interface ShoppingListItem {
  id: string;
  name: string;
  amount: number;
  unit?: string;
  isChecked: boolean;
  category?: string;
  notes?: string;
  addedAt?: Date;
  checkedAt?: Date;
}

export type AddItemInput = Omit<ShoppingListItem, 'id' | 'isChecked'>;

export interface ShoppingListItemProps {
  item: ShoppingListItem;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdateAmount: (id: string, amount: number) => void;
}

export interface ShoppingListSectionData {
  title: string;
  data: ShoppingListItem[];
}

export type UnitType = 'volume' | 'weight' | 'count' | 'length' | 'temperature' | 'other';

export interface UnitMapping {
  [key: string]: string;
}

export interface ShareOptions {
  dialogTitle?: string;
  subject?: string;
  message?: string;
}

export interface ShareResult {
  success: boolean;
  error?: {
    message: string;
    code?: string;
  };
}

export type SearchUnit = {
  id: string;
  name: {
    one: string;
    many: string;
  };
};
