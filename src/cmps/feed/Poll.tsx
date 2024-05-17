import React from "react";
import VotingItem from "./VotingItem";

interface PollProps {
  title: string;
  content: string;
}

export default function Poll({ title, content }: PollProps) {
  // Convert the voting container into a component
  return (
    <section className="poll-item">
      <div id="poll-item-title">{title}</div>
      <div id="poll-item-content">{content}</div>
      <div id="poll-item-voting-container">
        <VotingItem desc="Voting option 1" />
        <VotingItem desc="Voting option 2" />
        <VotingItem desc="Voting option 3" />
        <VotingItem desc="Voting option 4" />
      </div>
    </section>
  );
}
