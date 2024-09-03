import VotingCheckbox from "./VotingCheckbox";
import VotingBar from "./VotingBar";

interface VotingItemProps {
  votingItemID: number;
  description: string;
  voteCount: number;
  progress: number;
  isChecked: boolean;
  handleNewProgress: Function;
  showErrorPopup: () => void;
}
export default function VotingItem({
  votingItemID,
  description: desc,
  voteCount,
  progress,
  isChecked,
  handleNewProgress,
  showErrorPopup
}: VotingItemProps) {
  return (
    <div className="voting-item-container">
      <VotingCheckbox
        votingItemId={votingItemID}
        isChecked={isChecked}
        handleNewProgress={handleNewProgress}
        showErrorPopup={showErrorPopup}
      />
      <VotingBar desc={desc} voteCount={voteCount} progress={progress} />
    </div>
  );
}
