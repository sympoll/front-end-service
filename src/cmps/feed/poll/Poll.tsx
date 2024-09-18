import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import VotingItem from "./VotingItem";
import {
  VotingItemData,
  VotingItemIsChecked,
  VotingItemProgress
} from "../../../models/VotingitemData.model";
import ErrorPopup from "../../popup/ErrorPopup";
import {
  countCheckedItems,
  getProgress,
  getTimePassed,
  getTimeToDeadline,
  getUpdatedCheckedStates,
  getUpdatedVoteCounts,
  isSingleChoice,
  sendRequestToVoteService,
  shouldPreventProgressUpdate,
  updatePoll
} from "../../../services/poll.service";
import ProfilePicture from "../../global/ProfilePicture";
import { useUser } from "../../../context/UserContext";
import PollOptionsButton from "./PollOptionsButton";
import { useMembers } from "../../../context/MemebersContext";
import { UserRoleName } from "../../../models/enum/UserRoleName.enum";
import { PollData } from "../../../models/PollData.model";
import defaultProfilePictureUrl from "/imgs/profile/blank-profile-picture.jpg";

interface PollProps {
  initialPollData: PollData;
  isSpecificGroup: boolean;
  showVerifyDeletePopup: (pollId: string) => void;
}

export default function Poll({
  initialPollData,
  isSpecificGroup,
  showVerifyDeletePopup
}: PollProps) {
  const [pollData, setPollData] = useState(initialPollData);

  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState<string>();

  const [timePassed, setTimePassed] = useState(getTimePassed(pollData.timeCreated));
  const [isCheckedStates, setIsCheckedStates] = useState<VotingItemIsChecked[]>(
    pollData.votingItems.map((vItem) => ({
      votingItemId: vItem.votingItemId,
      isChecked: vItem.checked // Set isChecked based on the 'chosen' property
    }))
  );

  const [isUserCanDeletePoll, setIsUserCanDeletePoll] = useState(false);
  const [isEditingPoll, setIsEditingPoll] = useState(false);

  const [votingItemsData, setVotingItemsData] = useState<VotingItemData[]>(pollData.votingItems);
  const { user } = useUser();
  const { members, getMemberRole } = useMembers();

  const navigate = useNavigate();
  const navigateToCreatorProfile = () => navigate(`/${pollData.creatorId}`);
  const navigateToGroupProfile = () => navigate(`/group/${pollData.groupId}`);

  const [pollTitleValue, setPollTitleValue] = useState(pollData.title);
  const [pollDescriptionValue, setPollDescriptionValue] = useState(pollData.description);

  const POLL_TITLE_MIN_LENGTH = 4;

  useEffect(() => {
    console.log("fetching permission for delete");
    fetchPermissionToDeletePoll();
  }, [members]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimePassed(getTimePassed(pollData.timeCreated));
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [pollData.timeCreated]);

  const [progresses, setProgresses] = useState<VotingItemProgress[]>(
    votingItemsData.map((vItemData) => ({
      votingItemId: vItemData.votingItemId,
      progress: getProgress(vItemData.votingItemId, votingItemsData)
    }))
  ); // initialized using votingItemsData states array

  // Update progresses whenever votingItemsData changes
  useEffect(() => {
    setProgresses(
      votingItemsData.map((item) => ({
        votingItemId: item.votingItemId,
        progress: getProgress(item.votingItemId, votingItemsData)
      }))
    );
  }, [votingItemsData]);

  // On checkbox click, progress and voting count is updated
  // Returns true if changed progress, false otherwise
  function handleNewProgress(inputId: number, inputIsInc: boolean) {
    if (
      shouldPreventProgressUpdate(
        inputIsInc,
        isSingleChoice(pollData.nofAnswersAllowed),
        pollData.nofAnswersAllowed,
        countCheckedItems(isCheckedStates)
      )
    )
      return false;

    if (isSingleChoice(pollData.nofAnswersAllowed) && inputIsInc) {
      const previouslySelectedItem = isCheckedStates.find((item) => item.isChecked);
      if (previouslySelectedItem) {
        sendRequestToVoteService(false, previouslySelectedItem.votingItemId, user?.userId);
      }
    }

    // Set new states:
    setIsCheckedStates(
      getUpdatedCheckedStates(
        inputId,
        inputIsInc,
        votingItemsData,
        isCheckedStates,
        isSingleChoice(pollData.nofAnswersAllowed)
      )
    );
    setVotingItemsData(
      getUpdatedVoteCounts(
        inputId,
        inputIsInc,
        votingItemsData,
        isCheckedStates,
        isSingleChoice(pollData.nofAnswersAllowed)
      )
    );

    // Trigger vote service call for the new selection
    sendRequestToVoteService(inputIsInc, inputId, user?.userId);

    return true;
  }

  const fetchPermissionToDeletePoll = () => {
    if (isSpecificGroup) {
      if (
        pollData.creatorId === user?.userId ||
        getMemberRole(user?.userId) === UserRoleName.ADMIN
      ) {
        setIsUserCanDeletePoll(true);
      } else {
        setIsUserCanDeletePoll(false);
      }
    }
  };

  const resetPollTitleValue = () => {
    setPollTitleValue(pollData.title);
  };
  const resetPollDescriptionValue = () => {
    setPollDescriptionValue(pollData.description);
  };
  const resetPollDetails = () => {
    resetPollTitleValue();
    resetPollDescriptionValue();
  };

  const closeErrorPopup = () => {
    setIsErrorPopupVisible(false);
  };
  const showErrorPopup = (message: string) => {
    setErrorPopupMessage(message);
    setIsErrorPopupVisible(true);
  };

  const togglePollEdit = () => {
    setIsEditingPoll(!isEditingPoll);
  };

  const onDeletePollClick = () => {
    showVerifyDeletePopup(pollData.pollId);
  };

  const onEditPollClick = () => {
    togglePollEdit();

    resetPollTitleValue();
    resetPollDescriptionValue();
  };

  const onSavePollClick = () => {
    if (pollTitleValue.length < POLL_TITLE_MIN_LENGTH) {
      showErrorPopup("Poll title should have at least " + POLL_TITLE_MIN_LENGTH + " characters!");
      return;
    }

    updatePoll(
      pollData.pollId,
      pollData.creatorId,
      pollData.groupId,
      pollTitleValue,
      pollDescriptionValue
    )
      .then((data) => {
        console.log("Updated poll details for poll with ID: ", pollData.pollId, data);
        // Update the localy stored poll data
        setPollData(
          (prevPollData) =>
            prevPollData && {
              ...prevPollData,
              title: pollTitleValue,
              description: pollDescriptionValue
            }
        );
      })
      .catch((error) => {
        console.log(
          "Unable to save poll details for poll with ID " + pollData.pollId + ". Error: " + error
        );
        resetPollDetails();
      });
    togglePollEdit();
  };

  const onExitEditClick = () => {
    resetPollDetails();
    togglePollEdit();
  };

  return (
    // Display input fields for the poll's details, currently editing
    <section className="poll-container">
      {
        // Display Group info only on all groups tab
        isSpecificGroup ? (
          <div className="poll-info-title">
            <div className="poll-info-title__row1">
              <ProfilePicture
                imageUrl={pollData.creatorProfilePictureUrl ?? defaultProfilePictureUrl}
                altText={pollData.creatorName + "'s profile picture"}
                onClick={navigateToCreatorProfile}
              ></ProfilePicture>
              <div>
                <div
                  className="poll-info-title__specific-group__creator-name"
                  onClick={navigateToCreatorProfile}
                >
                  {pollData.creatorName}
                </div>
                <div className="poll-info-title__specific-group__time-passed">{timePassed}</div>
              </div>
              <div className="poll-info-title__delete-button">
                {isUserCanDeletePoll && isEditingPoll && (
                  <PollOptionsButton
                    savePollOnClick={onSavePollClick}
                    exitEditOnClick={onExitEditClick}
                    deletePollOnClick={onDeletePollClick}
                  />
                )}
                {isUserCanDeletePoll && !isEditingPoll && (
                  <PollOptionsButton
                    editPollOnClick={onEditPollClick}
                    deletePollOnClick={onDeletePollClick}
                  />
                )}
              </div>
            </div>
            <div className="poll-info-title__row2">
              <div className="poll-deadline">
                {"Deadline is in " + getTimeToDeadline(pollData.deadline)}
              </div>
            </div>
          </div>
        ) : (
          <div className="poll-info-title">
            <div className="poll-info-title__row1">
              <ProfilePicture
                imageUrl={pollData.groupProfilePictureUrl ?? defaultProfilePictureUrl}
                altText={pollData.creatorName + "'s profile picture"}
                onClick={navigateToGroupProfile}
              ></ProfilePicture>
              <div className="poll-info-title__all-groups__titles-container">
                <div
                  className="poll-info-title__all-groups__group-name"
                  onClick={navigateToGroupProfile}
                >
                  {pollData.groupName}
                </div>
                <div className="poll-info-title__all-groups__creator-name-container">
                  <div
                    className="poll-info-title__all-groups__creator-name"
                    onClick={navigateToCreatorProfile}
                  >
                    {pollData.creatorName}
                  </div>
                  <div className="poll-info-title-separator">•</div>
                  <div className="poll-info-title__all-groups__time-passed">{timePassed}</div>
                </div>
              </div>
            </div>
            <div className="poll-info-title__row2">
              <div className="poll-deadline">
                {"Deadline is in " + getTimeToDeadline(pollData.deadline)}
              </div>
            </div>
          </div>
        )
      }
      {isEditingPoll ? (
        <div className="poll-details-container">
          <input
            type="text"
            value={pollTitleValue}
            onChange={(e) => setPollTitleValue(e.target.value)}
            className="poll-title-input"
          />
          <textarea
            value={pollDescriptionValue}
            onChange={(e) => setPollDescriptionValue(e.target.value)}
            className="poll-description-input"
          />
        </div>
      ) : (
        <div className="poll-details-container">
          <div className="poll-title">{pollTitleValue}</div>
          <div className="poll-description">{pollDescriptionValue}</div>
        </div>
      )}
      <div className="poll-voting-container">
        <div className="poll-voting-choice-messege">
          {isSingleChoice(pollData.nofAnswersAllowed)
            ? "Select one"
            : "Select up to " + pollData.nofAnswersAllowed + " voting options"}
        </div>
        {
          // Add voting items to the poll
          pollData.votingItems.map((vItem) => (
            <VotingItem
              key={vItem.votingItemId}
              votingItemID={vItem.votingItemId}
              description={vItem.description}
              voteCount={
                votingItemsData.find((vItemData) => vItemData.votingItemId === vItem.votingItemId)
                  ?.voteCount || 0
              }
              progress={
                progresses.find((pItem) => pItem.votingItemId === vItem.votingItemId)?.progress || 0
              }
              isChecked={
                isCheckedStates.find((cItem) => cItem.votingItemId === vItem.votingItemId)
                  ?.isChecked || false
              }
              handleNewProgress={handleNewProgress}
              showErrorPopup={showErrorPopup}
            />
          ))
        }
      </div>
      <p className="poll-error-message">
        {isErrorPopupVisible && (
          <ErrorPopup
            message={errorPopupMessage ?? "Encountered an unhandeled error!"}
            closeErrorPopup={closeErrorPopup}
          />
        )}
      </p>
    </section>
  );
}
