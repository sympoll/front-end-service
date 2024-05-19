import React, { useEffect, useState } from "react";
import VotingItem from "./VotingItem";
import { CheckboxChoiceType } from "./CheckboxChoiceType";
import {
  VotingItemData,
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
  function handleNewProgress(votingItemID: string, isInc: boolean) {
    const updatedVotingItem = votingItemsData.find(
      (vItemData) => vItemData.votingItemID === votingItemID
    );

    if (updatedVotingItem) {
      isInc
        ? (updatedVotingItem.voteCount += 1)
        : (updatedVotingItem.voteCount += -1);

      let newProgresses: VotingItemProgress[] = [];

      votingItemsData.forEach((vItemData) => {
        newProgresses.push({
          votingItemID: vItemData.votingItemID,
          progress: getProgress(vItemData.votingItemID),
        });
      });

      setProgresses(newProgresses);
    }
  }

  /* Finds the voting item state,
  calculates and returns the progress from its vote count */
  function getProgress(votingItemID: string) {
    let totalCount = 0;

    votingItemsData.forEach((vItemData) => {
      totalCount += vItemData.voteCount;
    });

    const vItem = votingItemsData.find(
      (vItemData) => vItemData.votingItemID === votingItemID
    );

    if (vItem) {
      return (vItem.voteCount / (totalCount ? totalCount : 1)) * 100;
    }
    return 0;
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
