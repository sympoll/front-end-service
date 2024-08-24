import axios from "axios";

export const throwAxiosErr = (err : any) => {
    if (axios.isAxiosError(err)) {
        // Axios error - type narrowing
        if (err.response && err.response.data) {
        throw new Error((err.response.data as { message: string }).message || err.message);
        } else {
        throw new Error(err.message);
        }
    } else {
        // Handle unexpected errors
        throw new Error("An unexpected error occurred");
    }
}