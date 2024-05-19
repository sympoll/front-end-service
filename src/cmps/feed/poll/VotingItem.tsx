import React, { useState } from "react";
import VotingCheckbox from "./VotingCheckbox";
import VotingBar from "./VotingBar";
import { CheckboxChoiceType } from "./CheckboxChoiceType";

interface VotingItemProps {
  votingItemID: string;
  desc: string;
  mode: CheckboxChoiceType;
  voteCount: number;
  progress: number;
  handleNewProgress: Function;
}
export default function VotingItem({
  votingItemID,
  desc,
  mode,
  voteCount,
  progress,
  handleNewProgress,
}: VotingItemProps) {
  return (
    <div className="voting-item-container">
      <VotingCheckbox
        votingItemId={votingItemID}
        mode={mode}
        handleNewProgress={handleNewProgress}
      />
      <VotingBar desc={desc} voteCount={voteCount} progress={progress} />
    </div>
  );
}
