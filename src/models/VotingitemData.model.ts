export interface VotingItemData {
  votingItemId: string;
  description: string;
  checked: boolean;
  voteCount: number;
}

export interface VotingItemProgress {
  votingItemId: string;
  progress: number;
}

export interface VotingItemIsChecked {
  votingItemId: string;
  isChecked: boolean;
}
