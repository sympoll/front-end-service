import React, { useEffect, useState } from "react";
import Poll from "./poll/Poll";
import { CheckboxChoiceType } from "./poll/CheckboxChoiceType";
import { getDemoPollsData } from "../../services/poll.service";
import { VotingItemData } from "../../models/VotingitemData.model";

interface PollData {
  pollID: string;
  title: string;
  content: string;
  mode: CheckboxChoiceType;
  votingItems: VotingItemData[];
}

export default function FeedContent() {
  const [polls, setPolls] = useState<PollData[]>([]);

  useEffect(() => {
    // Timeout to simulate loading time of the feed, delete after connecting to DB
    setTimeout(() => {
      setPolls(getDemoPollsData());
    }, 1000);
  });

  if (!polls.length) {
    return (
      <div className="feed-content-loading-container">
        <div className="feed-content-loading-message">
          Feed is loading
          <span className="dots">
            <span className="dot1">.</span>
            <span className="dot2">.</span>
            <span className="dot3">.</span>
          </span>
        </div>
        <div className="feed-content-loading-icon">
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="feed-content-container">
      {polls.map((poll) => (
        <Poll
          key={poll.pollID}
          pollID={poll.pollID}
          title={poll.title}
          content={poll.content}
          mode={poll.mode}
          votingItems={poll.votingItems}
        />
      ))}
    </div>
  );
}
