import React, { useEffect, useState } from "react";
import Poll from "./poll/Poll";
import { fetchAllUserGroupsPolls } from "../../services/poll.service";
import { PollData } from "../../models/PollData.model";

export default function FeedContent() {
  const [polls, setPolls] = useState<PollData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllUserGroupsPolls(0) // TODO: Change to user ID.
      .then((data) => {
        setPolls(data);
        setIsLoading(false);
        console.log("Finished setting up polls. Received: {}", data);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
        console.log("Error in fetching all user's polls: {}", error);
      });
  }, []);

  if (isLoading) {
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
  } else if (!polls.length) {
    return (
      <div className="feed-content-error-fetching-polls">
        <div className="feed-content-error-fetching-polls-message">
          ERROR: {error}
        </div>
      </div>
    );
  } else {
    return (
      <div className="feed-content-container">
        {polls.map((poll) => (
          <Poll
            key={poll.pollId}
            pollId={poll.pollId}
            title={poll.title}
            description={poll.description}
            nofAnswersAllowed={poll.nofAnswersAllowed}
            creatorId={poll.creatorId}
            groupId={poll.groupId}
            timeCreated={poll.timeCreated}
            timeUpdated={poll.timeUpdated}
            deadline={poll.deadline}
            votingItems={poll.votingItems}
          />
        ))}
      </div>
    );
  }
}
