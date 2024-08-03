import VotingCheckbox from "./VotingCheckbox";
import VotingBar from "./VotingBar";

interface VotingItemProps {
  votingItemID: string;
  votingItemOrdinal: number;
  description: string;
  voteCount: number;
  progress: number;
  isChecked: boolean;
  handleNewProgress: Function;
}
export default function VotingItem({
  votingItemID,
  description: desc,
  voteCount,
  progress,
  isChecked,
  handleNewProgress,
}: VotingItemProps) {
  return (
    <div className="voting-item-container">
      <VotingCheckbox
        votingItemId={votingItemID}
        isChecked={isChecked}
        handleNewProgress={handleNewProgress}
      />
      <VotingBar desc={desc} voteCount={voteCount} progress={progress} />
    </div>
  );
}
