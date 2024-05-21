import React, { useState } from "react";
import VotingCheckbox from "./VotingCheckbox";
import VotingBar from "./VotingBar";
import { CheckboxChoiceType } from "./CheckboxChoiceType";

interface VotingItemProps {
  votingItemID: string;
  desc: string;
  voteCount: number;
  progress: number;
  isChecked: boolean;
  handleNewProgress: Function;
}
export default function VotingItem({
  votingItemID,
  desc,
  voteCount,
  progress,
  isChecked,
  handleNewProgress,
}: VotingItemProps) {
  return (
    <div className="voting-item-container">
      <VotingCheckbox
        votingItemId={votingItemID}
        isChecked={isChecked}
        handleNewProgress={handleNewProgress}
      />
      <VotingBar desc={desc} voteCount={voteCount} progress={progress} />
    </div>
  );
}
