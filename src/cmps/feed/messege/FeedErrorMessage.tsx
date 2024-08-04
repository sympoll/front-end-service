import React from "react";

interface FeedErrorMessageProps {
  error: string | null;
}

export default function ErrorMessage({ error }: FeedErrorMessageProps) {
  return (
    <div className="feed-content-error-fetching-polls-container">
      <div className="feed-content-error-fetching-polls-message">
        Error Fetching Polls...
        <br />
        {error}
      </div>
    </div>
  );
}
