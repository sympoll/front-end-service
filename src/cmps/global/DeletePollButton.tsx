
interface DeletePollButtonProps {
    onClick: () => void;
}

export default function DeletePollButton({onClick} : DeletePollButtonProps) {
    return (
        <button className="delete-poll-button" onClick={onClick}>
            <img src="../../../public/imgs/delete-button.png" alt="delete" className="delete-icon" />
        </button>
    );
}