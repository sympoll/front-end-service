import React, { useEffect, useState } from "react";
import VotingItem from "./VotingItem";
import { CheckboxChoiceType } from "./CheckboxChoiceType";
import {
  VotingItemData,
  VotingItemIsChecked,
  VotingItemProgress,
} from "../../../models/VotingitemData.model";

interface PollProps {
  pollId: string;
  title: string;
  description: string;
  nofAnswersAllowed: number;
  creatorId: string;
  groupId: string;
  timeCreated: string;
  timeUpdated: string;
  deadline: string;
  votingItems: VotingItemData[];
}

export default function Poll({
  pollId,
  title,
  description,
  nofAnswersAllowed,
  creatorId,
  groupId,
  timeCreated,
  timeUpdated,
  deadline,
  votingItems,
}: PollProps) {
  const mode =
    nofAnswersAllowed > 1
      ? CheckboxChoiceType.Multiple
      : CheckboxChoiceType.Single; // TODO: Remove this, update to limit the nof answers allowed.

  const [votingItemsData, setVotingItemsData] =
    useState<VotingItemData[]>(votingItems);

  /* States array of the checked state of each voting item (checked/unchecked) */
  const [isCheckedStates, setIsCheckedStates] = useState<VotingItemIsChecked[]>(
    []
  );

  /* Coexists with the VotingItemData, saving it alongside it to display it properly without actualy saving it in the DB.
  initialized using votingItemsData states array */
  const [progresses, setProgresses] = useState<VotingItemProgress[]>(
    votingItemsData.map((vItemData) => ({
      votingItemID: vItemData.votingItemID,
      progress: getProgress(vItemData.votingItemID),
    }))
  );

  /* On checkbox click,
  progress and voting count is updated */
  function handleNewProgress(inputID: string, inputIsInc: boolean) {
    let newIsCheckedStates: VotingItemIsChecked[] = [];

    votingItemsData.map((item) => {
      // Find the newly clicked checkbox.
      if (item.votingItemID === inputID) {
        if (inputIsInc) {
          item.voteCount += 1;
          newIsCheckedStates.push({
            votingItemID: item.votingItemID,
            isChecked: true,
          });
        } else {
          item.voteCount += -1;
          newIsCheckedStates.push({
            votingItemID: item.votingItemID,
            isChecked: false,
          });
        }
      } else {
        // Uncheck previous checked checkboxes.
        const checkedState = isCheckedStates.find(
          (checkedState) => checkedState.votingItemID === item.votingItemID
        );

        if (mode === CheckboxChoiceType.Single) {
          // Push unchecked states for all other checkboxes (that were not changed on this call).
          if (inputIsInc && checkedState && checkedState.isChecked) {
            item.voteCount += -1;
          }

          newIsCheckedStates.push({
            votingItemID: item.votingItemID,
            isChecked: false,
          });
        } else {
          // Push unchanged checked state.
          newIsCheckedStates.push({
            votingItemID: item.votingItemID,
            isChecked: checkedState?.isChecked || false,
          });
        }
      }
    });
    // Update progress states based on the vote counts.
    setProgresses(
      votingItemsData.map((item) => ({
        votingItemID: item.votingItemID,
        progress: getProgress(item.votingItemID),
      }))
    );
    // Update the checked states.
    setIsCheckedStates(newIsCheckedStates);
  }

  /* Finds the voting item state,
  calculates and returns the progress from its vote count. */
  function getProgress(votingItemID: string) {
    let totalCount = 0;
    let changedItem: VotingItemData | undefined;

    votingItemsData.forEach((vItemData) => {
      if (vItemData.votingItemID === votingItemID) changedItem = vItemData; // Find newly changed voting item.
      totalCount += vItemData.voteCount;
    });

    if (changedItem)
      return (changedItem.voteCount / (totalCount ? totalCount : 1)) * 100;
    return 0;
  }

  function getIsChecked(votingItemID: string) {
    return (
      isCheckedStates.find(
        (isCheckedState) => isCheckedState.votingItemID === votingItemID
      )?.isChecked || false
    );
  }

  return (
    <section className="poll-item">
      <div className="poll-item-title">{title}</div>
      <div className="poll-item-description">{description}</div>
      <div className="poll-item-voting-container">
        <div className="poll-item-choice-messege">
          {mode === CheckboxChoiceType.Single
            ? "Select one"
            : "Select one or more"}
        </div>
        {votingItems.map((vItem) => (
          <VotingItem
            key={vItem.votingItemID}
            votingItemID={vItem.votingItemID}
            votingItemOrdinal={vItem.votingItemOrdinal}
            description={vItem.description}
            voteCount={
              votingItemsData.find(
                (vItemData) => vItemData.votingItemID === vItem.votingItemID
              )?.voteCount || 0
            }
            progress={
              progresses.find(
                (pItem) => pItem.votingItemID === vItem.votingItemID
              )?.progress || 0
            }
            isChecked={
              isCheckedStates.find(
                (cItem) => cItem.votingItemID === vItem.votingItemID
              )?.isChecked || false
            }
            handleNewProgress={handleNewProgress}
          />
        ))}
      </div>
    </section>
  );
}
