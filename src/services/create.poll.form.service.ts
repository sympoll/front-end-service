import axios from "axios";
import { CreatePollData } from "../models/CreatePollData.model";
import { PollData } from "../models/PollData.model";

const pollServiceUrl =
  import.meta.env.VITE_BASE_URL +
  import.meta.env.VITE_API_GATEWAY_URL +
  import.meta.env.VITE_POLL_SERVICE_URL;

interface SubmitResult {
    success: boolean;
    errors?: string;
    pollData?: PollData;
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

    if (isDuplicateVotingItemsDefined(formData.votingItems)) {
        errors.push("Duplicate voting options are not allowed.")
    }

    if (!isDeadlineValid(formData.deadline)) {
        errors.push("Deadline should be a valid date in the future.\n");
    }

    return {
        isValid: errors.length === 0,
        errors: errors.join(""),
    };
}

function isAllVotingItemsDefined(votingItems: string[]): boolean {
    return votingItems.every(item => item !== "");
}

function isDuplicateVotingItemsDefined(votingItems: string[]): boolean {
    const uniqueItems = new Set(votingItems);
    return uniqueItems.size !== votingItems.length;
}

function isTitleDefined(title: string): boolean {
    return title.trim() !== "";
}

function isDeadlineValid(deadline: string): boolean {
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
        return false; // Invalid date
    }
    const now = new Date();
    return deadlineDate > now;
}


export async function handleSubmit(
    formData: CreatePollData,
    displayErrorMessage: (errors: string) => void
): Promise<SubmitResult> {
    const { isValid, errors } = validatePollForm(formData);

    if (!isValid) {
        displayErrorMessage(errors);
        return { success: false, errors };
    }

    try {
        const deadlineDate = new Date(formData.deadline);
        formData.deadline = deadlineDate.toISOString();
        const response = await axios.post<PollData>(pollServiceUrl, formData, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("Poll created successfully:", response.data);
        return { success: true, pollData: response.data };
    } catch (error) {
        console.log("Error while trying to create poll:", error);
        const errorMessage = axios.isAxiosError(error) && error.response
            ? `Error: ${error.response.statusText}`
            : 'An unknown error occurred.';
        displayErrorMessage(errorMessage);
        return { success: false, errors: errorMessage };
    }
}