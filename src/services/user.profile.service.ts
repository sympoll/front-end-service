import axios from "axios";
import { UserSignupData } from "../models/UserSignupData.model";
import { UserData } from "../models/UserData.model";
import { throwAxiosErr } from "./error.service";

const userServiceUrl = import.meta.env.VITE_USER_SERVICE_URL;

export async function fetchUserData(userId: string | undefined): Promise<UserData> {
  console.log("Fetching user data for user with ID: " + userId);
  try {
    const response = await axios.get(
      userServiceUrl + import.meta.env.VITE_USER_SERVICE_USER_BY_ID,
      { params: { userId } }
    );

    return response.data;
  } catch (err) {
    console.error("Error fetching user info for user with ID: " + userId + ".");
    throw throwAxiosErr(err);
  }
}

export function capitalizeWords(input: string): string {
  return input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}