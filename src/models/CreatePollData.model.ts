export interface CreatePollData {
    title: string;
    description: string;
    nofAnswersAllowed: number;
    creatorId: string;
    groupId: string;
    deadline: string;
    votingItems: string[];
}