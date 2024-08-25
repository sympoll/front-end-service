import axios from "axios";
import { CreatePollData } from "../models/CreatePollData.model";
import { useState } from "react";

const pollServiceUrl =
  import.meta.env.VITE_BASE_URL +
  import.meta.env.VITE_API_GATEWAY_URL +
  import.meta.env.VITE_POLL_SERVICE_URL;

interface SubmitResult {
    success: boolean;
    errors?: string;
}

export function isAllVotingItemsDefined(votingItems: string[]): boolean {
    return votingItems.every(item => item !== "");
  }
  
  export function isTitleDefined(title: string): boolean {
    return title.trim() !== "";
  }
  
  export function isDeadlineValid(deadline: string): boolean {
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return false; // Invalid date
    }
  
    const now = new Date();
    return deadlineDate > now;
  }
  
  export function getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  export function validatePollForm(formData: CreatePollData): { isValid: boolean; errors: string } {
    let errors: string[] = [];

    if (!isTitleDefined(formData.title)) {
        errors.push("Title is required.\n");
    }

    if (!isAllVotingItemsDefined(formData.votingItems)) {
        errors.push("All voting options should be defined.\n");
    }

    if (!isDeadlineValid(formData.deadline)) {
        errors.push("Deadline should be a valid date in the future\n");
    }

    return {
        isValid: errors.length === 0,
        errors: errors.join(""),
    };
}

function formatDateForInput(deadline: string) {
    // Convert to ISO date time
    const isoDeadline = new Date(deadline);

    // Convert to backend date time
    const date = new Date(isoDeadline);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};


export async function handleSubmit(
    formData: CreatePollData,
    setErrors: (errors: string) => void
): Promise<SubmitResult> {
    const { isValid, errors } = validatePollForm(formData);

    if (!isValid) {
        setErrors(errors);
        return { success: false, errors };
    }

    try {
        // Format the deadline to ISO string
        formData.deadline = formatDateForInput(formData.deadline);
        const response = await fetch(pollServiceUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        console.log("Poll created successfully:", await response.json());
        return { success: true };
    } catch (error) {
        console.log("Error while trying to create poll:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setErrors(errorMessage);
        return { success: false, errors: errorMessage };
    }
}