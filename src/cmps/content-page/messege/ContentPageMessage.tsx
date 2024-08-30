import React from "react";

interface ContentPageMessageProps {
  msgText: string | null;
}

/**
 * Provide a message string with '&n' characters to start a new line.
 */
export default function ContentPageMessage({ msgText }: ContentPageMessageProps) {
  return (
    <div className="content-page-message-container">
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
