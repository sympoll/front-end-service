import React, { useState } from "react";
import CustomButton from "../../global/CustomButton";
import CreatePollForm from "../poll/CreatePollForm";
import { PollData } from "../../../models/PollData.model";

interface FeedBarProps {
  groupId: string;
  addNewPoll: (newPoll: PollData) => void;
}

export default function FeedBar({ groupId, addNewPoll }: FeedBarProps) {
  const [isFeedBarVisible, setIsFeedBarVisible] = useState(true);
  const [isCreatePollFormVisible, setIsCreatePollFormVisible] = useState(false);

  const toggleFeedBar = () => {
    setIsFeedBarVisible(!isFeedBarVisible);
  };

  const toggleCreatePollForm = () => {
    toggleFeedBar();
    setIsCreatePollFormVisible(!isCreatePollFormVisible);
  };

  return (
    <div className="feed-bar-container">
      {isFeedBarVisible && (
        <div className="feed-bar">
          {/* Add buttons to feed bar here. */}
          <CustomButton onClick={toggleCreatePollForm} name="create-btn" theme="dark">
            Create Poll
          </CustomButton>
        </div>
      )}

      {isCreatePollFormVisible && (
        <CreatePollForm
          addNewPoll={addNewPoll}
          groupId={groupId}
          closePollFunction={toggleCreatePollForm}
        />
      )}
    </div>
  );
}
