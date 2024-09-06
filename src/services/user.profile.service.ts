import axios from "axios";
import { UserSignupData } from "../models/UserSignupData.model";
import { UserData } from "../models/UserData.model";
import { throwAxiosErr } from "./error.service";

const userServiceUrl = 
    import.meta.env.VITE_USER_SERVICE_URL;


export async function fetchUserData(userId : string) : Promise<UserData> {
    console.log("Fetching user data for user with ID: " + userId);
    try {
        const response = await axios
            .create({
                baseURL: userServiceUrl,
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            })
            .get(import.meta.env.VITE_USER_SERVICE_USER_BY_ID, { params: { userId }});

        return response.data;
    } catch (err) {
        console.error("Error fetching user info for user with ID: " + userId + ".");
        throw throwAxiosErr(err);
    }
}