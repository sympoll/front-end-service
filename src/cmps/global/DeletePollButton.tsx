import trashBinIcon from "/imgs/button/recycle-bin.png";
interface DeletePollButtonProps {
  onClick: () => void;
}

export default function DeletePollButton({ onClick }: DeletePollButtonProps) {
  return (
    <button className="delete-poll-button" onClick={onClick}>
      <img src={trashBinIcon} alt="delete" className="delete-poll-button__img" />
    </button>
  );
}
