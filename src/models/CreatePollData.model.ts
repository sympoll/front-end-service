export interface CreatePollData {
    title: string;
    description: string;
    nofAnswersAllowed: number | undefined;
    creatorId: string;
    groupId: string;
    deadline: string;
    votingItems: string[];
}