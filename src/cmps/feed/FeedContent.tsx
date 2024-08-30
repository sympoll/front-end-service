import React, { useEffect, useState } from "react";
import Poll from "./poll/Poll";
import { fetchAllUserGroupsPolls, fetchPollsByGroupId } from "../../services/poll.service";
import { PollData } from "../../models/PollData.model";
import FeedLoadingAnimation from "../global/LoadingAnimation";
import FeedErrorMessage from "./message/FeedErrorMessage";
import { useParams, matchPath, useLocation } from "react-router-dom";
import { getSamplePolls } from "../../services/demo.data.service";
import ErrorPopup from "../popup/ErrorPopup";
import CreatePollForm from "./poll/CreatePollForm";
import FeedBar from "./bar/FeedBar";

export default function FeedContent() {
  const [polls, setPolls] = useState<PollData[]>([]);
  const [fetchedPolls, setFetchedPolls] = useState<PollData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { groupId } = useParams();

  const cmpName = "FEED ";

  useEffect(() => {
    setPolls([]); // Reset the polls state to an empty array
    setIsLoading(true); // Reset the initial state of isLoading.

    if (groupId) {
      // Search for the group specified in the path.
      fetchPollsByGroupId(groupId)
        .then((data) => {
          logDataReceived(data);
          setPolls(data);
          setFetchedPolls(data);
        })
        .catch((error) => {
          console.log(cmpName + error);
          setError(error.message);
        });
    } else {
      // Fetch all polls from all groups
      fetchAllUserGroupsPolls(0) // TODO: Change to user ID.
        .then((data) => {
          logDataReceived(data);
          setPolls(data);
          setFetchedPolls(data);
        })
        .catch((error) => {
          console.log(cmpName + error);
          setError(error.message);
        });
    }
    setIsLoading(false);
  }, [groupId]);

  const logDataReceived = (data: PollData[]) => {
    console.log(cmpName + "got data " + data);
  };

  const updatePolls = () => {};

  // Log polls state whenever it changes.
  useEffect(() => {
    // Only if the polls array is defined, end the loading phase.
    if (polls) {
      console.log("Polls object defined: ", polls);
      setIsLoading(false);
    }
  }, [polls]);

  if (isLoading) return <FeedLoadingAnimation message="Feed is loading" dots="off" />;

  if (!polls) {
    return <FeedErrorMessage error={error} />;
  }
  if (polls.length === 0) {
    return (
      <FeedErrorMessage
        error={
          groupId
            ? "No polls are currently available for this group.&nPlease check back later or contact the group administrator for more information."
            : "No polls are currently available for your groups.&nPlease check back later or contact a group administrator for more information."
        }
      />
    ); // TODO: add tutorial for admins only (members wont see the tutorial)
  }
  return (
    <div className="feed-container">
      <div className="feed-header">{groupId && <FeedBar groupId={groupId} />}</div>
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
            isSpecificGroup={groupId ? true : false} // Check if chosen a specific group, or currently on all groups tab
          />
        ))}
      </div>
    </div>
  );
}
