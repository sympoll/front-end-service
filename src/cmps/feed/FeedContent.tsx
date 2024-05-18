import React, { useEffect, useState } from "react";
import Poll from "./poll/Poll";
import { CheckboxChoiceType } from "./poll/CheckboxChoiceType";
import { getDemoPollsData } from "../../services/poll.service";
import { VotingItemData } from "../../models/VotingitemData.model";

interface PollData {
  id: string;
  title: string;
  content: string;
  mode: CheckboxChoiceType;
  votingItems: VotingItemData[];
}

export default function FeedContent() {
  const [polls, setPolls] = useState<PollData[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setPolls(getDemoPollsData());
    }, 1000);
  });

  if (!polls.length) return <div>No polls yet</div>;
  return (
    <div className="feed-content-container">
      {polls.map((poll) => (
        <Poll
          key={poll.id}
          title={poll.title}
          content={poll.content}
          mode={poll.mode}
          votingItems={poll.votingItems}
        />
      ))}
    </div>
  );
}
