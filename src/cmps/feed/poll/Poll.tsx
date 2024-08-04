import React, { useEffect, useState } from "react";
import VotingItem from "./VotingItem";
import {
  VotingItemData,
  VotingItemIsChecked,
  VotingItemProgress
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
  votingItems
}: PollProps) {
  const [votingItemsData, setVotingItemsData] = useState<VotingItemData[]>(votingItems);
  const [isCheckedStates, setIsCheckedStates] = useState<VotingItemIsChecked[]>([]); // States array of the checked state of each voting item (checked/unchecked)

  // Coexists with the VotingItemData, saving it alongside it to display it properly without actualy saving it in the DB.

  const [progresses, setProgresses] = useState<VotingItemProgress[]>(
    votingItemsData.map((vItemData) => ({
      votingItemId: vItemData.votingItemId,
      progress: getProgress(vItemData.votingItemId)
    }))
  ); // initialized using votingItemsData states array

  const countCheckedItems = () => {
    return isCheckedStates.filter((item) => item.isChecked).length;
  }; // Function to count the number of items with isChecked === true

  const isSingleChoice = () => {
    return nofAnswersAllowed === 1;
  }; // true if the poll is single choice, false otherwise.

  // Update progresses whenever votingItemsData changes
  useEffect(() => {
    setProgresses(
      votingItemsData.map((item) => ({
        votingItemId: item.votingItemId,
        progress: getProgress(item.votingItemId)
      }))
    );
  }, [votingItemsData]);

  // Don't change the states if the user has already chosen the maximum amount of voting choices,
  // and is trying to choose another (only on a multiple choices poll)
  const shouldPreventProgressUpdate = (inputIsInc: boolean) => {
    return !isSingleChoice() && inputIsInc && nofAnswersAllowed === countCheckedItems();
  };

  // On checkbox click, progress and voting count is updated
  function handleNewProgress(inputId: string, inputIsInc: boolean) {
    if (shouldPreventProgressUpdate(inputIsInc)) return;

    // Set new states:
    setIsCheckedStates(getUpdatedCheckedStates(inputId, inputIsInc));
    setVotingItemsData(getUpdatedVoteCounts(inputId, inputIsInc));
  }

  // Update vote counts of the voting items
  const getUpdatedVoteCounts = (inputId: string, inputIsInc: boolean) => {
    return votingItemsData.map((item) => {
      // This item is was clicked
      if (item.votingItemId === inputId)
        return {
          ...item,
          voteCount: inputIsInc ? item.voteCount + 1 : item.voteCount - 1
        };

      // This item was not clicked
      if (isSingleChoice() && inputIsInc) {
        const checkedState = isCheckedStates.find(
          (checkedState) => checkedState.votingItemId === item.votingItemId
        );

        if (checkedState && checkedState.isChecked) {
          return { ...item, voteCount: item.voteCount - 1 };
        }
      }

      return item; // On multiple choice, there is no need to change the vote count of non-clicked items
    });
  };

  // Update the checked states of the voting items
  const getUpdatedCheckedStates = (inputId: string, inputIsInc: boolean) => {
    return votingItemsData.map((item) => {
      // This item is was clicked
      if (item.votingItemId === inputId)
        return {
          votingItemId: item.votingItemId,
          isChecked: inputIsInc
        };

      // This item was not clicked
      if (isSingleChoice() && inputIsInc) {
        // Uncheck all previously checked checkboxes
        return {
          votingItemId: item.votingItemId,
          isChecked: false
        };
      }

      // Don't change the item
      const checkedState = isCheckedStates.find(
        (checkedState) => checkedState.votingItemId === item.votingItemId
      );
      return {
        votingItemId: item.votingItemId,
        isChecked: getIsChecked(item.votingItemId)
      };
    });
  };

  //Finds the voting item state, calculates and returns the progress from its vote count
  function getProgress(votingItemId: string) {
    let totalCount = 0;
    let changedItem: VotingItemData | undefined;

    votingItemsData.forEach((vItemData) => {
      if (vItemData.votingItemId === votingItemId) changedItem = vItemData; // Find newly changed voting item
      totalCount += vItemData.voteCount;
    });

    if (changedItem) return (changedItem.voteCount / (totalCount ? totalCount : 1)) * 100;
    return 0;
  }

  // true if the voting item is checked, false if not
  function getIsChecked(votingItemId: string) {
    return (
      isCheckedStates.find((isCheckedState) => isCheckedState.votingItemId === votingItemId)
        ?.isChecked || false
    );
  }

  return (
    <section className="poll-item">
      <div className="poll-item-title">{title}</div>
      <div className="poll-item-description">{description}</div>
      <div className="poll-item-voting-container">
        <div className="poll-item-choice-messege">
          {isSingleChoice()
            ? "Select one"
            : "Select up to " + nofAnswersAllowed + " voting options"}
        </div>
        {votingItems.map((vItem) => (
          <VotingItem
            key={vItem.votingItemId}
            votingItemID={vItem.votingItemId}
            votingItemOrdinal={vItem.votingItemOrdinal}
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
          />
        ))}
      </div>
    </section>
  );
}
