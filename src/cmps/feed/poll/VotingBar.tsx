import React from "react";

interface VotingBarProps {
  desc: string;
  voteCount: number;
  progress: number;
}

export default function VotingBar({
  desc,
  voteCount,
  progress,
}: VotingBarProps) {
  return (
    <div className="voting-bar-container">
      <div className="voting-bar-fill" style={{ width: `${progress}%` }}></div>
      <div className="voting-bar-info-container">
        <div className="voting-bar-desc">{desc}</div>
        <div className="voting-bar-vote-count">{voteCount}</div>
      </div>
    </div>
  );
}
