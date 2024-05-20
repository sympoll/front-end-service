import React, { useEffect, useState } from "react";
import VotingItem from "./VotingItem";
import { CheckboxChoiceType } from "./CheckboxChoiceType";
import {
  VotingItemData,
  VotingItemIsChecked,
  VotingItemProgress,
} from "../../../models/VotingitemData.model";

interface PollProps {
  pollID: string;
  title: string;
  content: string;
  mode: CheckboxChoiceType;
  votingItems: VotingItemData[];
}

export default function Poll({ title, content, mode, votingItems }: PollProps) {
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
      progress: getProgress(vItemData),
    }))
  );

  /* On checkbox click,
  progress and voting count is updated */
  function handleNewProgress(
    // UNCHECK THE UNWANTED CHECKBOXES IN THE SINGLE MODE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    inputID: string,
    inputMode: CheckboxChoiceType,
    inputIsInc: boolean
  ) {
    let newProgresses: VotingItemProgress[] = [];
    let newIsCheckedStates: VotingItemIsChecked[] = [];

    votingItemsData.map((item) => {
      // Find the newly clicked checkbox
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
      } // Remove previous checked states
      else if (inputMode === CheckboxChoiceType.Single) {
        const i = isCheckedStates.find(
          (i) => i.votingItemID === item.votingItemID
        );
        if (inputIsInc && i && i.isChecked) {
          item.voteCount += -1;
        }

        newIsCheckedStates.push({
          votingItemID: item.votingItemID,
          isChecked: false,
        });
      }
      newProgresses.push({
        votingItemID: item.votingItemID,
        progress: getProgress(item),
      });
    });
    setProgresses(newProgresses);
    setIsCheckedStates(newIsCheckedStates);
  }

  /* Finds the voting item state,
  calculates and returns the progress from its vote count */
  function getProgress(votingItem: VotingItemData) {
    let totalCount = 0;

    votingItemsData.forEach((vItemData) => {
      totalCount += vItemData.voteCount;
    });

    return (votingItem.voteCount / (totalCount ? totalCount : 1)) * 100;
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
      <div id="poll-item-title">{title}</div>
      <div id="poll-item-content">{content}</div>
      <div id="poll-item-voting-container">
        {votingItems.map((vItem) => (
          <VotingItem
            key={vItem.votingItemID}
            votingItemID={vItem.votingItemID}
            desc={vItem.desc}
            mode={mode}
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
            handleNewProgress={handleNewProgress}
          />
        ))}
      </div>
    </section>
  );
}
