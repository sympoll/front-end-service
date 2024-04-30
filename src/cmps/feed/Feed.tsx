import React from "react";
import Poll from "./Poll";

export default function Feed() {
  return (
    <div className="feed-container">
      <Poll
        title="Poll Title 1"
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam convallis vehicula placerat."
      />
      <Poll
        title="Poll Title 2"
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam convallis vehicula placerat. Nunc bibendum mauris ac sollicitudin commodo. Maecenas ullamcorper."
      />
      <Poll
        title="Poll Title 3"
        content="Nam convallis vehicula placerat. Nunc bibendum mauris ac sollicitudin commodo. Maecenas ullamcorper."
      />
    </div>
  );
}
