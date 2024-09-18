interface VerifyPopupProps {
  headlineMessage: string;
  OnClickYes: () => void;
  onClose: () => void;
}

export default function VerifyPopup({ headlineMessage, OnClickYes, onClose }: VerifyPopupProps) {
  return (
    <div className="verify-popup-overlay" onClick={onClose}>
      <div className="verify-popup-container" onClick={(e) => e.stopPropagation()}>
        <h2>{"Are you sure you want to " + headlineMessage + "?"}</h2>
        <div className="verify-popup-buttons">
          <button className="verify-popup-button" onClick={OnClickYes}>
            Yes
          </button>
          <button className="verify-popup-button" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}
