import React from "react";
import Poll from "./Poll";

export default function Feed() {
  return (
    <div className="feed-container">
      Feed
      <Poll />
      <Poll />
      <Poll />
    </div>
  );
}
