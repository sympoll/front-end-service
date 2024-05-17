import React, { useState } from "react";
import VotingCheckbox from "./VotingCheckbox";
import VotingBar from "./VotingBar";
import { CheckboxChoiceType } from "./Enums";

interface VotingItemProps {
  desc: string;
  mode: CheckboxChoiceType;
}
export default function VotingItem({ desc, mode }: VotingItemProps) {
  const [progress, setProgress] = useState(0);

  return (
    <div className="voting-item-container">
      <VotingCheckbox mode={mode} />
      <VotingBar desc={desc} progress={progress} />
    </div>
  );
}
