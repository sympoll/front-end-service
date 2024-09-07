export interface CreatePollData {
  title: string;
  description: string;
  nofAnswersAllowed: number | undefined;
  creatorId: string | undefined;
  groupId: string;
  deadline: string;
  votingItems: string[];
}
