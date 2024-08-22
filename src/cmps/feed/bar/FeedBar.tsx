import React, { useState } from "react";
import CustomButton from "../../global/CustomButton";
import CreatePollForm from "../poll/CreatePollForm";

interface FeedBarProps {
  groupId: string;
}

export default function FeedBar({ groupId }: FeedBarProps) {
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
    <div className="feed-header">
      {isFeedBarVisible && (
        <div className="feed-bar">
          {/* Add buttons to feed bar here. */}
          <CustomButton onClick={toggleCreatePollForm} name="create-btn">
            Create Poll
          </CustomButton>
        </div>
      )}

      {isCreatePollFormVisible && (
        <CreatePollForm groupId={groupId} onSubmit={toggleCreatePollForm} />
      )}
    </div>
  );
}
