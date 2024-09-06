import React, { useEffect, useState } from "react";
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
import defaultProfilePictureUrl from "/imgs/profile/blank-profile-picture.jpg";
import defaultGroupProfilePictureUrl from "/imgs/profile/blank-group-profile-picture.jpg";
import DeletePollButton from "../../global/DeletePollButton";

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
  isSpecificGroup
}: PollProps) {
  const [votingItemsData, setVotingItemsData] = useState<VotingItemData[]>(votingItems);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [timePassed, setTimePassed] = useState(getTimePassed(timeCreated));
  const [isCheckedStates, setIsCheckedStates] = useState<VotingItemIsChecked[]>(
    votingItems.map((vItem) => ({
      votingItemId: vItem.votingItemId,
      isChecked: vItem.checked // Set isChecked based on the 'chosen' property
    }))
  );
  const navigate = useNavigate();
  const navigateToCreatorProfile = () => navigate(`/${creatorId}`);
  const navigateToGroupProfile = () => navigate(`/group/${groupId}`);

  const closeErrorPopup = () => {
    setIsErrorPopupVisible(false);
  };
  const showErrorPopup = () => {
    setIsErrorPopupVisible(true);
  };

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
        sendRequestToVoteService(false, previouslySelectedItem.votingItemId);
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
    sendRequestToVoteService(inputIsInc, inputId);

    return true;
  }

  const onDeletePoll = () => {

  }

  return (
    <section className="poll-container">
      {
        // Display Group info only on all groups tab
        isSpecificGroup ? (
          <div className="poll-info-title">
            <div className="poll-info-title__row1">
              <ProfilePicture
                imageUrl={
                  creatorProfilePictureUrl ? creatorProfilePictureUrl : defaultProfilePictureUrl
                }
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
                <DeletePollButton onClick={onDeletePoll} />
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
                imageUrl={
                  groupProfilePictureUrl ? groupProfilePictureUrl : defaultGroupProfilePictureUrl
                }
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
  );
}
