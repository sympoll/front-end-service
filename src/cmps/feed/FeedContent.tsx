import React, { useEffect, useState } from "react";
import Poll from "./poll/Poll";
import {
  fetchAllUserGroupsPolls,
  fetchPollsByGroupId,
} from "../../services/poll.service";
import { PollData } from "../../models/PollData.model";
import LoadingAnimation from "../global/LoadingAnimation";
import { useParams, matchPath, useLocation } from "react-router-dom";
import { getSamplePolls } from "../../services/demo.data.service";

export default function FeedContent() {
  const [polls, setPolls] = useState<PollData[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();

  const { groupId } = useParams();

  useEffect(() => {
    if (!groupId) {
      fetchAllUserGroupsPolls(0) // TODO: Change to user ID.
        .then((data) => {
          console.log("Fetched all user polls data: ", data);
          setPolls(data);
        })
        .catch((error) => {
          console.log("Error in fetching all user's polls: ", error);
          setError(error.message);
          setIsLoading(false);
        });
    } else {
      // Search for the group specified in the path.
      fetchPollsByGroupId(groupId)
        .then((data) => {
          console.log("Fetched all group polls data: ", data);
          setPolls(data);
        })
        .catch((error) => {
          console.log("Error in fetching group polls: ", error);
          setError(error.message);
          setIsLoading(false);
        });
    }
  }, [groupId]);

  // Log polls state whenever it changes.
  useEffect(() => {
    // Only if the polls array is defined, end the loading phase.
    if (polls) {
      console.log("Polls object defined: ", polls);

      // Delay setting isLoading to false to allow the transition to occur.
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [polls]);

  if (isLoading) {
    return <LoadingAnimation />;
  } else if (!polls) {
    return (
      <div className="feed-content-error-fetching-polls-container">
        <div className="feed-content-error-fetching-polls-message">
          Error Fetching Polls...
          <br />
          {error}
        </div>
      </div>
    );
  } else {
    return (
      <div className={`feed-content-container ${isLoading ? "down" : "up"}`}>
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
