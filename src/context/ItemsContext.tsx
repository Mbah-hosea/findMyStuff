import { createContext, ReactNode, useContext, useState } from 'react';
import { CURRENT_USER_ITEM_IDS, fakeItems } from '../data/fakeItems';
import type { Item } from '../types/item';

type NewItem = Omit<Item, 'id' | 'status'>;

type ItemsContextValue = {
  items: Item[];
  myItemIds: string[];
  addItem: (data: NewItem) => string;
};

const ItemsContext = createContext<ItemsContextValue | null>(null);

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>(fakeItems);
  const [myItemIds, setMyItemIds] = useState<string[]>(CURRENT_USER_ITEM_IDS);

  const addItem = (data: NewItem) => {
    const id = Date.now().toString();
    setItems((prev) => [{ ...data, id, status: 'open' }, ...prev]);
    setMyItemIds((prev) => [id, ...prev]);
    return id;
  };

  return (
    <ItemsContext.Provider value={{ items, myItemIds, addItem }}>
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  const ctx = useContext(ItemsContext);
  if (!ctx) throw new Error('useItems must be used inside ItemsProvider');
  return ctx;
}