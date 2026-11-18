import type { Claim } from '../types/claim';

export const fakeClaims: Claim[] = [
  {
    id: 'c1',
    itemId: '2',
    claimerName: 'Amina T.',
    answer: 'A small brass key with the letter K scratched on it.',
    status: 'pending',
    createdAt: '2026-11-02',
  },
  {
    id: 'c2',
    itemId: '2',
    claimerName: 'Brice N.',
    answer: 'Silver keys with a blue keychain.',
    status: 'pending',
    createdAt: '2026-11-03',
  },
];

// Hidden details, keyed by item id. Only the finder will ever see these.
export const fakePrivateDetails: Record<string, string> = {
  '2': 'A small brass key with the letter K scratched on it',
};

export const HANDOVER_POINT = {
  name: 'Student Affairs Office',
  hours: 'Mon-Fri, 8:00 - 16:00',
};