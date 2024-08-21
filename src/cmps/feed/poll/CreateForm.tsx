import React, { useState } from "react";
import { CreatePollData } from "../../../models/CreatePollData";

export default function CreatePollForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState<CreatePollData>({
    title: "",
    description: "",
    nofAnswersAllowed: 1,
    creatorId: "", // Replace with actual creatorId
    groupId: "", // Replace with actual groupId
    deadline: "",
    votingItems: ["", "", ""],
  });

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleVotingItemChange = (index: number, value: string) => {
    const newVotingItems = [...formData.votingItems];
    newVotingItems[index] = value;
    setFormData({
      ...formData,
      votingItems: newVotingItems,
    });
  };

  const addVotingItem = () => {
    setFormData({
      ...formData,
      votingItems: [...formData.votingItems, ""],
    });
  };

  const removeVotingItem = (index: number) => {
    if (formData.votingItems.length > 1) {
      setFormData({
        ...formData,
        votingItems: formData.votingItems.filter((_, i) => i !== index),
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic with formData
    console.log("Form submitted", formData);
    toggleExpand(); // Collapse the form after submission
  };

  // Sets a limit on the number of answers the nofAnswersAllowed field can display
  const handleNofAnswersAllowedChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value, 10);

    if (isNaN(value)) {
      return; // Ignore invalid input
    }

    if (value > formData.votingItems.length) {
      setFormData({
        ...formData,
        nofAnswersAllowed: formData.votingItems.length,
      });
    } else if (value < 1) {
      setFormData({
        ...formData,
        nofAnswersAllowed: 1,
      });
    } else {
      setFormData({
        ...formData,
        nofAnswersAllowed: value,
      });
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="poll-form">
      {!isExpanded && (
        <div className="poll-form__header" onClick={toggleExpand}>
          <button className="poll-form__create-btn">Create Poll</button>
        </div>
      )}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="poll-form__body">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <div className="poll-form__settings">
            <input
              type="number"
              name="nofAnswersAllowed"
              placeholder="Number of available answers"
              value={formData.nofAnswersAllowed}
              onChange={handleNofAnswersAllowedChange}
            />
            <input
              type="datetime-local"
              name="deadline"
              placeholder="Choose deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              min={getCurrentDateTime()}
              onFocus={(e) => e.target.blur()}
            />
          </div>
          {formData.votingItems.map((votingItem, index) => (
            <div key={index} className="poll-form__voting-item">
              <button
                type="button"
                onClick={() => removeVotingItem(index)}
                className="poll-form__remove-btn"
              >
                -
              </button>
              <input
                type="text"
                value={votingItem}
                onChange={(e) => handleVotingItemChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addVotingItem}
            className="poll-form__add-btn"
          >
            +
          </button>
          <button type="submit" className="poll-form__submit-btn">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
