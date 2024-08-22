import React, { useState } from "react";
import { CreatePollData } from "../../../models/CreatePollData";
import ErrorPopup from "../../popup/ErrorPopup";
import ErrorMessage from "../messege/FeedErrorMessage";
import CustomButton from "../../global/CustomButton";
import { useParams } from "react-router-dom";

interface CreatePollFormProps {
  groupId: string;
}

export default function CreatePollForm({ groupId }: CreatePollFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<CreatePollData>({
    title: "",
    description: "",
    nofAnswersAllowed: 1,
    creatorId: "", // Replace with actual creatorId
    groupId: groupId,
    deadline: "",
    votingItems: ["", "", ""],
  });

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const closeErrorPopup = () => {
    setIsErrorPopupVisible(false);
    setErrorMessage("");
  };

  const displayErrorPopup = (message: string) => {
    setErrorMessage(message);
    setIsErrorPopupVisible(true);

    setTimeout(() => {
      closeErrorPopup();
    }, 5000); // Hide after 5 seconds
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
    if (formData.votingItems.length < 9) {
      setFormData({
        ...formData,
        votingItems: [...formData.votingItems, ""],
      });
    } else {
      displayErrorPopup("You cannot have more than 9 options.");
    }
  };

  const removeVotingItem = (index: number) => {
    if (formData.votingItems.length > 2) {
      const updatedVotingItems = formData.votingItems.filter(
        (_, i) => i !== index
      );

      setFormData((prevFormData) => ({
        ...prevFormData,
        votingItems: updatedVotingItems,
        nofAnswersAllowed: Math.min(
          prevFormData.nofAnswersAllowed,
          updatedVotingItems.length
        ),
      }));
    } else {
      displayErrorPopup("You must have at least two voting items.");
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic with formData
    if (!isAllVotingItemsDefined()) {
      displayErrorPopup("All options need to contain a value");
    } else if (!isTitleDefined()) {
      displayErrorPopup("Poll needs to have title.");
    } else {
      console.log("Form submitted", formData);
      toggleExpand(); // Collapse the form after submission
    }
  };

  function isAllVotingItemsDefined(): boolean {
    for (const votingItem of formData.votingItems) {
      if (votingItem == "") {
        return false;
      }
    }
    return true;
  }

  function isTitleDefined(): boolean {
    return formData.title != "";
  }

  // Sets a limit on the number of answers the nofAnswersAllowed field can display
  const handleNofAnswersAllowedChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    var value = parseInt(e.target.value, 10);

    if (value > 10) {
      value = value % 10;
    }
    if (!isNaN(value) && value >= 1 && value <= formData.votingItems.length) {
      setFormData({
        ...formData,
        nofAnswersAllowed: value,
      });
    } else {
      setFormData({
        ...formData,
        nofAnswersAllowed: formData.nofAnswersAllowed,
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
        <div className="poll-form__closed">
          <CustomButton onClick={toggleExpand}>Create Poll</CustomButton>
        </div>
      )}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="poll-form__open">
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
              placeholder="Number of options a voter can pick"
              value={
                formData.nofAnswersAllowed >= 1
                  ? formData.nofAnswersAllowed
                  : ""
              }
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
          <CustomButton type="submit">Submit</CustomButton>
          <p>
            {isErrorPopupVisible && (
              <ErrorPopup
                message={errorMessage}
                closeErrorPopup={closeErrorPopup}
              />
            )}
          </p>
        </form>
      )}
    </div>
  );
}