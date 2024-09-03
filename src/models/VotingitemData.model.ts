export interface VotingItemData {
    votingItemId: number;
    description: string;
    voteCount: number;
}

export interface VotingItemProgress {
    votingItemId: number;
    progress: number;
}

export interface VotingItemIsChecked {
    votingItemId: number;
    isChecked: boolean;
}