import React, { Dispatch, SetStateAction, useState } from "react";
import { CheckboxChoiceType } from "./Enums";

interface VotingCheckboxProps {
  mode: CheckboxChoiceType;
  setProgress: Dispatch<SetStateAction<number>>;
}

export default function VotingCheckbox({
  mode,
  setProgress,
}: VotingCheckboxProps) {
  const [checked, setChecked] = useState<boolean>(false);

  const handleCheckboxChange = () => {
    setChecked(!checked);

    // IMPORTANT- change this to set the progress according to the total number of votes instead!
    checked ? setProgress(0) : setProgress(100);
  };

  return (
    <div className="voting-checkbox-container">
      <div className="cbx">
        <input
          checked={checked}
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
            <feGaussianBlur
              result="blur"
              stdDeviation="4"
              in="SourceGraphic"
            ></feGaussianBlur>
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
