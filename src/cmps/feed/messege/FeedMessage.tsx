import React from "react";

interface FeedMessageProps {
  msgText: string | null;
}

/**
 * Provide a message string with '&n' characters to start a new line.
 */
export default function FeedMessage({ msgText }: FeedMessageProps) {
  return (
    <div className="feed-message-container">
      {msgText
        ? msgText.split("&n").map((line, index) => (
            <React.Fragment key={index}>
              {line.trim() === "" ? <br /> : line}
              <br />
            </React.Fragment>
          ))
        : null}
    </div>
  );
}
