import { VotingItemData } from "./VotingitemData.model";

export interface PollData {
    pollId: string;
    title: string;
    description: string;
    nofAnswersAllowed: number;
    creatorId: string;
    groupId: string;
    timeCreated: string;
    timeUpdated: string;
    deadline: string;
    votingItems: VotingItemData[];
  }