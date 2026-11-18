import type { Item } from '../types/item';
import type { Match } from '../types/match';
export const fakeItems: Item[] = [
  {
    id: '1',
    type: 'lost',
    category: 'Phone',
    title: 'Black Samsung phone',
    description: 'Lost after the afternoon lecture. Has a cracked corner.',
    color: 'Black',
    location: 'Science Block',
    date: '2026-11-01',
    status: 'open',
  },
  {
    id: '2',
    type: 'found',
    category: 'Keys',
    title: 'Set of keys with a red tag',
    description: 'Found on a bench near the library.',
    color: 'Silver',
    location: 'Library',
    date: '2026-11-02',
    status: 'open',
  },
  {
    id: '3',
    type: 'lost',
    category: 'ID Card',
    title: 'Student ID card',
    description: 'Lost somewhere between the cafeteria and the main gate.',
    color: 'White',
    location: 'Cafeteria',
    date: '2026-10-30',
    status: 'open',
  },
  {
    id: '4',
    type: 'found',
    category: 'Bag',
    title: 'Blue backpack',
    description: 'Left in a lecture hall after evening class.',
    color: 'Blue',
    location: 'Lecture Hall B',
    date: '2026-11-02',
    status: 'open',
  },
  
];
export const fakeMatches: Match[] = [
  { id: 'm1', lostItemId: '1', foundItemId: '4', score: 82 },
  { id: 'm2', lostItemId: '3', foundItemId: '2', score: 64 },
];

// Pretend the logged-in user owns these posts (replaced by real login later)
export const CURRENT_USER_ITEM_IDS = ['1', '2'];