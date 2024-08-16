export interface VotingItemData {
    votingItemId: string;
    description: string;
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