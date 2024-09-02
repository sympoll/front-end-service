import React, { useCallback, useEffect, useMemo, useState } from "react";
import Poll from "./poll/Poll";
import { fetchAllUserGroupsPolls, fetchPollsByGroupId } from "../../services/poll.service";
import { PollData } from "../../models/PollData.model";
import FeedLoadingAnimation from "../global/LoadingAnimation";
import ContentPageErrorMessage from "../content-page/messege/ContentPageErrorMessage";
import { useParams } from "react-router-dom";
import FeedBar from "./bar/FeedBar";
import ContentPageMessage from "../content-page/messege/ContentPageMessage";
import { useUpdateContext } from "../../context/UpdateContext";

export default function FeedContent() {
  const [polls, setPolls] = useState<PollData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { groupId } = useParams();
  const { registerForUpdate } = useUpdateContext(); // Access context

  const cmpName = "FEED ";

  // Initial fetch on component render
  useEffect(() => {
    setIsLoading(true);
    setPolls([]); // clear poll data in feed when changing groups
    updatePolls();
  }, [groupId]);

  // Function to update polls with the latest data
  const updatePolls = useCallback(async () => {
    try {
      let fetchedPolls = [];
      if (groupId) {
        fetchedPolls = await fetchPollsByGroupId(groupId);
      } else {
        fetchedPolls = await fetchAllUserGroupsPolls();
      }

      setIsLoading(false);
      removeErrorFromFeed();
      setPolls(fetchedPolls);
    } catch (err) {
      console.error(cmpName + err);
      const error = err as Error;
      setError(error.message);
      setIsLoading(false);
    } 
  }, [groupId]);

  useEffect(() => {
    // Register the updatePolls function and handle unregistration
    const unregister = registerForUpdate(updatePolls);
    return () => {
      unregister();
    };
  }, [registerForUpdate, updatePolls]);

  // If fetch successful remove error message from feed if exists
  const removeErrorFromFeed = () => {
    if (error) {
      setError(null);
    }
  };

  const addNewPoll = (newPoll: PollData) => {
    console.log("Adding newly created poll to feed. ", newPoll);
    setPolls((prevPolls) => [newPoll, ...prevPolls]); // Prepend the new poll to the beginning of the array
  };

  if (isLoading) {
    return <FeedLoadingAnimation message="Feed is loading" dots="off" />;
  }

  if (error) {
    return <ContentPageErrorMessage error={error} />;
  }

  if (polls.length === 0) {
    return (
      <div className="feed-container">
        {groupId && <FeedBar addNewPoll={addNewPoll} groupId={groupId} />}
        <ContentPageMessage
          msgText={
            groupId
              ? "No polls are currently available for this group. Please check back later or contact the group administrator for more information."
              : "No polls are currently available for your groups. Please check back later or contact a group administrator for more information."
          }
        />
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-header">
        {groupId && <FeedBar addNewPoll={addNewPoll} groupId={groupId} />}
      </div>
      <div className="feed-content-container">
        {polls.map((poll) => (
          <Poll
            key={poll.pollId}
            pollId={poll.pollId}
            title={poll.title}
            description={poll.description}
            nofAnswersAllowed={poll.nofAnswersAllowed}
            creatorId={poll.creatorId}
            creatorName={poll.creatorName}
            groupId={poll.groupId}
            timeCreated={poll.timeCreated}
            timeUpdated={poll.timeUpdated}
            deadline={poll.deadline}
            votingItems={poll.votingItems}
            isSpecificGroup={!!groupId}
          />
        ))}
      </div>
    </div>
  );
}
