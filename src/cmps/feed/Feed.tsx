import React from "react";
import Poll from "./Poll";

export default function Feed() {
  return (
    <div className="feed-container">
      <Poll title="Poll 1" />
      <Poll title="Poll 2" />
      <Poll title="Poll 3" />
    </div>
  );
}
