import React, { useEffect, useState } from "react";
import VotingItem from "./VotingItem";
import { CheckboxChoiceType } from "./Enums";
import {
  VotingItemData,
  VotingItemProgress,
} from "../../models/VotingitemData.model";

interface PollProps {
  title: string;
  content: string;
  mode: CheckboxChoiceType;
  votingItems: VotingItemData[];
}

export default function Poll({ title, content, mode, votingItems }: PollProps) {
  const [votingItemData, setVotingItemData] =
    useState<VotingItemData[]>(votingItems);
  const [progresses, setProgresses] = useState<VotingItemProgress[]>([]);

  function handleNewProgress(id: string, isInc: boolean) {
    const updatedVotingItem = votingItemData.find((item) => item.id === id);

    if (updatedVotingItem) {
      isInc
        ? (updatedVotingItem.voteCount += 1)
        : (updatedVotingItem.voteCount += -1);

      let newProgresses: VotingItemProgress[] = [];

      votingItemData.forEach((item) => {
        newProgresses.push({ id: item.id, progress: getProgress(item.id) });
      });

      setProgresses(newProgresses);
    }
  }

  function getProgress(id: string) {
    let totalCount = 0;

    votingItemData.forEach((item) => {
      totalCount += item.voteCount;
    });

    const item = votingItemData.find((item) => item.id === id);

    if (item) {
      console.log(item.voteCount, totalCount);

      return (item.voteCount / (totalCount ? totalCount : 1)) * 100;
    }
    return 0;
  }

  useEffect(() => {
    const initialProgresses = votingItemData.map((item) => ({
      id: item.id,
      progress: getProgress(item.id),
    }));
    setProgresses(initialProgresses);
  }, []);

  return (
    <section className="poll-item">
      <div id="poll-item-title">{title}</div>
      <div id="poll-item-content">{content}</div>
      <div id="poll-item-voting-container">
        {votingItems.map((item) => (
          <VotingItem
            id={item.id}
            desc={item.desc}
            mode={mode}
            progress={progresses.find((i) => i.id === item.id)?.progress || 0}
            handleNewProgress={handleNewProgress}
          />
        ))}
      </div>
    </section>
  );
}
