export interface CreatePollData {
    userId: string;
    title: string;
    description: string;
    nofAnswersAllowed: number | undefined;
    creatorId: string;
    groupId: string;
    deadline: string;
    votingItems: string[];
}