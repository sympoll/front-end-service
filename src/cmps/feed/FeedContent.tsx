import React, { useCallback, useEffect, useMemo, useState } from "react";
import Poll from "./poll/Poll";
import { deletePoll, fetchAllUserGroupsPolls, fetchPollsByGroupId } from "../../services/poll.service";
import { PollData } from "../../models/PollData.model";
import FeedLoadingAnimation from "../global/LoadingAnimation";
import ContentPageErrorMessage from "../content-page/messege/ContentPageErrorMessage";
import { useParams } from "react-router-dom";
import FeedBar from "./bar/FeedBar";
import ContentPageMessage from "../content-page/messege/ContentPageMessage";
import { useUpdateContext } from "../../context/UpdateContext";
import VerifyPopup from "../popup/VerifyPopup";

export default function FeedContent() {
  const [polls, setPolls] = useState<PollData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVerifyPopupOpen, setIsVerifyPopupOpen] = useState(false);
  const [deletePollTrigger, setDeletePollTrigger] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { groupId } = useParams();
  const { registerForUpdate } = useUpdateContext(); // Access context
  const [pollIdToDelete, setPollIdToDelete] = useState<string>("");
  const userId = import.meta.env.VITE_DEBUG_USER_ID; //Temporary

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
      let fetchedPolls: PollData[];
      if (groupId) {
        fetchedPolls = await fetchPollsByGroupId(groupId);
      } else {
        fetchedPolls = await fetchAllUserGroupsPolls();
      }

      setIsLoading(false);
      removeErrorFromFeed();
      setPolls(fetchedPolls); 
    } catch (err) {
      if (err instanceof Error) {
        console.error(cmpName + err.message);
        setError(err.message);
      } else {
        console.error(cmpName + "Unknown error");
        setError("An unknown error occurred");
      }
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

  const showVerifyDeletePopup = (pollId: string) => {
    setIsVerifyPopupOpen(true);
    setPollIdToDelete(pollId);
  }

  const closeVerifyDeletePopup = () => {
    setIsVerifyPopupOpen(false)
    setPollIdToDelete("");
  }

  const onDeletePoll = async () => {
    if(pollIdToDelete !== "")
    {
      console.log("deleting poll");
      await deletePoll(pollIdToDelete, userId, groupId)
      .then((data) => {
        deletePollFromPollsList(data.pollId);
      }).catch((error) => {
        console.log("Unable to delete poll: ", pollIdToDelete);
        setError(error);
      });

      closeVerifyDeletePopup();
    }
  }

  const deletePollFromPollsList = (pollId: string) => {
    setPolls(polls?.filter((poll) => poll.pollId !== pollId));
  }

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
            creatorProfilePictureUrl={poll.creatorProfilePictureUrl}
            groupId={poll.groupId}
            groupName={poll.groupName}
            groupProfilePictureUrl={poll.groupProfilePictureUrl}
            timeCreated={poll.timeCreated}
            timeUpdated={poll.timeUpdated}
            deadline={poll.deadline}
            votingItems={poll.votingItems}
            isSpecificGroup={!!groupId}
            showVerifyDeletePopup={showVerifyDeletePopup}
          />
        ))}
      </div>
      {isVerifyPopupOpen && (<VerifyPopup headlineMessage="delete the poll?" OnClickYes={onDeletePoll} onClose={closeVerifyDeletePopup}></VerifyPopup>)}
    </div>
  );
}
