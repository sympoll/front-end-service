import React from "react";

interface FeedErrorMessageProps {
  error: string | null;
}

/**
 * Provide error message string with '\n' characters to start a new line.
 */
export default function ErrorMessage({ error }: FeedErrorMessageProps) {
  return (
    <div className="feed-content-error-fetching-polls-container">
      <div className="feed-content-error-fetching-polls-message">
        Error Fetching Polls...
        <br />
        {error
          ? error.split("\n").map((line) => (
              <div>
                line
                <br />
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
