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
  shouldPreventProgressUpdate
} from "../../../services/poll.service";
import ProfilePicture from "../../global/ProfilePicture";
import { useUser } from "../../../context/UserContext";
import PollOptionsButton from "./PollOptionsButton";
import { useMembers } from "../../../context/MemebersContext";
import { UserRoleName } from "../../../models/enum/UserRoleName.enum";

interface PollProps {
  pollId: string;
  title: string;
  description: string;
  nofAnswersAllowed: number;
  creatorId: string;
  creatorName: string;
  creatorProfilePictureUrl: string;
  groupId: string;
  groupName: string;
  groupProfilePictureUrl: string;
  timeCreated: string;
  timeUpdated: string;
  deadline: string;
  votingItems: VotingItemData[];
  isSpecificGroup: boolean;
  showVerifyDeletePopup: (pollId: string) => void;
}

export default function Poll({
  pollId,
  title,
  description,
  nofAnswersAllowed,
  creatorId,
  creatorName,
  creatorProfilePictureUrl,
  groupId,
  groupName,
  groupProfilePictureUrl,
  timeCreated,
  timeUpdated,
  deadline,
  votingItems,
  isSpecificGroup,
  showVerifyDeletePopup
}: PollProps) {
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [timePassed, setTimePassed] = useState(getTimePassed(timeCreated));
  const [isUserCanDeletePoll, setIsUserCanDeletePoll] = useState(false);
  const [isCheckedStates, setIsCheckedStates] = useState<VotingItemIsChecked[]>(
    votingItems.map((vItem) => ({
      votingItemId: vItem.votingItemId,
      isChecked: vItem.checked // Set isChecked based on the 'chosen' property
    }))
  );
  const [isEditingPoll, setIsEditingPoll] = useState(false);

  const [votingItemsData, setVotingItemsData] = useState<VotingItemData[]>(votingItems);
  const { user } = useUser();
  const { members, getMemberRole } = useMembers();

  const navigate = useNavigate();
  const navigateToCreatorProfile = () => navigate(`/${creatorId}`);
  const navigateToGroupProfile = () => navigate(`/group/${groupId}`);

  const [pollTitleValue, setPollTitleValue] = useState(title);
  const [pollDescriptionValue, setPollDescriptionValue] = useState(description);

  useEffect(() => {
    console.log("fetching permission for delete");
    fetchPermissionToDeletePoll();
  }, [members]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimePassed(getTimePassed(timeCreated));
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [timeCreated]);

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
        isSingleChoice(nofAnswersAllowed),
        nofAnswersAllowed,
        countCheckedItems(isCheckedStates)
      )
    )
      return false;

    if (isSingleChoice(nofAnswersAllowed) && inputIsInc) {
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
        isSingleChoice(nofAnswersAllowed)
      )
    );
    setVotingItemsData(
      getUpdatedVoteCounts(
        inputId,
        inputIsInc,
        votingItemsData,
        isCheckedStates,
        isSingleChoice(nofAnswersAllowed)
      )
    );

    // Trigger vote service call for the new selection
    sendRequestToVoteService(inputIsInc, inputId, user?.userId);

    return true;
  }

  const fetchPermissionToDeletePoll = () => {
    if (isSpecificGroup) {
      if (creatorId === user?.userId || getMemberRole(user?.userId) === UserRoleName.ADMIN) {
        setIsUserCanDeletePoll(true);
      } else {
        setIsUserCanDeletePoll(false);
      }
    }
  };

  const resetPollTitleValue = () => {
    setPollTitleValue(title);
  };
  const resetPollDescriptionValue = () => {
    setPollDescriptionValue(description);
  };

  const closeErrorPopup = () => {
    setIsErrorPopupVisible(false);
  };
  const showErrorPopup = () => {
    setIsErrorPopupVisible(true);
  };

  const togglePollEdit = () => {
    setIsEditingPoll(!isEditingPoll);
  };

  const onDeletePollClick = () => {
    showVerifyDeletePopup(pollId);
  };

  const onEditPollClick = () => {
    togglePollEdit();

    resetPollTitleValue();
    resetPollDescriptionValue();
  };

  const onSavePollClick = () => {
    // Save logic here
    togglePollEdit();
  };

  return isEditingPoll ? (
    // Display input fields for the poll's details, currently editing
    <section className="poll-container">
      {
        // Display Group info only on all groups tab
        isSpecificGroup ? (
          <div className="poll-info-title">
            <div className="poll-info-title__row1">
              <ProfilePicture
                imageUrl={creatorProfilePictureUrl}
                altText={creatorName + "'s profile picture"}
                onClick={navigateToCreatorProfile}
              ></ProfilePicture>
              <div>
                <div
                  className="poll-info-title__specific-group__creator-name"
                  onClick={navigateToCreatorProfile}
                >
                  {creatorName}
                </div>
                <div className="poll-info-title__specific-group__time-passed">{timePassed}</div>
              </div>
              <div className="poll-info-title__delete-button">
                {isUserCanDeletePoll && (
                  <PollOptionsButton
                    savePollOnClick={onSavePollClick}
                    deletePollOnClick={onDeletePollClick}
                  />
                )}
              </div>
            </div>
            <div className="poll-info-title__row2">
              <div className="poll-deadline">{"Deadline is in " + getTimeToDeadline(deadline)}</div>
            </div>
          </div>
        ) : (
          <div className="poll-info-title">
            <div className="poll-info-title__row1">
              <ProfilePicture
                imageUrl={groupProfilePictureUrl}
                altText={creatorName + "'s profile picture"}
                onClick={navigateToGroupProfile}
              ></ProfilePicture>
              <div className="poll-info-title__all-groups__titles-container">
                <div
                  className="poll-info-title__all-groups__group-name"
                  onClick={navigateToGroupProfile}
                >
                  {groupName}
                </div>
                <div className="poll-info-title__all-groups__creator-name-container">
                  <div
                    className="poll-info-title__all-groups__creator-name"
                    onClick={navigateToCreatorProfile}
                  >
                    {creatorName}
                  </div>
                  <div className="poll-info-title-separator">•</div>
                  <div className="poll-info-title__all-groups__time-passed">{timePassed}</div>
                </div>
              </div>
            </div>

            <div className="poll-info-title__row2">
              <div className="poll-deadline">{"Deadline is in " + getTimeToDeadline(deadline)}</div>
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
          <div className="poll-title">{title}</div>
          <div className="poll-description">{description}</div>
        </div>
      )}
      <div className="poll-voting-container">
        <div className="poll-voting-choice-messege">
          {isSingleChoice(nofAnswersAllowed)
            ? "Select one"
            : "Select up to " + nofAnswersAllowed + " voting options"}
        </div>
        {
          // Add voting items to the poll
          votingItems.map((vItem) => (
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
            message="Already reached the limit of votes!"
            closeErrorPopup={closeErrorPopup}
          />
        )}
      </p>
    </section>
  ) : (
    // Display the polls details, currently not editing
    <section className="poll-container">
      {
        // Display Group info only on all groups tab
        isSpecificGroup ? (
          <div className="poll-info-title">
            <div className="poll-info-title__row1">
              <ProfilePicture
                imageUrl={creatorProfilePictureUrl}
                altText={creatorName + "'s profile picture"}
                onClick={navigateToCreatorProfile}
              ></ProfilePicture>
              <div>
                <div
                  className="poll-info-title__specific-group__creator-name"
                  onClick={navigateToCreatorProfile}
                >
                  {creatorName}
                </div>
                <div className="poll-info-title__specific-group__time-passed">{timePassed}</div>
              </div>
              <div className="poll-info-title__delete-button">
                {isUserCanDeletePoll && (
                  <PollOptionsButton
                    editPollOnClick={onEditPollClick}
                    deletePollOnClick={onDeletePollClick}
                  />
                )}
              </div>
            </div>
            <div className="poll-info-title__row2">
              <div className="poll-deadline">{"Deadline is in " + getTimeToDeadline(deadline)}</div>
            </div>
          </div>
        ) : (
          <div className="poll-info-title">
            <div className="poll-info-title__row1">
              <ProfilePicture
                imageUrl={groupProfilePictureUrl}
                altText={creatorName + "'s profile picture"}
                onClick={navigateToGroupProfile}
              ></ProfilePicture>
              <div className="poll-info-title__all-groups__titles-container">
                <div
                  className="poll-info-title__all-groups__group-name"
                  onClick={navigateToGroupProfile}
                >
                  {groupName}
                </div>
                <div className="poll-info-title__all-groups__creator-name-container">
                  <div
                    className="poll-info-title__all-groups__creator-name"
                    onClick={navigateToCreatorProfile}
                  >
                    {creatorName}
                  </div>
                  <div className="poll-info-title-separator">•</div>
                  <div className="poll-info-title__all-groups__time-passed">{timePassed}</div>
                </div>
              </div>
            </div>

            <div className="poll-info-title__row2">
              <div className="poll-deadline">{"Deadline is in " + getTimeToDeadline(deadline)}</div>
            </div>
          </div>
        )
      }
      <div className="poll-details-container">
        <div className="poll-title">{title}</div>
        <div className="poll-description">{description}</div>
        <div className="poll-voting-container">
          <div className="poll-voting-choice-messege">
            {isSingleChoice(nofAnswersAllowed)
              ? "Select one"
              : "Select up to " + nofAnswersAllowed + " voting options"}
          </div>
          {
            // Add voting items to the poll
            votingItems.map((vItem) => (
              <VotingItem
                key={vItem.votingItemId}
                votingItemID={vItem.votingItemId}
                description={vItem.description}
                voteCount={
                  votingItemsData.find((vItemData) => vItemData.votingItemId === vItem.votingItemId)
                    ?.voteCount || 0
                }
                progress={
                  progresses.find((pItem) => pItem.votingItemId === vItem.votingItemId)?.progress ||
                  0
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
              message="Already reached the limit of votes!"
              closeErrorPopup={closeErrorPopup}
            />
          )}
        </p>
      </div>
    </section>
  );
}
