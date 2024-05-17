import React from "react";

interface VotingBarProps {
  desc: string;
}

export default function VotingBar({ desc }: VotingBarProps) {
  return <div className="voting-bar-container">{desc}</div>;
}
