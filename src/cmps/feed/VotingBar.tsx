import React from "react";

interface VotingBarProps {
  desc: string;
  progress: number;
}

export default function VotingBar({ desc, progress }: VotingBarProps) {
  return (
    <div className="voting-bar-container">
      <div className="voting-bar-fill" style={{ width: `${progress}%` }}>
        <div className="voting-bar-desc">{desc}</div>
      </div>
    </div>
  );
}
