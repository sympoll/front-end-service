import React from "react"
import CreatePollForm from "../poll/CreatePollForm"

interface FeedErrorMessageProps {
  error: string | null
}

/**
 * Provide error message string with '&n' characters to start a new line.
 */
export default function ErrorMessage({ error }: FeedErrorMessageProps) {
  return (
    <div className="feed-content-error-fetching-polls-container">
      <div className="feed-content-error-fetching-polls-message">
        Error Fetching Polls...
        <CreatePollForm />;
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
    </div>
  )
}
