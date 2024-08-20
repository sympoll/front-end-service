import React, { useState } from "react";
import { CreatePollData } from "../../../models/CreatePollData";

export default function CreateButton() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pollData, setPollData] = useState<CreatePollData>({
    title: "",
    description: "",
    nofAnswersAllowed: 1,
    creatorId: "", // Replace with actual creator ID
    groupId: "", // Replace with actual group ID
    deadline: new Date().toISOString(),
    votingItems: [],
  });

  const handleVotingItemChange = (index: number, value: string) => {
    const newVotingItems = [...pollData.votingItems];
    newVotingItems[index] = value;
    setPollData((prev) => ({ ...prev, votingItems: newVotingItems }));
  };

  const handleAddVotingItem = () => {
    setPollData((prev) => ({
      ...prev,
      votingItems: [...prev.votingItems, ""], // Add a new empty string for the new voting item
    }));
  };

  const handleRemoveVotingItem = (index: number) => {
    const newVotingItems = [...pollData.votingItems];
    newVotingItems.splice(index, 1);
    setPollData((prev) => ({ ...prev, votingItems: newVotingItems }));
  };

  const handleSubmit = () => {
    // Handle form submission here (e.g., send poll data to a server)
    setIsFormOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsFormOpen(!isFormOpen)}>
        {isFormOpen ? "Close Poll Creation" : "Create Poll"}
      </button>
      {isFormOpen && (
        <div>
          <input
            type="text"
            placeholder="Title"
            value={pollData.title}
            onChange={(e) =>
              setPollData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <textarea
            placeholder="Description"
            value={pollData.description}
            onChange={(e) =>
              setPollData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
          <label>Number of available answers:</label>
          <input
            type="number"
            value={pollData.nofAnswersAllowed}
            onChange={(e) =>
              setPollData((prev) => ({
                ...prev,
                nofAnswersAllowed: parseInt(e.target.value),
              }))
            }
          />
          <label>Deadline:</label>
          <input
            type="date"
            value={new Date(pollData.deadline).toISOString().split("T")[0]}
            onChange={(e) =>
              setPollData((prev) => ({
                ...prev,
                deadline: new Date(e.target.value).toISOString(),
              }))
            }
          />
          <div>
            {pollData.votingItems.map((votingItem, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={votingItem}
                  onChange={(e) =>
                    handleVotingItemChange(index, e.target.value)
                  }
                />
                <button onClick={() => handleRemoveVotingItem(index)}>
                  Remove
                </button>
              </div>
            ))}
            <button onClick={handleAddVotingItem}>Add Option</button>
          </div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
}
