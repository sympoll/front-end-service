import React, { useCallback, useEffect, useMemo, useState } from "react";
import Poll from "./poll/Poll";
import { fetchAllUserGroupsPolls, fetchPollsByGroupId } from "../../services/poll.service";
import { PollData } from "../../models/PollData.model";
import FeedLoadingAnimation from "../global/LoadingAnimation";
import ContentPageErrorMessage from "../content-page/messege/ContentPageErrorMessage";
import { useParams } from "react-router-dom";
import ErrorPopup from "../popup/ErrorPopup";
import CreatePollForm from "./poll/CreatePollForm";
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

  // Effect to fetch polls data on component mount or groupId change
  useEffect(() => {
    const fetchPolls = async () => {
      setIsLoading(true); // Start loading state

      try {
        if (groupId) {
          const data = await fetchPollsByGroupId(groupId);
          logDataReceived(data);
          setPolls(data);
        } else {
          const data = await fetchAllUserGroupsPolls(0); // TODO: Change to user ID
          logDataReceived(data);
          setPolls(data);
        }
      } catch (error) {
        console.error(cmpName + error);
        setError(error.message);
      } finally {
        setIsLoading(false); // End loading state
      }
    };

    fetchPolls();
  }, [groupId]);

  // Function to update polls with the latest data
  const updatePolls = useCallback(async () => {
    try {
      let fetchedPolls = [];
      if (groupId) {
        fetchedPolls = await fetchPollsByGroupId(groupId);
      } else {
        fetchedPolls = await fetchAllUserGroupsPolls(0); // Assuming 0 is the user ID for now
      }

      // Use a Map to deduplicate polls by their unique IDs
      setPolls((prevPolls) => {
        const pollsMap = new Map(
          [...prevPolls, ...fetchedPolls].map((poll) => [poll.pollId, poll])
        );
        const updatedPolls = Array.from(pollsMap.values());

        // Ensure a new reference to trigger React re-render
        return [
          ...fetchedPolls,
          ...prevPolls.filter(
            (poll) => !fetchedPolls.some((fp: PollData) => fp.pollId === poll.pollId)
          )
        ];
      });
    } catch (error) {
      console.error(cmpName + error);
      setError(error.message);
      setIsLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    const unregister = registerForUpdate(updatePolls);
    return () => {
      unregister();
    };
  }, [registerForUpdate, updatePolls]);

  const logDataReceived = (data: PollData[]) => {
    console.log(cmpName + "got data");
  };

  // Memoize the polls array to prevent unnecessary re-renders
  const memoizedPolls = useMemo(() => polls, [polls]);

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
        {memoizedPolls.map((poll) => (
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
