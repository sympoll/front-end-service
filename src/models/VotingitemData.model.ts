export interface VotingItemData {
    votingItemId: string;
    votingItemOrdinal: number;
    description: string;
    voteCount: number;
}

export interface VotingItemProgress {
    votingItemID: string;
    progress: number;
}

export interface VotingItemIsChecked {
    votingItemID: string;
    isChecked: boolean;
}