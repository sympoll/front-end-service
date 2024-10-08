import React, { useState } from "react";
import CustomButton from "../../global/CustomButton";
import CreatePollForm from "../poll/CreatePollForm";
import { PollData } from "../../../models/PollData.model";
import { useNavigate } from "react-router-dom";

interface FeedBarProps {
  groupId: string;
  addNewPoll: (newPoll: PollData) => void;
  isCreatePollFormVisible: boolean;
  setIsCreatePollFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FeedBar({
  groupId,
  addNewPoll,
  isCreatePollFormVisible,
  setIsCreatePollFormVisible
}: FeedBarProps) {
  const [isFeedBarVisible, setIsFeedBarVisible] = useState(true);
  const navigate = useNavigate();

  const toggleFeedBar = () => {
    setIsFeedBarVisible(!isFeedBarVisible);
  };

  const toggleCreatePollForm = () => {
    toggleFeedBar();
    setIsCreatePollFormVisible(!isCreatePollFormVisible);
  };

  return (
    <div className="feed-bar-container">
      {groupId && isFeedBarVisible && (
        <div className="feed-bar">
          {/* Add buttons to feed bar here. */}
          <CustomButton onClick={toggleCreatePollForm} name="create-btn" theme="dark">
            Create Poll
          </CustomButton>
          <CustomButton
            onClick={() => navigate("/group/" + groupId)}
            name="group-info-btn"
            theme="dark"
          >
            Group Info
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
