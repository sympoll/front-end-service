import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface VotingCheckboxProps {
  votingItemId: number;
  isChecked: boolean;
  handleNewProgress: Function;
  showErrorPopup: (message: string) => void;
}

export default function VotingCheckbox({
  votingItemId,
  isChecked,
  handleNewProgress,
  showErrorPopup
}: VotingCheckboxProps) {
  const [shakeClass, setShakeClass] = useState("");
  const [animationCooldown, setAnimationCooldown] = useState(false);

  const handleCheckboxChange = () => {
    if (!handleNewProgress(votingItemId, !isChecked)) {
      showErrorPopup("Already reached the number of votes limit");

      if (animationCooldown) return; // Animation did not complete, wait for the cooldown to end

      // Trigger cannot vote animation
      setShakeClass("shake");
      setAnimationCooldown(true);

      setTimeout(() => {
        setShakeClass("");
        setAnimationCooldown(false);
      }, 820); // Clear the shake class after the animation
    }
  };

  return (
    <div className={`voting-checkbox-container ${shakeClass}`}>
      <div className="cbx">
        <input
          id={votingItemId.toString()}
          checked={isChecked}
          type="checkbox"
          onChange={handleCheckboxChange}
        />
        <label htmlFor="cbx-12"></label>
        <svg fill="none" viewBox="0 0 15 14" height="14" width="15">
          <path d="M2 8.36364L6.23077 12L13 2"></path>
        </svg>
      </div>

      <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goo-12">
            <feGaussianBlur result="blur" stdDeviation="4" in="SourceGraphic"></feGaussianBlur>
            <feColorMatrix
              result="goo-12"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
              mode="matrix"
              in="blur"
            ></feColorMatrix>
            <feBlend in2="goo-12" in="SourceGraphic"></feBlend>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
