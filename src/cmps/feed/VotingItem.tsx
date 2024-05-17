import React from "react";
import VotingCheckBox from "./VotingCheckBox";
import VotingBar from "./VotingBar";

interface VotingItemProps {
  desc: string;
}
export default function VotingItem({ desc }: VotingItemProps) {
  return (
    <div className="voting-item-container">
      <VotingCheckBox />
      <VotingBar desc={desc} />
    </div>
  );
}
