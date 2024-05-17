import React from "react";
import VotingItem from "./VotingItem";
import { CheckboxChoiceType } from "./Enums";

interface PollProps {
  title: string;
  content: string;
  mode: CheckboxChoiceType;
}

export default function Poll({ title, content, mode }: PollProps) {
  // Add states for the voting action
  return (
    <section className="poll-item">
      <div id="poll-item-title">{title}</div>
      <div id="poll-item-content">{content}</div>
      <div id="poll-item-voting-container">
        <VotingItem desc="Voting option 1" mode={mode} />
        <VotingItem desc="Voting option 2" mode={mode} />
        <VotingItem desc="Voting option 3" mode={mode} />
        <VotingItem desc="Voting option 4" mode={mode} />
      </div>
    </section>
  );
}
