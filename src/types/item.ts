export type ItemType = 'lost' | 'found';
export type ItemStatus = 'open' | 'matched' | 'claimed' | 'returned';

export type Item = {
  id: string;
  type: ItemType;
  category: string;
  title: string;
  description: string;
  color: string;
  location: string;
  date: string;
  status: ItemStatus;
};