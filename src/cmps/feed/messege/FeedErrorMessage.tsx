import React from "react";

interface FeedErrorMessageProps {
  error: string | null;
}

/**
 * Provide error message string with '&n' characters to start a new line.
 */
export default function FeedErrorMessage({ error }: FeedErrorMessageProps) {
  return (
    <div className="feed-error-message-container">
      Error Fetching Polls...
      <br />
      {error
        ? error.split("&n").map((line, index) => (
            <React.Fragment key={index}>
              {line.trim() === "" ? <br /> : line}
              <br />
            </React.Fragment>
          ))
        : null}
    </div>
  );
}
