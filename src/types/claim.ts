export type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'on_hold';

export type Claim = {
  id: string;
  itemId: string;
  claimerName: string;
  answer: string;
  status: ClaimStatus;
  createdAt: string;
};