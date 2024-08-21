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
    setFormData({
      ...formData,
      votingItems: formData.votingItems.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic with formData
    console.log("Form submitted", formData);
    toggleExpand(); // Collapse the form after submission
  };

  return (
    <div className="poll-form">
      <div className="poll-form__header" onClick={toggleExpand}>
        {!isExpanded && (
          <button className="poll-form__create-btn">Create Poll</button>
        )}
      </div>
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
          <input
            type="number"
            name="nofAnswersAllowed"
            placeholder="Number of available answers"
            value={formData.nofAnswersAllowed}
            onChange={handleInputChange}
          />
          <input
            type="datetime-local"
            name="deadline"
            placeholder="Choose deadline"
            value={formData.deadline}
            onChange={handleInputChange}
          />
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
