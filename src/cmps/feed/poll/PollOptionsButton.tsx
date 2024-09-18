import OptionsIcon from "@mui/icons-material/MoreVert";
import { useEffect, useRef, useState } from "react";

interface PollOptionsButtonProps {
  editPollOnClick?: () => void;
  savePollOnClick?: () => void;
  exitEditOnClick?: () => void;
  deletePollOnClick: () => void;
}

export default function PollOptionsButton({
  editPollOnClick,
  savePollOnClick,
  exitEditOnClick,
  deletePollOnClick
}: PollOptionsButtonProps) {
  const [isPollOptionsMenuVisible, setIsPollOptionsMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleOptionsMenuOnClick = () => {
    setIsPollOptionsMenuVisible(!isPollOptionsMenuVisible);
  };

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsPollOptionsMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleEditButtonClick = () => {
    if (editPollOnClick) {
      editPollOnClick();
      toggleOptionsMenuOnClick();
    }
  };

  const handleSaveButtonClick = () => {
    if (savePollOnClick) {
      savePollOnClick();
      toggleOptionsMenuOnClick();
    }
  };

  const handleExitButtonClick = () => {
    if (exitEditOnClick) {
      exitEditOnClick();
      toggleOptionsMenuOnClick();
    }
  };

  return (
    <div className="poll-options-container" ref={menuRef}>
      <div className="poll-options-button">
        <OptionsIcon onClick={toggleOptionsMenuOnClick} className="poll-options-button__icon" />
      </div>
      {isPollOptionsMenuVisible && (
        <div className="poll-options-menu">
          {editPollOnClick && <button onClick={handleEditButtonClick}>Edit Poll</button>}
          {savePollOnClick && <button onClick={handleSaveButtonClick}>Save Poll</button>}
          {exitEditOnClick && <button onClick={handleExitButtonClick}>Exit Editing</button>}
          <button onClick={deletePollOnClick}>Delete Poll</button>
        </div>
      )}
    </div>
  );
}
