import React from "react";

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
      <div id="poll-item-voting-container">Voting stuff</div>
    </section>
  );
}
