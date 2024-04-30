import React from "react";

interface PollProps {
  title: string;
}

export default function Poll({ title }: PollProps) {
  return (
    <section className="poll-item">
      <div id="poll-item-title">{title}</div>
      <div id="poll-item-content"></div>
    </section>
  );
}
