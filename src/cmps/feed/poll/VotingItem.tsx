import React, { useState } from "react";
import VotingCheckbox from "./VotingCheckbox";
import VotingBar from "./VotingBar";
import { CheckboxChoiceType } from "./CheckboxChoiceType";

interface VotingItemProps {
  id: string;
  desc: string;
  mode: CheckboxChoiceType;
  progress: number;
  handleNewProgress: Function;
}
export default function VotingItem({
  id,
  desc,
  mode,
  progress,
  handleNewProgress,
}: VotingItemProps) {
  return (
    <div className="voting-item-container">
      <VotingCheckbox
        votingItemId={id}
        mode={mode}
        handleNewProgress={handleNewProgress}
      />
      <VotingBar desc={desc} progress={progress} />
    </div>
  );
}
