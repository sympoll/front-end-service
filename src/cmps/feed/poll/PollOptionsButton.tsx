import OptionsIcon from "@mui/icons-material/MoreVert";

interface PollOptionsButtonProps {
  onClick: () => void;
}

export default function PollOptionsButton({ onClick }: PollOptionsButtonProps) {
  return (
    <div className="poll-options-button">
      <OptionsIcon onClick={onClick} className="poll-options-button__icon" />
    </div>
  );
}
