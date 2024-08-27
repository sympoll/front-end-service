import axios from "axios";
import { UserSignupData } from "../models/UserSignupData.model";
import { UserData } from "../models/UserData.model";
import { throwAxiosErr } from "./error.service";

const userServiceUrl = 
    import.meta.env.VITE_BASE_URL + 
    import.meta.env.VITE_API_GATEWAY_URL + 
    import.meta.env.VITE_USER_SERVICE_URL;


export async function fetchUserData(userId : string) : Promise<UserData> {
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
        console.error("Error signing up the user: " + userId + ".");
        throw throwAxiosErr(err);
    }
}